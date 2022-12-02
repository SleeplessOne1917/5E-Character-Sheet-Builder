import Race, { IRace } from '../../../db/models/race';
import Spell, { ISpell } from './../../../db/models/spell';

import { ApolloContext } from '../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import { Types } from 'mongoose';
import createSpellSchema from '../../../yup-schemas/createSpellSchema';
import { mustBeLoggedIn } from './../../../constants/generalConstants';
import raceSchema from '../../../yup-schemas/raceSchema';
import { throwErrorWithCustomMessageInProd } from '../../../server/character-sheet-builder/utils/trpcErrorUtils';

type CreateSpellArgs = {
	spell: Omit<ISpell, 'userId'>;
};

type UpdateSpellArgs = {
	id: string;
	spell: Omit<ISpell, 'userId'>;
};

type CreateRaceArgs = {
	race: Omit<IRace, 'userId'>;
};

const Mutation = {
	createSpell: async (
		parent: never,
		{ spell }: CreateSpellArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await createSpellSchema.validate(spell, { strict: true });

		try {
			Spell.create({ ...spell, userId: user._id });
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not create spell');
		}

		return 'Spell successfully created';
	},
	createRace: async (
		parent: never,
		{ race }: CreateRaceArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await raceSchema.validate(race, { strict: true });

		try {
			await Race.create({ ...race, userId: user._id });
		} catch (e) {
			throwErrorWithCustomMessageInProd(e as Error, 'Could not create race');
		}

		return 'Race successfully created';
	}
};

export default Mutation;
