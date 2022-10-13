import {
	tokenExpired,
	userDoesNotExist
} from './../../../constants/generalConstants';

import { ApolloContext } from './../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import Spell from './../../../db/models/spell';
import { Types } from 'mongoose';
import User from './../../../db/models/user';

type SkipLimit = {
	limit: number;
	skip?: number;
};

type WithId = {
	id: string;
};

const Query = {
	viewer: async (parent: never, args: never, { username }: ApolloContext) =>
		username,
	spells: async (
		parent: never,
		{ limit, skip }: SkipLimit,
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
			spells: (
				await Spell.find({ userId })
					.skip(skip ?? 0)
					.lean()
					.limit(limit)
			).map(spell => ({
				...spell,
				id: spell._id.toString()
			})),
			count: await Spell.countDocuments({ userId })
		};
	},
	spell: async (parent: never, { id }: WithId, { username }: ApolloContext) => {
		if (!username) {
			throw new ApolloError(tokenExpired);
		}

		const spell = await Spell.findOne({
			_id: new Types.ObjectId(id),
			username
		}).lean();

		if (!spell) {
			throw new ApolloError('Spell not found');
		}

		return { ...spell, id: spell?._id.toString() };
	}
};

export default Query;
