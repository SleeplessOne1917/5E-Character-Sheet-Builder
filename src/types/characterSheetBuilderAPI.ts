import { ISpell } from './../db/models/spell';

type WithId = { id: string };

export type Spell = Omit<ISpell & WithId, 'userId'>;

export type SpellItem = Pick<Spell, 'name' | 'id' | 'school' | 'level'>;
