import { protectedProcedure, router } from '../trpc';

import { Spell } from '../../../types/characterSheetBuilderAPI';
import SpellModel from '../../../db/models/spell';
import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import idSchema from '../../../yup-schemas/idSchema';
import spellSchema from '../../../yup-schemas/spellSchema';
import spellsQueryInputSchema from '../../../yup-schemas/spellsQueryInputSchema';
import { throwErrorWithCustomMessageInProd } from '../utils/trpcErrorUtils';

type SpellsQueryInputType =
	| {
			skip?: number;
			limit?: number;
			class?: string;
	  }
	| undefined;

const spellsRouter = router({
	spells: protectedProcedure
		.input(async val => {
			await spellsQueryInputSchema.validate(val);

			return val as SpellsQueryInputType;
		})
		.query(async ({ input, ctx: { user } }) => {
			const filter = { userId: user._id } as {
				userId: Types.ObjectId;
				'classes.id'?: string;
			};

			if (input?.class) {
				filter['classes.id'] = input.class;
			}

			let spells = SpellModel.find(filter).skip(input?.skip ?? 0);

			if (input?.limit) {
				if (input.limit < 1) {
					throw new TRPCError({
						message: 'Limit must be greater than 0',
						code: 'BAD_REQUEST'
					});
				}

				spells = spells.limit(input.limit);
			}

			return {
				spells: (await spells.lean()).map(spell => ({
					...spell,
					id: spell._id.toString()
				})),
				count: await SpellModel.countDocuments({ userId: user._id })
			};
		}),
	spell: protectedProcedure
		.input(idSchema)
		.query(async ({ input, ctx: { user } }) => {
			const spell = await SpellModel.findOne({
				_id: new Types.ObjectId(input),
				userId: user._id
			}).lean();

			if (!spell) {
				throw new TRPCError({ message: 'Spell not found', code: 'NOT_FOUND' });
			}

			return { ...spell, id: spell?._id.toString() };
		}),
	editSpell: protectedProcedure
		.input(async (val: any) => {
			await idSchema.validate(val.id);
			await spellSchema.validate(val.spell);

			return {
				id: val.id,
				spell: val.spell
			} as { id: string; spell: Omit<Spell, 'id'> };
		})
		.mutation(async ({ input: { id, spell }, ctx: { user } }) => {
			console.log('editing');
			try {
				await SpellModel.updateOne(
					{ _id: new Types.ObjectId(id), userId: user._id },
					{ $set: spell }
				);
			} catch (e) {
				throwErrorWithCustomMessageInProd(e as Error, 'Could not edit spell');
			}

			return 'Spell edited successfully';
		})
});

export default spellsRouter;
