import {
	tokenExpired,
	userDoesNotExist
} from './../../../constants/generalConstants';

import { ApolloContext } from './../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import Spell from './../../../db/models/spell';
import User from './../../../db/models/user';

type SkipLimit = {
	limit: number;
};

const Query = {
	viewer: async (parent: never, args: never, { username }: ApolloContext) =>
		username,
	spells: async (
		parent: never,
		{ limit }: SkipLimit,
		{ username }: ApolloContext
	) => {
		if (!username) {
			throw new ApolloError(tokenExpired);
		}

		const userId = (await User.findOne({ username }).lean())?._id;

		if (!userId) {
			throw new ApolloError(userDoesNotExist);
		}

		return {
			spells: (await Spell.find({ userId }).lean().limit(limit)).map(spell => ({
				...spell,
				id: spell._id.toString()
			})),
			count: await Spell.countDocuments({ userId })
		};
	}
};

export default Query;
