import { ApolloError } from 'apollo-server-micro';

export const throwErrorWithCustomMessageInProd = (
	error: Error,
	message: string
) => {
	const isDevelopment =
		(process.env.NODE_ENV || 'development') === 'development';
	throw isDevelopment ? error : new ApolloError(message);
};
