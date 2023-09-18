import { z } from 'zod';

export default <I extends string, N extends string>(id: I, name: N) =>
	z.object({
		id: z.literal(id, { required_error: 'Id is required' }),
		name: z.literal(name, { required_error: 'Name is required' })
	});
