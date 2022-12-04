import { SkipLimit, WithId } from '../../../../types/characterSheetBuilderAPI';

import { ApolloContext } from '../../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import Race from '../../../../db/models/race';
import { Types } from 'mongoose';
import { mustBeLoggedIn } from '../../../../constants/generalConstants';

const raceQueryResolvers = {
	races: async (
		parent: never,
		{ skip, limit }: SkipLimit,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		let races = Race.find().skip(skip ?? 0);

		if (limit) {
			if (limit < 1) {
				throw new ApolloError('Limit must be greater than 0');
			}

			races = races.limit(limit);
		}

		return {
			races: (await races.lean()).map(race => ({
				...race,
				id: race._id.toString()
			})),
			count: await Race.countDocuments({ userId: user._id })
		};
	},
	race: async (parent: never, { id }: WithId, { user }: ApolloContext) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		const race = await Race.findOne({
			_id: new Types.ObjectId(id),
			userId: user._id
		}).lean();

		if (!race) {
			throw new ApolloError('Race not found');
		}

		return { ...race, id: race?._id.toString() };
	}
};

export default raceQueryResolvers;
