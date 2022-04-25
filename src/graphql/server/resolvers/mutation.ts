import { ApolloError } from 'apollo-server-micro';
import User from '../../../db/models/user';
import { hashPassword } from '../../../services/passwordService';
import signUpSchema from '../../../yup-schemas/signUpSchema';

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
		await User.create({ email: user.email, hash });

		return { email: user.email };
	}
};

export default Mutation;
