import Race, { IRace } from '../../../db/models/race';
import Spell, { ISpell } from './../../../db/models/spell';
import { hashValue, verifyValue } from '../../../services/hashService';

import { ApolloContext } from '../../../types/apollo';
import { ApolloError } from 'apollo-server-micro';
import { Types } from 'mongoose';
import User from '../../../db/models/user';
import { mustBeLoggedIn } from './../../../constants/generalConstants';
import newPasswordSchema from '../../../yup-schemas/newPasswordSchema';
import raceSchema from '../../../yup-schemas/raceSchema';
import spellSchema from '../../../yup-schemas/spellSchema';
import { throwErrorWithCustomMessageInProd } from '../../../server/character-sheet-builder/utils/trpcErrorUtils';

type CreateNewPasswordArgs = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

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
	// This is the one for users to create a new password on their account page that requires your current password to update
	createNewPassword: async (
		parent: never,
		args: CreateNewPasswordArgs,
		{ user }: ApolloContext
	) => {
		if (!user) {
			throw new ApolloError(mustBeLoggedIn);
		}

		await newPasswordSchema.validate(args, { strict: true });

		if (!(await verifyValue(user.passwordHash, args.currentPassword))) {
			throw new ApolloError('Incorrect password provided');
		}

		if (args.newPassword !== args.confirmPassword) {
			throw new ApolloError('Passwords do not match');
		}

		const newPasswordHash = await hashValue(args.newPassword);
		await User.updateOne(
			{ _id: user._id },
			{ $set: { passwordHash: newPasswordHash } }
		);

		return 'Password successfully changed';
	},
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
