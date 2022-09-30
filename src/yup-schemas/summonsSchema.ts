import { array, number, object, string } from 'yup';

import { MONSTER_TYPES } from '../constants/monsterTypeConstants';
import { SIZES } from '../constants/sizeContants';

const isGTE3 = (num: number | undefined) => !!num && num >= 3;
const isLTE30 = (num: number | undefined) => !!num && num <= 30;

const getNameDescriptionSchema = (fieldName: string) =>
	object({
		name: string()
			.required(`Summon ${fieldName} name is required`)
			.max(30, `Summon ${fieldName} name cannot be more than 30 characters`),
		description: string()
			.required(`Summon ${fieldName} description is required`)
			.max(
				500,
				`Summon ${fieldName} description cannot be more than 500 characters`
			)
	});

const summonsSchema = array()
	.of(
		object({
			name: string()
				.required('Summon name is required')
				.min(1, 'Summon name is required')
				.max(30, 'Summon name cannot be longer than 30 characters.'),
			size: string()
				.required('Summon size is required')
				.test(
					'is-valid-size',
					'Summon size must be one of TINY, SMALL, MEDIUM, LARGE, HUGE, or GARGANTUAN',
					value => !!value && SIZES.includes(value)
				),
			type: string()
				.required('Summon type is required')
				.test(
					'is-valid-monster-type',
					'Summon type must be one of BEAST, MONSTROSITY, DRAGON, HUMANOID, UNDEAD, FIEND, CELESTIAL, CONSTRUCT, GIANT, ELEMENTAL, FEY, ABERRATION, OOZE, or PLANT.',
					value => !!value && MONSTER_TYPES.includes(value)
				),
			armorClass: string()
				.required('Summon armor class is required')
				.min(1, 'Summon armor class is required')
				.max(50, 'Summon armor class cannot be more than 50 characters.'),
			hitPoints: string()
				.required('Summon hit points are required')
				.min(1, 'Summon hit points are required')
				.max(50, 'Summon hit points cannot be more than 50 characters.'),
			speed: string()
				.required('Summon speed is required')
				.min(1, 'Summon speed is required')
				.max(50, 'Summon speed cannot be more than 50 characters.'),
			strength: number()
				.transform(value => (isNaN(value) ? undefined : value))
				.required('Summon strength is required')
				.integer('Summon strength must be integer')
				.test(
					'str-gte-3',
					'Summon strength must be greater than or equal to 3',
					isGTE3
				)
				.test(
					'str-lte-30',
					'Summon strength must be less than or equal to 30',
					isLTE30
				),
			dexterity: number()
				.transform(value => (isNaN(value) ? undefined : value))
				.required('Summon dexterity is required')
				.integer('Summon dexterity must be integer')
				.test(
					'dex-gte-3',
					'Summon dexterity must be greater than or equal to 3',
					isGTE3
				)
				.test(
					'dex-lte-30',
					'Summon dexterity must be less than or equal to 30',
					isLTE30
				),
			constitution: number()
				.transform(value => (isNaN(value) ? undefined : value))
				.required('Summon constitution is required')
				.integer('Summon constitution must be integer')
				.test(
					'con-gte-3',
					'Summon constitution must be greater than or equal to 3',
					isGTE3
				)
				.test(
					'con-lte-30',
					'Summon constitution must be less than or equal to 30',
					isLTE30
				),
			intelligence: number()
				.transform(value => (isNaN(value) ? undefined : value))
				.required('Summon intelligence is required')
				.integer('Summon intelligence must be integer')
				.test(
					'int-gte-3',
					'Summon intelligence must be greater than or equal to 3',
					isGTE3
				)
				.test(
					'int-lte-30',
					'Summon intelligence must be less than or equal to 30',
					isLTE30
				),
			wisdom: number()
				.transform(value => (isNaN(value) ? undefined : value))
				.required('Summon wisdom is required')
				.integer('Summon wisdom must be integer')
				.test(
					'wis-gte-3',
					'Summon wisdom must be greater than or equal to 3',
					isGTE3
				)
				.test(
					'wis-lte-30',
					'Summon wisdom must be less than or equal to 30',
					isLTE30
				),
			charisma: number()
				.transform(value => (isNaN(value) ? undefined : value))
				.required('Summon charisma is required')
				.integer('Summon charisma must be integer')
				.test(
					'wis-gte-3',
					'Summon charisma must be greater than or equal to 3',
					isGTE3
				)
				.test(
					'wis-lte-30',
					'Summon charisma must be less than or equal to 30',
					isLTE30
				),
			conditionImmunities: string()
				.max(
					100,
					'Summon condition immunities cannot be more than 100 characters'
				)
				.optional()
				.default(undefined),
			damageResistances: string()
				.max(
					100,
					'Summon damage resistances cannot be more than 100 characters'
				)
				.optional()
				.default(undefined),
			damageImmunities: string()
				.max(100, 'Summon damage immunities cannot be more than 100 characters')
				.optional()
				.default(undefined),
			savingThrows: string()
				.max(100, 'Summon saving throws cannot be more than 100 characters')
				.optional()
				.default(undefined),
			skills: string()
				.max(100, 'Summon skills cannot be more than 100 characters')
				.optional()
				.default(undefined),
			senses: string()
				.max(100, 'Summon senses cannot be more than 100 characters')
				.required('Summon senses are required'),
			languages: string()
				.max(100, 'Summon languages cannot be more than 100 characters')
				.required('Summon languages are required'),
			proficiencyBonus: string()
				.max(50, 'Summon proficiency bonus cannot be more than 50 characters')
				.required('Summon proficiency bonus is required'),
			specialAbilities: array()
				.of(getNameDescriptionSchema('special ability'))
				.optional()
				.default(undefined)
				.max(5, 'Cannot have more than 5 summon special abilities'),
			actions: array()
				.of(getNameDescriptionSchema('action'))
				.required('Summon actions are required')
				.min(1, 'Summon actions must have at least 1 action')
				.max(5, 'Cannot have more than 5 summon actions'),
			bonusActions: array()
				.of(getNameDescriptionSchema('bonus action'))
				.optional()
				.default(undefined)
				.max(5, 'Cannot have more than 5 summon bonus actions'),
			reactions: array()
				.of(getNameDescriptionSchema('reaction'))
				.optional()
				.default(undefined)
				.max(5, 'Cannot have more than 5 summon reactions')
		})
	)
	.optional()
	.default(undefined)
	.min(1, 'There must be at least one summon in the summons array')
	.max(5, 'No more than 5 summons allowed');

export default summonsSchema;
