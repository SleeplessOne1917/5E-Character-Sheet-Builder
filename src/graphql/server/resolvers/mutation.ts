import { ApolloError } from 'apollo-server-micro';
import User from '../../../db/models/user';
import { hashPassword } from '../../../services/passwordService';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import { throwErrorWithCustomMessageInProd } from '../../utils/apolloErrorUtils';

type UserRequest = {
	email: string;
	password: string;
};

type SignUpArgs = {
	user: UserRequest;
};

const Mutation = {
	signUp: async (parent, args: SignUpArgs) => {
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

		return { email: user.email };
	}
};

export default Mutation;
