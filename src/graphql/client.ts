import {
	Cache,
	DataFields,
	Variables,
	cacheExchange
} from '@urql/exchange-graphcache';
import { createClient, dedupExchange, fetchExchange } from 'urql';

const invalidateCache =
	(fieldName: string) =>
	(result: DataFields, args: Variables, cache: Cache) => {
		const key = 'Query';
		cache
			.inspectFields(key)
			.filter(field => field.fieldName === fieldName)
			.forEach(field => {
				cache.invalidate(key, field.fieldKey);
			});
	};

const updateSpell = (result: DataFields, args: Variables, cache: Cache) => {
	cache.invalidate({ __typename: 'Spell', id: args.id as string });
	invalidateCache('spells')(result, args, cache);
};

const createSpell = (result: DataFields, args: Variables, cache: Cache) => {
	invalidateCache('spells')(result, args, cache);
};

const updateRace = (result: DataFields, args: Variables, cache: Cache) => {
	cache.invalidate({ __typename: 'Race', id: args.id as string });
	invalidateCache('races')(result, args, cache);
};

const createRace = (result: DataFields, args: Variables, cache: Cache) => {
	invalidateCache('races')(result, args, cache);
};

const defaultClient = createClient({
	url: `/api/graphql`,
	exchanges: [
		dedupExchange,
		cacheExchange({
			updates: {
				Mutation: {
					updateSpell,
					createSpell,
					updateRace,
					createRace
				}
			}
		}),
		fetchExchange
	]
});

export default defaultClient;
