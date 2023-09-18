import {
	AbilityBonus,
	abilityBonusOptionsSchema,
	abilityBonusSchema,
	itemSchema,
	traitSchema
} from './common';
import { Model, Schema, Types, model, models } from 'mongoose';

import { Item } from '../../types/db/item';
import { SIZES } from '../../constants/sizeConstants';
import Size from '../../types/size';
import Trait from '../../types/trait';

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

const raceSchema = new Schema<IRace>({
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	name: { type: String, required: true, trim: true },
	abilityBonuses: [abilityBonusSchema],
	abilityBonusOptions: abilityBonusOptionsSchema,
	languages: [itemSchema],
	numberOfLanguageOptions: Number,
	size: { type: String, required: true, enum: SIZES },
	speed: { type: Number, required: true },
	traits: { type: [traitSchema], default: undefined }
});

export default (models.Race ||
	model<IRaceDocument>('Race', raceSchema, 'races')) as Model<IRaceDocument>;
