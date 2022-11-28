import { procedure, router } from '../trpc';
import {
	sendResetPassword,
	sendUsernameReminder
} from '../../../services/sendEmailService';

import ResetPasswordOTL from '../../../db/models/resetPasswordOTL';
import User from '../../../db/models/user';
import UsernameOTL from '../../../db/models/usernameOTL';
import forgotPasswordSchema from '../../../yup-schemas/forgotPasswordSchema';
import forgotUsernameSchema from '../../../yup-schemas/forgotUsernameSchema';
import { verifyValue } from '../../../services/hashService';

const forgotRouter = router({
	username: procedure
		.input(forgotUsernameSchema)
		.mutation(async ({ input }) => {
			for await (const user of User.find().lean()) {
				if (
					user.emailHash &&
					(await verifyValue(user.emailHash, input.email))
				) {
					const otl = await UsernameOTL.create({
						userId: user._id,
						createdAt: Date.now()
					});
					const link = `${process.env.ORIGIN}/forgot/username/${otl.id}`;
					sendUsernameReminder(input.email, link);
					break;
				}
			}

			return 'Email was sent if it exists.';
		}),
	password: procedure
		.input(forgotPasswordSchema)
		.mutation(async ({ input }) => {
			const user = await User.findOne({
				username: input.username
			}).lean();

			if (
				user &&
				user.emailHash &&
				(await verifyValue(user.emailHash, input.email))
			) {
				const otl = await ResetPasswordOTL.create({
					userId: user._id,
					createdAt: Date.now()
				});
				const link = `${process.env.ORIGIN}/forgot/password/${otl.id}`;
				sendResetPassword(input.email, link);
			}

			return "Email was sent if the user exists and the provided email matches the user's email.";
		})
});

export default forgotRouter;
