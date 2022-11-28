import { hashValue, verifyValue } from '../../../services/hashService';
import { procedure, protectedProcedure, router } from '../trpc';

import ResetPasswordOTL from '../../../db/models/resetPasswordOTL';
import { TRPCError } from '@trpc/server';
import User from '../../../db/models/user';
import newPasswordSchema from '../../../yup-schemas/newPasswordSchema';
import otlIdSchema from '../../../yup-schemas/otlIdSchema';
import resetPasswordSchema from '../../../yup-schemas/resetPasswordSchema';

const passwordRouter = router({
	validateReset: procedure.input(otlIdSchema).mutation(async ({ input }) => {
		const otl = await ResetPasswordOTL.findById(input);

		if (!otl) {
			throw new TRPCError({
				message: 'Link either expired or was incorrect',
				code: 'NOT_FOUND'
			});
		}

		return 'One time link is valid';
	}),
	// This is the one that is used on the page that is linked for users who forgot their password.
	// It uses a one time id on a link sent to the user's email address (if it exists) to handle authorization
	resetPassword: procedure
		.input(resetPasswordSchema)
		.mutation(async ({ input }) => {
			const otl = await ResetPasswordOTL.findById(input.otlId);

			if (!otl) {
				throw new TRPCError({
					message: 'Link either expired or was incorrect',
					code: 'NOT_FOUND'
				});
			}

			const passwordHash = await hashValue(input.password);
			const updateResponse = await User.updateOne(
				{ _id: otl.userId },
				{ $set: { passwordHash } }
			);
			await ResetPasswordOTL.deleteOne({ _id: otl._id });

			if (updateResponse.matchedCount === 0) {
				throw new TRPCError({
					message: 'User does not exist',
					code: 'NOT_FOUND'
				});
			}

			return 'Password was reset';
		}),
	// This is the one for users to create a new password on their account page that requires your current password to update
	createNewPassword: protectedProcedure
		.input(newPasswordSchema)
		.mutation(async ({ input, ctx: { user } }) => {
			if (
				!(await verifyValue(user?.passwordHash ?? '', input.currentPassword))
			) {
				throw new TRPCError({
					message: 'Incorrect password provided',
					code: 'UNAUTHORIZED'
				});
			}

			const newPasswordHash = await hashValue(input.newPassword);
			await User.updateOne(
				{ _id: user?._id },
				{ $set: { passwordHash: newPasswordHash } }
			);

			return 'Password successfully changed';
		})
});

export default passwordRouter;
