import { protectedProcedure, router } from '../trpc';

import Spell from '../../../db/models/spell';
import { TRPCError } from '@trpc/server';
import { Types } from 'mongoose';
import idSchema from '../../../yup-schemas/idSchema';
import spellsQueryInputSchema from '../../../yup-schemas/spellsQueryInputSchema';

const spellsRouter = router({
	spells: protectedProcedure
		.input(spellsQueryInputSchema)
		.query(async ({ input, ctx: { user } }) => {
			const filter = { userId: user._id } as {
				userId: Types.ObjectId;
				'classes.id'?: string;
			};

			if (input?.class) {
				filter['classes.id'] = input.class;
			}

			let spells = Spell.find(filter).skip(input?.skip ?? 0);

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
				count: await Spell.countDocuments({ userId: user._id })
			};
		}),
	spell: protectedProcedure
		.input(idSchema)
		.query(async ({ input, ctx: { user } }) => {
			const spell = await Spell.findOne({
				_id: new Types.ObjectId(input),
				userId: user._id
			}).lean();

			if (!spell) {
				throw new TRPCError({ message: 'Spell not found', code: 'NOT_FOUND' });
			}

			return { ...spell, id: spell?._id.toString() };
		})
});

export default spellsRouter;
