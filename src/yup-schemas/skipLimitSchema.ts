import { number, object } from 'yup';

const skipLimitSchema = object({
	skip: number().optional().default(undefined),
	limit: number().optional().default(undefined)
})
	.optional()
	.default(undefined);

export default skipLimitSchema;
