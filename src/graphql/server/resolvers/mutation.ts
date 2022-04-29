import {
	hashPassword,
	verifyPassword
} from '../../../services/passwordService';

import { ApolloError } from 'apollo-server-micro';
import User from '../../../db/models/user';
import jwt from 'jsonwebtoken';
import logInSchema from '../../../yup-schemas/logInSchema';
import nookies from 'nookies';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import { throwErrorWithCustomMessageInProd } from '../../utils/apolloErrorUtils';

type UserRequest = {
	email: string;
	password: string;
};

type AuthArgs = {
	user: UserRequest;
};

const Mutation = {
	signUp: async (parent, args: AuthArgs, { res }) => {
		const { user } = args;
		await signUpSchema.validate(user);

		const existingUser = await User.findOne({ email: user.email }).lean();
		if (existingUser) {
			throw new ApolloError('User already exists');
		}

		const hash = await hashPassword(user.password);

		try {
			await User.create({ email: user.email, hash });
		} catch (error) {
			throwErrorWithCustomMessageInProd(
				error as Error,
				'Could not add user to database'
			);
		}

		const token = jwt.sign(
			{ email: user.email },
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
	logIn: async (parent, args: AuthArgs, { res }) => {
		const user = args.user;
		await logInSchema.validate(user);

		const existingUser = await User.findOne({ email: user.email }).lean();
		if (!(existingUser && verifyPassword(existingUser.hash, user.password))) {
			throw new ApolloError('Email or password was incorrect');
		}

		const token = jwt.sign(
			{ email: user.email },
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
	}
};

export default Mutation;
