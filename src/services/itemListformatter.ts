import { Item } from '../types/db/item';

export const formatItemList = (items: Item[]) =>
	`${items.reduce(
		(acc, cur, index) =>
			`${acc}${index === 0 ? '' : ', '}${
				index === items.length - 1 ? 'and ' : ''
			}${cur.name}`,
		''
	)}.`;
