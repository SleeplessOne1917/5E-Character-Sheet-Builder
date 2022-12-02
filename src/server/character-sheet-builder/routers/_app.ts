import User, { IUser } from '../../../db/models/user';
import { hashValue, verifyValue } from '../../../services/hashService';
import { procedure, router } from '../trpc';

import { TRPCError } from '@trpc/server';
import forgotRouter from './forgot';
import passwordRouter from './password';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import { throwErrorWithCustomMessageInProd } from '../utils/trpcErrorUtils';
import usernameRouter from './username';

export const appRouter = router({
	signUp: procedure.input(signUpSchema).mutation(async ({ input }) => {
		const existingUser = await User.findOne({
			username: input.username
		}).lean();

		if (existingUser) {
			throw new TRPCError({ code: 'CONFLICT', message: 'User already exists' });
		}

		if (input.email) {
			for await (const u of User.find().lean()) {
				if (u.emailHash && (await verifyValue(u.emailHash, input.email))) {
					throw new TRPCError({
						code: 'CONFLICT',
						message: 'User already exists'
					});
				}
			}
		}

		const passwordHash = await hashValue(input.password);
		const newUser: IUser = { username: input.username, passwordHash };

		if (input.email) {
			const emailHash = await hashValue(input.email);
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
	}),
	forgot: forgotRouter,
	username: usernameRouter,
	password: passwordRouter
});

export type AppRouter = typeof appRouter;
