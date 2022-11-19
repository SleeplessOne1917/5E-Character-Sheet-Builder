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
	limit?: number;
	skip?: number;
};

type SpellsArgs = {
	level?: number;
	school?: string;
	class?: string;
	name?: string;
} & SkipLimit;

type WithId = {
	id: string;
};

const Query = {
	viewer: async (parent: never, args: never, { username }: ApolloContext) =>
		username,
	spells: async (
		parent: never,
		{ limit, skip, level, school, class: klass, name }: SpellsArgs,
		{ username }: ApolloContext
	) => {
		if (!username) {
			throw new ApolloError(tokenExpired);
		}

		const userId = (await User.findOne({ username }).lean())?._id;

		if (!userId) {
			throw new ApolloError(userDoesNotExist);
		}

		const filter = { userId } as {
			userId: Types.ObjectId;
			level?: number;
			'school.id'?: string;
			'classes.id'?: string;
			name?: { $regex: RegExp };
		};

		if (level || level === 0) {
			filter.level = level;
		}

		if (school) {
			filter['school.id'] = school;
		}

		if (klass) {
			filter['classes.id'] = klass;
		}

		if (name) {
			filter.name = { $regex: new RegExp(name, 'i') };
		}

		let spells = Spell.find(filter);

		if (limit) {
			if (limit < 1) {
				throw new ApolloError('Limit must be greater than 0');
			}

			spells = spells.skip(skip ?? 0).limit(limit);
		}

		return {
			spells: (await spells.lean()).map(spell => ({
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
