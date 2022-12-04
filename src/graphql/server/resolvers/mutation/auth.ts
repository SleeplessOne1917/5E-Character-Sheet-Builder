import User, { IUser } from '../../../../db/models/user';
import { hashValue, verifyValue } from '../../../../services/hashService';

import { ApolloContext } from '../../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import { mustBeLoggedIn } from '../../../../constants/generalConstants';
import newPasswordSchema from '../../../../yup-schemas/newPasswordSchema';
import signUpSchema from '../../../../yup-schemas/signUpSchema';
import { throwErrorWithCustomMessageInProd } from '../../../utils/apolloErrorUtils';

type SignUpUserRequest = {
	email?: string;
	username: string;
	password: string;
};

type SignUpArgs = {
	user: SignUpUserRequest;
};

type CreateNewPasswordArgs = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

const authMutationResolvers = {
	signUp: async (parent: never, args: SignUpArgs) => {
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
		try {
			await User.create(newUser);
		} catch (error) {
			throwErrorWithCustomMessageInProd(
				error as Error,
				'Could not add user to database'
			);
		}

		return 'Signed up';
	},
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
	}
};

export default authMutationResolvers;
