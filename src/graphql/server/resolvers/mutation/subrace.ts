import Subrace, { ISubrace } from '../../../../db/models/subrace';

import { ApolloContext } from '../../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import { mustBeLoggedIn } from '../../../../constants/generalConstants';
import subraceSchema from '../../../../yup-schemas/subraceSchema';
import { throwErrorWithCustomMessageInProd } from '../../../utils/apolloErrorUtils';

type CreateSubraceArgs = {
	subrace: Omit<ISubrace, 'userId'>;
};

const subraceMutationResolvers = {
	createSubrace: async (
		parent: never,
		{ subrace }: CreateSubraceArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await subraceSchema.validate(subrace, { strict: true });

		try {
			await Subrace.create({ ...subrace, userId: user._id });
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not create subrace');
		}

		return 'Subrace successfully created';
	}
};

export default subraceMutationResolvers;
