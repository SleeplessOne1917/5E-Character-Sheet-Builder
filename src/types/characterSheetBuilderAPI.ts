import { ISpell } from './../db/models/spell';

export type Spell = ISpell & { id: string };
