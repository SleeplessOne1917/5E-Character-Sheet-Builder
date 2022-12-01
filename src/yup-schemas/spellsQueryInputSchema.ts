import skipLimitSchema from './skipLimitSchema';
import { string } from 'yup';

const spellsQueryInputSchema = skipLimitSchema.shape({
	class: string().optional().default(undefined)
});

export default spellsQueryInputSchema;
