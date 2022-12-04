import { SkipLimit, WithId } from '../../../../types/characterSheetBuilderAPI';

import { ApolloContext } from '../../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import Spell from '../../../../db/models/spell';
import { Types } from 'mongoose';
import { mustBeLoggedIn } from '../../../../constants/generalConstants';

type SpellsArgs = {
	class?: string;
} & SkipLimit;

const spellQueryResolvers = {
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
	}
};

export default spellQueryResolvers;
