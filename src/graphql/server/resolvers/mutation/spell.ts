import Spell, { ISpell } from '../../../../db/models/spell';

import { ApolloContext } from '../../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import { Types } from 'mongoose';
import { mustBeLoggedIn } from '../../../../constants/generalConstants';
import spellSchema from '../../../../yup-schemas/spellSchema';
import { throwErrorWithCustomMessageInProd } from '../../../utils/apolloErrorUtils';

type CreateSpellArgs = {
	spell: Omit<ISpell, 'userId'>;
};

type UpdateSpellArgs = {
	id: string;
	spell: Omit<ISpell, 'userId'>;
};

const spellMutationResolvers = {
	createSpell: async (
		parent: never,
		{ spell }: CreateSpellArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await spellSchema.validate(spell, { strict: true });

		try {
			Spell.create({ ...spell, userId: user._id });
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not create spell');
		}

		return 'Spell successfully created';
	},
	updateSpell: async (
		parent: never,
		{ spell, id }: UpdateSpellArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await spellSchema.validate(spell, { strict: true });

		try {
			await Spell.updateOne(
				{ _id: new Types.ObjectId(id), userId: user._id },
				{ $set: spell }
			);
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not edit spell');
		}

		return 'Spell edited successfully';
	}
};

export default spellMutationResolvers;
