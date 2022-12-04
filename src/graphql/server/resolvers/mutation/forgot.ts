import { hashValue, verifyValue } from '../../../../services/hashService';
import {
	sendResetPassword,
	sendUsernameReminder
} from '../../../../services/sendEmailService';

import { ApolloError } from 'apollo-server-micro';
import ResetPasswordOTL from '../../../../db/models/resetPasswordOTL';
import { Types } from 'mongoose';
import User from '../../../../db/models/user';
import UsernameOTL from '../../../../db/models/usernameOTL';
import forgotPasswordSchema from '../../../../yup-schemas/forgotPasswordSchema';
import forgotUsernameSchema from '../../../../yup-schemas/forgotUsernameSchema';
import resetPasswordSchema from '../../../../yup-schemas/resetPasswordSchema';

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

const forgoMutationtResolvers = {
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
				const link = `${process.env.ORIGIN}/forgot/username/${otl.id}`;
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
					const link = `${process.env.ORIGIN}/forgot/password/${otl.id}`;
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

		const user = await User.findById(otl.userId);

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
	}
};

export default forgoMutationtResolvers;
