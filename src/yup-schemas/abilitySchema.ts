import { object, string } from 'yup';

const abilitySchema = object({
	id: string().required('Ability id is required'),
	name: string().required('Ability name required')
}).test(
	'ability-is-valid',
	'Ability id must be one of "str", "dex", "con", "cha", "int", or "wis"',
	value =>
		!!value &&
		!!value.id &&
		!!value.name &&
		((value.id === 'str' && value.name === 'Strength') ||
			(value.id === 'dex' && value.name === 'Dexterity') ||
			(value.id === 'con' && value.name === 'Constitution') ||
			(value.id === 'cha' && value.name === 'Charisma') ||
			(value.id === 'int' && value.name === 'Intelligence') ||
			(value.id === 'wis' && value.name === 'Wisdom'))
);

export default abilitySchema;
