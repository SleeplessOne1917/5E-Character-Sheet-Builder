import { procedure, router } from '../trpc';

import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import User from '../../../db/models/user';
import UsernameOTL from '../../../db/models/usernameOTL';
import otlIdSchema from '../../../yup-schemas/otlIdSchema';

const usernameRouter = router({
	remind: procedure.input(otlIdSchema).mutation(async ({ input }) => {
		const otl = await UsernameOTL.findById(new Types.ObjectId(input));

		if (!otl) {
			throw new TRPCError({
				message: 'Link either expired or was incorrect',
				code: 'NOT_FOUND'
			});
		}

		await UsernameOTL.deleteOne({ _id: otl._id });

		const user = await User.findById(otl.userId);

		if (!user) {
			throw new TRPCError({
				message: 'User does not exist',
				code: 'NOT_FOUND'
			});
		}

		return user.username;
	})
});

export default usernameRouter;
