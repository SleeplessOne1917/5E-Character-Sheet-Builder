import Subrace, { ISubrace } from '../../../../db/models/subrace';

import { ApolloContext } from '../../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import { Types } from 'mongoose';
import { mustBeLoggedIn } from '../../../../constants/generalConstants';
import subraceSchema from '../../../../yup-schemas/subraceSchema';
import { throwErrorWithCustomMessageInProd } from '../../../utils/apolloErrorUtils';

type CreateSubraceArgs = {
	subrace: Omit<ISubrace, 'userId'>;
};

type UpdateSubraceArgs = {
	id: string;
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
	},
	updateSubrace: async (
		parent: never,
		{ subrace, id }: UpdateSubraceArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await subraceSchema.validate(subrace, { strict: true });

		try {
			await Subrace.updateOne(
				{ _id: new Types.ObjectId(id), userId: user._id },
				{ $set: subrace }
			);
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not edit subrace');
		}

		return 'Subrace edited successfully';
	}
};

export default subraceMutationResolvers;
