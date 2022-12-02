import { protectedProcedure, router } from '../trpc';

import { Race } from '../../../types/characterSheetBuilderAPI';
import RaceModel from '../../../db/models/race';
import raceSchema from '../../../yup-schemas/raceSchema';
import { throwErrorWithCustomMessageInProd } from '../utils/trpcErrorUtils';

const racesRouter = router({
	createRace: protectedProcedure
		.input(async (val: unknown) => {
			await raceSchema.validate(val);

			return val as Omit<Race, 'id'>;
		})
		.mutation(async ({ input, ctx: { user } }) => {
			try {
				await RaceModel.create({ ...input, userId: user._id });
			} catch (e) {
				throwErrorWithCustomMessageInProd(e as Error, 'Could not create race');
			}

			return 'Race successfully created';
		})
});

export default racesRouter;
