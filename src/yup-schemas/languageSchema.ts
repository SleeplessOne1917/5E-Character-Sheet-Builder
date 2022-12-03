import { object, string } from 'yup';

const languageSchema = object({
	id: string().required('Language id is required'),
	name: string().required('Language name is required')
}).test(
	'language-is-valid',
	'Language must be one of "infernal", "goblin", "primordial", "sylvan", "common", "halfling", "celestial", "draconic", "dwarvish", "elvish", "gnomish", "orc", "abyssal", "deep-speech", "giant", or "undercommon"',
	value =>
		!!value &&
		!!value.id &&
		!!value.name &&
		((value.id === 'infernal' && value.name === 'Infernal') ||
			(value.id === 'goblin' && value.name === 'Goblin') ||
			(value.id === 'primordial' && value.name === 'Primordial') ||
			(value.id === 'sylvan' && value.name === 'Sylvan') ||
			(value.id === 'common' && value.name === 'Common') ||
			(value.id === 'halfling' && value.name === 'Halfling') ||
			(value.id === 'celestial' && value.name === 'Celestial') ||
			(value.id === 'draconic' && value.name === 'Draconic') ||
			(value.id === 'dwarvish' && value.name === 'Dwarvish') ||
			(value.id === 'elvish' && value.name === 'Elvish') ||
			(value.id === 'gnomish' && value.name === 'Gnomish') ||
			(value.id === 'orc' && value.name === 'Orc') ||
			(value.id === 'abyssal' && value.name === 'Abyssal') ||
			(value.id === 'deep-speech' && value.name === 'Deep Speech') ||
			(value.id === 'giant' && value.name === 'Giant') ||
			(value.id === 'undercommon' && value.name === 'Undercommon'))
);

export default languageSchema;
