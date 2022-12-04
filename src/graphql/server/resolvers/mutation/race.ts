import Race, { IRace } from '../../../../db/models/race';

import { ApolloContext } from '../../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import { Types } from 'mongoose';
import { mustBeLoggedIn } from '../../../../constants/generalConstants';
import raceSchema from '../../../../yup-schemas/raceSchema';
import { throwErrorWithCustomMessageInProd } from '../../../utils/apolloErrorUtils';

type CreateRaceArgs = {
	race: Omit<IRace, 'userId'>;
};

type UpdateRaceArgs = {
	id: string;
	race: Omit<IRace, 'userId'>;
};

const raceMutationResolvers = {
	createRace: async (
		parent: never,
		{ race }: CreateRaceArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await raceSchema.validate(race, { strict: true });

		try {
			await Race.create({ ...race, userId: user._id });
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not create race');
		}

		return 'Race successfully created';
	},
	updateRace: async (
		parent: never,
		{ race, id }: UpdateRaceArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await raceSchema.validate(race, { strict: true });

		try {
			await Race.updateOne(
				{ _id: new Types.ObjectId(id), userId: user._id },
				{ $set: race }
			);
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not edit race');
		}

		return 'Race edited successfully';
	}
};

export default raceMutationResolvers;
