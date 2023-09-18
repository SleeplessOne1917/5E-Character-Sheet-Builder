import { z } from 'zod';
import sizeSchema from './sizeSchema';

const getNameDescriptionSchema = (fieldName: string) =>
	z.object({
		name: z
			.string({ required_error: `${fieldName} name is required` })
			.max(50, `${fieldName} name cannot be more than 50 characters`),
		description: z
			.string({ required_error: `${fieldName} description is required` })
			.max(500, `${fieldName} description cannot be more than 500 characters`)
	});

const getStatSchema = (abilityName: string) =>
	z
		.number({ required_error: `${abilityName} is required` })
		.int(`${abilityName} must be integer`)
		.gte(3, `${abilityName} must be greater than or equal to 3`)
		.lte(30, `${abilityName} must be less than or equal to 30`)
		.transform(value => (isNaN(value) ? undefined : value));

const summonsSchema = z
	.array(
		z.object({
			name: z
				.string({ required_error: 'Name is required' })
				.trim()
				.nonempty('Name is required')
				.max(50, 'Name cannot be longer than 30 characters.'),
			size: sizeSchema,
			type: z.union(
				[
					z.literal('BEAST'),
					z.literal('MONSTROSITY'),
					z.literal('DRAGON'),
					z.literal('HUMANOID'),
					z.literal('UNDEAD'),
					z.literal('FIEND'),
					z.literal('CELESTIAL'),
					z.literal('CONSTRUCT'),
					z.literal('GIANT'),
					z.literal('ELEMENTAL'),
					z.literal('FEY'),
					z.literal('ABERRATION'),
					z.literal('OOZE'),
					z.literal('PLANT')
				],
				{
					required_error: 'Type is required',
					invalid_type_error:
						'Summon type must be one of BEAST, MONSTROSITY, DRAGON, HUMANOID, UNDEAD, FIEND, CELESTIAL, CONSTRUCT, GIANT, ELEMENTAL, FEY, ABERRATION, OOZE, or PLANT.'
				}
			),
			armorClass: z
				.string({ required_error: 'Armor class is required' })
				.trim()
				.nonempty('Armor class is required')
				.max(100, 'Armor class cannot be more than 50 characters.'),
			hitPoints: z
				.string({ required_error: 'Hit points are required' })
				.trim()
				.nonempty('Hit points are required')
				.max(100, 'Hit points cannot be more than 50 characters.'),
			speed: z
				.string({ required_error: 'Speed is required' })
				.trim()
				.nonempty('Speed is required')
				.max(100, 'Summon speed cannot be more than 50 characters.'),
			strength: getStatSchema('Strength'),
			dexterity: getStatSchema('Dexterity'),
			constitution: getStatSchema('Constitution'),
			intelligence: getStatSchema('Intelligence'),
			wisdom: getStatSchema('Wisdom'),
			charisma: getStatSchema('Charisma'),
			conditionImmunities: z
				.string()
				.max(100, 'Condition immunities cannot be more than 100 characters')
				.optional(),
			damageResistances: z
				.string()
				.max(100, 'Damage resistances cannot be more than 100 characters')
				.optional(),
			damageImmunities: z
				.string()
				.max(100, 'Damage immunities cannot be more than 100 characters')
				.optional(),
			savingThrows: z
				.string()
				.max(100, 'Saving throws cannot be more than 100 characters')
				.optional(),
			skills: z
				.string()
				.max(100, 'Skills cannot be more than 100 characters')
				.optional(),
			senses: z
				.string({ required_error: 'Senses are required' })
				.trim()
				.nonempty('Senses are required')
				.max(100, 'Summon senses cannot be more than 100 characters'),
			languages: z
				.string({ required_error: 'Languages are required' })
				.max(100, 'Languages cannot be more than 100 characters'),
			proficiencyBonus: z
				.string({ required_error: 'Proficiency bonus is required' })
				.max(100, 'Proficiency bonus cannot be more than 50 characters'),
			specialAbilities: z
				.array(getNameDescriptionSchema('Special ability'))
				.max(5, 'Cannot have more than 5 special abilities')
				.optional(),
			actions: z
				.array(getNameDescriptionSchema('Action'), {
					required_error: 'Actions are required'
				})
				.min(1, 'Actions must have at least 1 action')
				.max(5, 'Cannot have more than 5 actions'),
			bonusActions: z
				.array(getNameDescriptionSchema('Bonus action'))
				.max(5, 'Cannot have more than 5 bonus actions')
				.optional(),
			reactions: z
				.array(getNameDescriptionSchema('Reaction'))
				.max(5, 'Cannot have more than 5 reactions')
				.optional()
		})
	)
	.optional()
	.default(undefined)
	.max(5, 'No more than 5 summons allowed');

export default summonsSchema;
