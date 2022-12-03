import { Item } from '../types/db/item';
import { SrdItem } from '../types/srd';

export const mapItem = (srdItem: SrdItem): Item => ({
	id: srdItem.index,
	name: srdItem.name
});

export const combineItemArrays = (...itemsArrays: Item[][]) => {
	const combined = itemsArrays.reduce((acc, cur) => [...acc, ...cur], []);

	return [...combined].sort((a, b) => a.name.localeCompare(b.name));
};
