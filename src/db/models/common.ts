import { Item } from '../../types/db/item';
import { MONSTER_TYPES } from '../../constants/monsterTypeConstants';
import { SIZES } from '../../constants/sizeConstants';
import { Schema } from 'mongoose';
import { Summon } from '../../types/summon';
import Trait from '../../types/trait';

/* eslint-disable @typescript-eslint/ban-ts-comment */

export const itemSchema = new Schema<Item>({
	// @ts-ignore
	_id: false,
	id: { type: String, required: true },
	name: { type: String, required: true, trim: true }
});

const nameDescriptionSchema = new Schema<{ name: string; description: string }>(
	{
		// @ts-ignore
		_id: false,
		name: { type: String, required: true, trim: true },
		description: { type: String, required: true, trim: true }
	}
);

export const summonSchema = new Schema<Summon>({
	// @ts-ignore
	_id: false,
	name: { type: String, required: true, trim: true },
	size: { type: String, required: true, trim: true, enum: SIZES },
	type: { type: String, required: true, trim: true, enum: MONSTER_TYPES },
	armorClass: { type: String, required: true, trim: true },
	hitPoints: { type: String, required: true, trim: true },
	speed: { type: String, required: true, trim: true },
	strength: { type: Number, required: true },
	dexterity: { type: Number, required: true },
	constitution: { type: Number, required: true },
	wisdom: { type: Number, required: true },
	intelligence: { type: Number, required: true },
	charisma: { type: Number, required: true },
	conditionImmunities: { type: String, trim: true },
	damageResistances: { type: String, trim: true },
	damageImmunities: { type: String, trim: true },
	skills: { type: String, trim: true },
	savingThrows: { type: String, trim: true },
	senses: { type: String, required: true, trim: true },
	languages: { type: String, required: true, trim: true },
	proficiencyBonus: { type: String, required: true, trim: true },
	specialAbilities: { type: [nameDescriptionSchema], default: undefined },
	actions: { type: [nameDescriptionSchema], required: true },
	bonusActions: { type: [nameDescriptionSchema], default: undefined },
	reactions: { type: [nameDescriptionSchema], default: undefined }
});

export const abilityBonusSchema = new Schema<{
	abilityScore: Item;
	bonus: number;
}>({
	// @ts-ignore
	_id: false,
	abilityScore: { type: itemSchema, required: true },
	bonus: { type: Number, required: true }
});

export const abilityBonusOptionsSchema = new Schema<{
	abilityScore: Item;
	bonus: number;
}>({
	// @ts-ignore
	_id: false,
	numberOfAbilityScores: { type: Number, required: true },
	bonus: { type: Number, required: true }
});

const chooseOptionsSchema = new Schema<{ choose: number; options: Item[] }>({
	// @ts-ignore
	_id: false,
	choose: { type: Number, required: true },
	options: { type: [itemSchema], required: true }
});

const subtraitSchema = new Schema<Trait>({
	// @ts-ignore
	_id: false,
	uuid: { type: String, required: true, trim: true, unique: true },
	name: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	hpBonusPerLevel: Number,
	proficiencies: [itemSchema],
	proficiencyOptions: chooseOptionsSchema,
	spells: { type: [itemSchema], default: undefined },
	spellOptions: chooseOptionsSchema
});

const subtraitOptionsSchema = new Schema<{
	choose: number;
	options: Omit<Trait, 'subtraitOptions'>[];
}>({
	// @ts-ignore
	_id: false,
	choose: { type: Number, required: true },
	options: { type: [subtraitSchema], required: true }
});

export const traitSchema = new Schema<Trait>({
	// @ts-ignore
	_id: false,
	uuid: { type: String, required: true, trim: true, unique: true },
	name: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	hpBonusPerLevel: Number,
	proficiencies: { type: [itemSchema], default: undefined },
	proficiencyOptions: chooseOptionsSchema,
	spells: { type: [itemSchema], default: undefined },
	spellOptions: chooseOptionsSchema,
	subtraitOptions: subtraitOptionsSchema
});

export type AbilityBonus = {
	abilityScore: Item;
	bonus: number;
};
