import { gql } from 'urql/core';

const typeDefs = gql`
	type NameDescription {
		name: String!
		description: String!
	}

	input NameDescriptionInput {
		name: String!
		description: String!
	}

	type Summon {
		name: String!
		size: Size!
		type: MonsterType!
		armorClass: String!
		hitPoints: String!
		speed: String!
		strength: Int!
		dexterity: Int!
		constitution: Int!
		wisdom: Int!
		charisma: Int!
		intelligence: Int!
		conditionImmunities: String
		damageResistances: String
		damageImmunities: String
		skills: String
		savingThrows: String
		senses: String!
		languages: String!
		proficiencyBonus: String!
		specialAbilities: [NameDescription!]
		actions: [NameDescription!]!
		bonusActions: [NameDescription!]
		reactions: [NameDescription!]
	}

	input SummonInput {
		name: String!
		size: Size!
		type: MonsterType!
		armorClass: String!
		hitPoints: String!
		speed: String!
		strength: Int!
		dexterity: Int!
		constitution: Int!
		wisdom: Int!
		charisma: Int!
		intelligence: Int!
		conditionImmunities: String
		damageResistances: String
		damageImmunities: String
		skills: String
		savingThrows: String
		senses: String!
		languages: String!
		proficiencyBonus: String!
		specialAbilities: [NameDescriptionInput!]
		actions: [NameDescriptionInput!]!
		bonusActions: [NameDescriptionInput!]
		reactions: [NameDescriptionInput!]
	}
`;

export default typeDefs;
