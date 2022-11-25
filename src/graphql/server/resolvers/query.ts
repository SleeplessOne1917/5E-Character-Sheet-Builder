import { ApolloContext } from './../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import Spell from './../../../db/models/spell';
import { Types } from 'mongoose';
import { mustBeLoggedIn } from './../../../constants/generalConstants';

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
	viewer: (parent: never, args: never, { user }: ApolloContext) =>
		user?.username,
	spells: async (
		parent: never,
		{ limit, skip, level, school, class: klass, name }: SpellsArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		const filter = { userId: user._id } as {
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

		let spells = Spell.find(filter).skip(skip ?? 0);

		if (limit) {
			if (limit < 1) {
				throw new ApolloError('Limit must be greater than 0');
			}

			spells = spells.limit(limit);
		}

		return {
			spells: (await spells.lean()).map(spell => ({
				...spell,
				id: spell._id.toString()
			})),
			count: await Spell.countDocuments({ userId: user._id })
		};
	},
	spell: async (parent: never, { id }: WithId, { user }: ApolloContext) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		const spell = await Spell.findOne({
			_id: new Types.ObjectId(id),
			userId: user._id
		}).lean();

		if (!spell) {
			throw new ApolloError('Spell not found');
		}

		return { ...spell, id: spell?._id.toString() };
	}
};

export default Query;
