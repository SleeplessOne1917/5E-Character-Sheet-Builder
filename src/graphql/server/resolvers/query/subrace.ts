import { SkipLimit, WithId } from '../../../../types/characterSheetBuilderAPI';

import { ApolloContext } from '../../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import Subrace from '../../../../db/models/subrace';
import { Types } from 'mongoose';
import { mustBeLoggedIn } from '../../../../constants/generalConstants';

const subraceQueryResolvers = {
	subraces: async (
		parent: never,
		{ skip, limit }: SkipLimit,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		let subraces = Subrace.find().skip(skip ?? 0);

		if (limit) {
			if (limit < 1) {
				throw new ApolloError('Limit must be greater than 0');
			}

			subraces = subraces.limit(limit);
		}

		return {
			subraces: (await subraces.lean()).map(subrace => ({
				...subrace,
				id: subrace._id.toString()
			})),
			count: await Subrace.countDocuments({ userId: user._id })
		};
	},
	subrace: async (parent: never, { id }: WithId, { user }: ApolloContext) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		const subrace = await Subrace.findOne({
			_id: new Types.ObjectId(id),
			userId: user._id
		}).lean();

		if (!subrace) {
			throw new ApolloError('Subrace not found');
		}

		return { ...subrace, id: subrace?._id.toString() };
	}
};

export default subraceQueryResolvers;
