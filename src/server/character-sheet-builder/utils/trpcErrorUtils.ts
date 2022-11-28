import { TRPCError } from '@trpc/server';

export const throwErrorWithCustomMessageInProd = (
	error: Error,
	message: string
) => {
	const isDevelopment =
		(process.env.NODE_ENV || 'development') === 'development';

	const msg = isDevelopment ? error.message : message;

	throw new TRPCError({ message: msg, code: 'INTERNAL_SERVER_ERROR' });
};
