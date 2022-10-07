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
		const userId = (await User.findOne({ username }).lean())?._id;

		if (!userId) {
			throw new ApolloError('Must be logged in to fetch spells');
		}

		return (await Spell.find({ userId }).lean().limit(limit)).map(spell => ({
			...spell,
			id: spell._id.toString()
		}));
	}
};

export default Query;
