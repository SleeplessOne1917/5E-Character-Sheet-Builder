import Credentials from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import User from '../db/models/user';
import dbConnect from '../db/dbConnect';
import logInSchema from '../yup-schemas/logInSchema';
import { verifyValue } from '../services/hashService';

export const nextAuthOptions: NextAuthOptions = {
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				username: { label: 'Username', type: 'text' },
				password: { label: 'Password', type: 'password' }
			},
			authorize: async credentials => {
				await dbConnect();
				try {
					await logInSchema.validate(credentials, { strict: true });
				} catch (e) {
					return null;
				}

				const existingUser = await User.findOne({
					username: credentials?.username
				}).lean();
				if (
					!(
						existingUser &&
						(await verifyValue(
							existingUser.passwordHash,
							credentials?.password ?? ''
						))
					)
				) {
					return null;
				}

				return {
					id: existingUser._id.toString(),
					name: existingUser.username
				};
			}
		})
	],
	callbacks: {
		jwt: ({ token, user }) => {
			if (user) {
				token.name = user.name;
			}

			return token;
		},
		session: ({ session, token }) => {
			if (token) {
				session.user = { name: token.name };
			}

			return session;
		}
	},
	jwt: {
		secret: process.env.JWT_SECRET,
		maxAge: 15 * 24 * 60 * 60 // 15 days
	},
	pages: {
		signIn: '/log-in',
		newUser: '/sign-up'
	}
};
