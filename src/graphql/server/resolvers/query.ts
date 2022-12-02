import { ApolloContext } from './../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import Race from '../../../db/models/race';
import Spell from './../../../db/models/spell';
import { Types } from 'mongoose';
import { mustBeLoggedIn } from './../../../constants/generalConstants';

type SkipLimit = {
	limit?: number;
	skip?: number;
};

type SpellsArgs = {
	class?: string;
} & SkipLimit;

type WithId = {
	id: string;
};

const Query = {
	spells: async (
		parent: never,
		{ limit, skip, class: klass }: SpellsArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		const filter = { userId: user._id } as {
			userId: Types.ObjectId;
			'classes.id'?: string;
		};

		if (klass) {
			filter['classes.id'] = klass;
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
	},
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

export default Query;
