import { Item } from '../../types/db/item';
import { SpellComponent } from '../../types/srd';
import { Summon } from '../../types/summon';
import { Types, Schema, model, models, Model } from 'mongoose';
import Document from '../../types/db/document';
import { itemSchema, summonSchema } from './common';

export interface ISpell {
	userId: Types.ObjectId;
	name: string;
	level: number;
	castingTime: string;
	duration: string;
	range: string;
	school: Item;
	components: SpellComponent[];
	material?: string;
	concentration: boolean;
	ritual: boolean;
	description: string;
	atHigherLevels?: string;
	damageType?: Item;
	classes: Item[];
	summons?: Summon[];
}

export interface ISpellDocument extends ISpell, Document {}

const spellSchema = new Schema<ISpell>({
	userId: { type: Schema.Types.ObjectId, required: true },
	name: { type: String, required: true, trim: true },
	level: { type: Number, required: true },
	castingTime: { type: String, required: true, trim: true },
	duration: { type: String, required: true, trim: true },
	range: { type: String, required: true, trim: true },
	school: { type: itemSchema, required: true },
	components: { type: [String], required: true, enum: ['V', 'S', 'M'] },
	material: { type: String, trim: true },
	concentration: { type: Boolean, required: true },
	ritual: { type: Boolean, required: true },
	description: { type: String, required: true, trim: true },
	atHigherLevels: { type: String, trim: true },
	damageType: itemSchema,
	classes: { type: [itemSchema], required: true },
	summons: [summonSchema]
});

export default (models.Spell ||
	model<ISpellDocument>(
		'Spell',
		spellSchema,
		'spells'
	)) as Model<ISpellDocument>;
