import { z } from 'zod';

export default z.union(
	[
		z.literal('TINY'),
		z.literal('SMALL'),
		z.literal('MEDIUM'),
		z.literal('LARGE'),
		z.literal('HUGE'),
		z.literal('GARGANTUAN')
	],
	{
		required_error: 'Size is required',
		invalid_type_error:
			'Size must be one of "TINY", "SMALL", "MEDIUM", "LARGE", "HUGE", or "GARGANTUAN"'
	}
);
