import { IRace } from '../db/models/race';
import { ISpell } from './../db/models/spell';
import { ISubrace } from '../db/models/subrace';
import { Types } from 'mongoose';

export type WithId = { id: string };

type APIType<T extends { userId: Types.ObjectId }> = Omit<T & WithId, 'userId'>;

export type Spell = APIType<ISpell>;

export type Race = APIType<IRace>;

export type Subrace = APIType<ISubrace>;

export type SpellItem = Pick<Spell, 'name' | 'id' | 'school' | 'level'>;

export type SkipLimit = {
	limit?: number;
	skip?: number;
};
