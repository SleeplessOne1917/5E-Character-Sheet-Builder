import { Model, Schema, Types, model, models } from 'mongoose';

import { Item } from '../../types/db/item';
import { SIZES } from '../../constants/sizeConstants';
import Size from '../../types/size';
import Trait from '../../types/trait';
import { itemSchema } from './common';

export type AbilityBonus = {
	abilityScore: Item;
	bonus: number;
};

/* eslint-disable @typescript-eslint/ban-ts-comment */
export interface IRace {
	userId: Types.ObjectId;
	name: string;
	abilityBonuses: AbilityBonus[];
	abilityBonusOptions?: {
		bonus: number;
		numberOfAbilityScores: number;
	};
	languages: Item[];
	numberOfLanguageOptions?: number;
	size: Size;
	speed: number;
	traits?: Trait[];
}

export interface IRaceDocument extends IRace, Document {}

const abilityBonusesSchema = new Schema<{
	abilityScore: Item;
	bonus: number;
}>({
	// @ts-ignore
	_id: false,
	abilityScore: { type: itemSchema, required: true },
	bonus: { type: Number, required: true }
});

const abilityBonusOptionsSchema = new Schema<{
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
	spells: [itemSchema],
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

const traitSchema = new Schema<Trait>({
	// @ts-ignore
	_id: false,
	uuid: { type: String, required: true, trim: true, unique: true },
	name: { type: String, required: true, trim: true },
	description: { type: String, required: true, trim: true },
	hpBonusPerLevel: Number,
	proficiencies: [itemSchema],
	proficiencyOptions: chooseOptionsSchema,
	spells: [itemSchema],
	spellOptions: chooseOptionsSchema,
	subtraitOptions: subtraitOptionsSchema
});

const raceSchema = new Schema<IRace>({
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	name: { type: String, required: true, trim: true },
	abilityBonuses: { type: [abilityBonusesSchema], required: true },
	abilityBonusOptions: abilityBonusOptionsSchema,
	languages: { type: [itemSchema], required: true },
	numberOfLanguageOptions: Number,
	size: { type: String, required: true, enum: SIZES },
	speed: { type: Number, required: true },
	traits: [traitSchema]
});

export default (models.Race ||
	model<IRaceDocument>('Race', raceSchema, 'races')) as Model<IRaceDocument>;
