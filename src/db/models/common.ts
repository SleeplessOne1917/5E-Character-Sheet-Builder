import { Schema } from 'mongoose';
import { MONSTER_TYPES } from '../../constants/monsterTypeConstants';
import { SIZES } from '../../constants/sizeContants';
import { Item } from '../../types/db/item';
import { Summon } from '../../types/summon';
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
	specialAbilities: [nameDescriptionSchema],
	actions: { type: [nameDescriptionSchema], required: true },
	bonusActions: [nameDescriptionSchema],
	reactions: [nameDescriptionSchema]
});
