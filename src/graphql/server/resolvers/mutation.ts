import User, { IUser } from '../../../db/models/user';
import { hashValue, verifyValue } from '../../../services/hashService';
import {
	sendResetPassword,
	sendUsernameReminder
} from './../../../services/sendEmailService';

import { ApolloContext } from '../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import forgotPasswordSchema from '../../../yup-schemas/forgotPasswordSchema';
import forgotUsernameSchema from '../../../yup-schemas/forgotUsernameSchema';
import jwt from 'jsonwebtoken';
import logInSchema from '../../../yup-schemas/logInSchema';
import nookies from 'nookies';
import signUpSchema from '../../../yup-schemas/signUpSchema';
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

const Mutation = {
	signUp: async (parent, args: SignUpArgs, { res }: ApolloContext) => {
		const { user } = args;
		await signUpSchema.validate(user);

		const existingUser = await User.findOne({ username: user.username }).lean();
		if (existingUser) {
			throw new ApolloError('User already exists');
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

		const token = jwt.sign(
			{ username: user.username },
			process.env.JWT_SECRET as string,
			{
				expiresIn: '1h'
			}
		);

		nookies.set({ res }, 'token', token, {
			httpOnly: true,
			maxAge: 60 * 60,
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'Strict',
			path: '/'
		});

		return { token };
	},
	logIn: async (parent, args: LoginArgs, { res }: ApolloContext) => {
		const user = args.user;
		await logInSchema.validate(user);

		const existingUser = await User.findOne<IUser>({
			username: user.username
		}).lean();
		if (
			!(existingUser && verifyValue(existingUser.passwordHash, user.password))
		) {
			throw new ApolloError('Username or password was incorrect');
		}

		const token = jwt.sign(
			{ username: user.username },
			process.env.JWT_SECRET as string,
			{
				expiresIn: '1h'
			}
		);

		nookies.set({ res }, 'token', token, {
			httpOnly: true,
			maxAge: 60 * 60,
			secure: process.env.NODE_ENV !== 'development',
			sameSite: 'Strict',
			path: '/'
		});

		return { token };
	},
	logOut: async (parent, args, { res, username }: ApolloContext) => {
		if (username) {
			nookies.destroy({ res }, 'token', {
				path: '/'
			});
			return username;
		} else {
			return null;
		}
	},
	forgotUsername: async (parent, { request }: ForgotUsernameArgs) => {
		await forgotUsernameSchema.validate(request);

		const users = await User.find<IUser>().lean();
		for (const user of users) {
			if (
				user.emailHash &&
				(await verifyValue(user.emailHash, request.email))
			) {
				sendUsernameReminder(request.email);
				break;
			}
		}

		return {
			message: 'Email was sent if it exists.'
		};
	},
	forgotPassword: async (parent, { request }: ForgotPasswordArgs) => {
		await forgotPasswordSchema.validate(request);

		const user = await User.findOne<IUser>({
			username: request.username
		}).lean();
		if (user) {
			if (user.emailHash) {
				if (await verifyValue(user.emailHash, request.email)) {
					sendResetPassword(request.email);
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
	}
};

export default Mutation;
