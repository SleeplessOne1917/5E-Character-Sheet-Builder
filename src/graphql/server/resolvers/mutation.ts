import Race, { IRace } from '../../../db/models/race';
import Spell, { ISpell } from './../../../db/models/spell';
import User, { IUser, IUserDocument } from '../../../db/models/user';
import { hashValue, verifyValue } from '../../../services/hashService';
import {
	sendResetPassword,
	sendUsernameReminder
} from './../../../services/sendEmailService';

import { ApolloContext } from '../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import ResetPasswordOTL from '../../../db/models/resetPasswordOTL';
import { Types } from 'mongoose';
import UsernameOTL from '../../../db/models/usernameOTL';
import forgotPasswordSchema from '../../../yup-schemas/forgotPasswordSchema';
import forgotUsernameSchema from '../../../yup-schemas/forgotUsernameSchema';
import { getSession } from '../../../services/sessionService';
import logInSchema from '../../../yup-schemas/logInSchema';
import { mustBeLoggedIn } from './../../../constants/generalConstants';
import newPasswordSchema from '../../../yup-schemas/newPasswordSchema';
import raceSchema from '../../../yup-schemas/raceSchema';
import resetPasswordSchema from '../../../yup-schemas/resetPasswordSchema';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import spellSchema from '../../../yup-schemas/spellSchema';
import { throwErrorWithCustomMessageInProd } from '../../utils/apolloErrorUtils';

interface LoginUserRequest {
	username: string;
	password: string;
}

interface SignUpUserRequest extends LoginUserRequest {
	email?: string;
}

type LoginArgs = {
	user: LoginUserRequest;
};

type SignUpArgs = {
	user: SignUpUserRequest;
};

interface ForgotRequest {
	email: string;
}

interface ForgotPasswordRequest extends ForgotRequest {
	username: string;
}

type ForgotUsernameArgs = {
	request: ForgotRequest;
};

type ForgotPasswordArgs = {
	request: ForgotPasswordRequest;
};

interface OTLArgs {
	otlId: string;
}

interface ResetPasswordArgs extends OTLArgs {
	password: string;
	confirmPassword: string;
}

type CreateNewPasswordArgs = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

type CreateSpellArgs = {
	spell: Omit<ISpell, 'userId'>;
};

type UpdateSpellArgs = {
	id: string;
	spell: Omit<ISpell, 'userId'>;
};

type CreateRaceArgs = {
	race: Omit<IRace, 'userId'>;
};

const Mutation = {
	signUp: async (
		parent: never,
		args: SignUpArgs,
		{ req, res }: ApolloContext
	) => {
		const { user } = args;
		await signUpSchema.validate(user, { strict: true });

		const existingUser = await User.findOne({ username: user.username }).lean();
		if (existingUser) {
			throw new ApolloError('User already exists');
		}

		if (user.email) {
			for await (const u of User.find().lean()) {
				if (u.emailHash && (await verifyValue(u.emailHash, user.email))) {
					throw new ApolloError('User already exists');
				}
			}
		}

		const passwordHash = await hashValue(user.password);
		const newUser: IUser = { username: user.username, passwordHash };

		if (user.email) {
			const emailHash = await hashValue(user.email);
			newUser.emailHash = emailHash;
		}

		let sessionUser = undefined as unknown as IUserDocument;
		try {
			sessionUser = await User.create(newUser);
		} catch (error) {
			throwErrorWithCustomMessageInProd(
				error as Error,
				'Could not add user to database'
			);
		}

		const session = await getSession(req, res);
		session.user = sessionUser;

		return 'Signed up';
	},
	logIn: async (
		parent: never,
		args: LoginArgs,
		{ req, res }: ApolloContext
	) => {
		const user = args.user;
		await logInSchema.validate(user, { strict: true });

		const existingUser = await User.findOne({
			username: user.username
		}).lean();
		if (
			!(
				existingUser &&
				(await verifyValue(existingUser.passwordHash, user.password))
			)
		) {
			throw new ApolloError('Username or password was incorrect');
		}

		const session = await getSession(req, res);
		session.user = existingUser;

		return 'Logged in';
	},
	logout: async (parent: never, args: never, { res, req }: ApolloContext) => {
		const session = await getSession(req, res);

		await session.destroy();

		return 'Logged off';
	},
	forgotUsername: async (parent: never, { request }: ForgotUsernameArgs) => {
		await forgotUsernameSchema.validate(request, { strict: true });

		for await (const user of User.find().lean()) {
			if (
				user.emailHash &&
				(await verifyValue(user.emailHash, request.email))
			) {
				const otl = await UsernameOTL.create({
					userId: user._id,
					createdAt: Date.now()
				});
				const link = `${process.env.PROTOCOL_AND_DOMAIN}/forgot/username/${otl.id}`;
				sendUsernameReminder(request.email, link);
				break;
			}
		}

		return {
			message: 'Email was sent if it exists.'
		};
	},
	forgotPassword: async (parent: never, { request }: ForgotPasswordArgs) => {
		await forgotPasswordSchema.validate(request, { strict: true });

		const user = await User.findOne({
			username: request.username
		}).lean();
		if (user) {
			if (user.emailHash) {
				if (await verifyValue(user.emailHash, request.email)) {
					const otl = await ResetPasswordOTL.create({
						userId: user._id,
						createdAt: Date.now()
					});
					const link = `${process.env.PROTOCOL_AND_DOMAIN}/forgot/password/${otl.id}`;
					sendResetPassword(request.email, link);
				}
			} else {
				throw new ApolloError(
					'Provided user does not have email address in the system'
				);
			}
		} else {
			throw new ApolloError('User does not exist');
		}

		return {
			message:
				'Email was sent if the provided email matches the email in the system.'
		};
	},
	remindUsername: async (parent: never, { otlId }: OTLArgs) => {
		const errorMessage = 'Link either expired or was incorrect';
		let otlIdObjId: Types.ObjectId;

		try {
			otlIdObjId = new Types.ObjectId(otlId);
		} catch (e) {
			throw new ApolloError(errorMessage);
		}

		if (otlIdObjId.toString() !== otlId) {
			throw new ApolloError(errorMessage);
		}

		const otl = await UsernameOTL.findById(otlIdObjId);

		if (!otl) {
			throw new ApolloError(errorMessage);
		}

		await UsernameOTL.deleteOne({ _id: otlIdObjId });

		// eslint-disable-next-line testing-library/await-async-query
		const user = await User.findById(otl.userId).lean();

		if (!user) {
			throw new ApolloError('User does not exist');
		}

		return user.username;
	},
	validateResetPassword: async (parent: never, { otlId }: OTLArgs) => {
		const errorMessage = 'Link either expired or was incorrect';
		let otlIdObjId: Types.ObjectId;

		try {
			otlIdObjId = new Types.ObjectId(otlId);
		} catch (e) {
			throw new ApolloError(errorMessage);
		}

		if (otlIdObjId.toString() !== otlId) {
			throw new ApolloError(errorMessage);
		}

		const otl = await ResetPasswordOTL.findById(otlIdObjId);

		if (!otl) {
			throw new ApolloError(errorMessage);
		}

		return 'One time link is valid';
	},
	// This is the one that is used on the page that is linked for users who forgot their password.
	// It uses a one time id on a link sent to the user's email address (if it exists) to handle authorization
	resetPassword: async (
		parent: never,
		{ otlId, ...args }: ResetPasswordArgs
	) => {
		const errorMessage = 'Link either expired or was incorrect';
		let otlIdObjId: Types.ObjectId;

		try {
			otlIdObjId = new Types.ObjectId(otlId);
		} catch (e) {
			throw new ApolloError(errorMessage);
		}

		if (otlIdObjId.toString() !== otlId) {
			throw new ApolloError(errorMessage);
		}

		await resetPasswordSchema.validate(args, { strict: true });

		const otl = await ResetPasswordOTL.findById(otlIdObjId);

		if (!otl) {
			throw new ApolloError(errorMessage);
		}

		if (args.password !== args.confirmPassword) {
			throw new ApolloError('Passwords do not match');
		}

		const passwordHash = await hashValue(args.password);
		const updateResponse = await User.updateOne(
			{ _id: otl.userId },
			{ $set: { passwordHash } }
		);
		await ResetPasswordOTL.deleteOne({ _id: otlIdObjId });

		if (updateResponse.matchedCount === 0) {
			throw new ApolloError('User does not exist');
		}

		return 'Password was reset';
	},
	// This is the one for users to create a new password on their account page that requires your current password to update
	createNewPassword: async (
		parent: never,
		args: CreateNewPasswordArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await newPasswordSchema.validate(args, { strict: true });

		if (!(await verifyValue(user.passwordHash, args.currentPassword))) {
			throw new ApolloError('Incorrect password provided');
		}

		if (args.newPassword !== args.confirmPassword) {
			throw new ApolloError('Passwords do not match');
		}

		const newPasswordHash = await hashValue(args.newPassword);
		await User.updateOne(
			{ _id: user._id },
			{ $set: { passwordHash: newPasswordHash } }
		);

		return 'Password successfully changed';
	},
	createSpell: async (
		parent: never,
		{ spell }: CreateSpellArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await spellSchema.validate(spell, { strict: true });

		try {
			Spell.create({ ...spell, userId: user._id });
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not create spell');
		}

		return 'Spell successfully created';
	},
	updateSpell: async (
		parent: never,
		{ spell, id }: UpdateSpellArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await spellSchema.validate(spell, { strict: true });

		try {
			await Spell.updateOne(
				{ _id: new Types.ObjectId(id), userId: user._id },
				{ $set: spell }
			);
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not edit spell');
		}

		return 'Spell edited successfully';
	},
	createRace: async (
		parent: never,
		{ race }: CreateRaceArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await raceSchema.validate(race, { strict: true });

		try {
			await Race.create({ ...race, userId: user._id });
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not create race');
		}

		return 'Race successfully created';
	}
};

export default Mutation;
