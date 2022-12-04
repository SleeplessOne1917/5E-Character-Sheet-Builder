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
export interface ISubrace {
	userId: Types.ObjectId;
	name: string;
	race: Item;
	abilityBonuses?: AbilityBonus[];
	abilityBonusOptions?: {
		bonus: number;
		numberOfAbilityScores: number;
	};
	languages?: Item[];
	numberOfLanguageOptions?: number;
	size?: Size;
	speed?: number;
	traits?: Trait[];
	omittedRaceTraits?: string[];
}

export interface ISubraceDocument extends ISubrace, Document {}

const subraceSchema = new Schema<ISubrace>({
	userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
	race: { type: itemSchema, required: true },
	name: { type: String, required: true, trim: true },
	abilityBonuses: { type: [abilityBonusSchema], default: undefined },
	abilityBonusOptions: abilityBonusOptionsSchema,
	languages: { type: [itemSchema], default: undefined },
	numberOfLanguageOptions: Number,
	size: { type: String, enum: SIZES },
	speed: Number,
	omittedRaceTraits: { type: [String], default: undefined },
	traits: { type: [traitSchema], default: undefined }
});

export default (models.Subrace ||
	model<ISubraceDocument>(
		'Subrace',
		subraceSchema,
		'subraces'
	)) as Model<ISubraceDocument>;
