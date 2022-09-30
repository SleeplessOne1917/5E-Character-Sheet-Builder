import { MonsterType } from './srd';
import Size from './size';

type NameDescription = {
	name: string;
	description: string;
};

export type Summon = {
	name: string;
	size: Size;
	type: MonsterType;
	armorClass: string;
	hitPoints: string;
	speed: string;
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
	conditionImmunities?: string;
	damageResistances?: string;
	damageImmunities?: string;
	skills?: string;
	savingThrows?: string;
	senses: string;
	languages: string;
	proficiencyBonus: string;
	specialAbilities?: NameDescription[];
	actions: NameDescription[];
	bonusActions?: NameDescription[];
	reactions?: NameDescription[];
};
