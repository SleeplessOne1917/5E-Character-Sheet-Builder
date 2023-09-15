import { z } from 'zod';

const getSizeSchema = (context: string) =>
	z.union(
		[
			z.literal('TINY'),
			z.literal('SMALL'),
			z.literal('MEDIUM'),
			z.literal('LARGE'),
			z.literal('HUGE'),
			z.literal('GARGANTUAN')
		],
		{
			required_error: `${context} size is required`,
			invalid_type_error: `${context} size must be one of "TINY", "SMALL", "MEDIUM", "LARGE", "HUGE", or "GARGANTUAN"`
		}
	);

export default getSizeSchema;
