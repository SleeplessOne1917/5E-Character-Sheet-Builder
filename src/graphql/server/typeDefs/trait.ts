import { gql } from 'urql/core';

const typeDefs = gql`
	type Subtrait {
		uuid: ID!
		name: String!
		description: String!
		hpBonusPerLevel: Int
		proficiencies: [Item!]
		proficiencyOptions: ChooseOptions
		spells: [Item!]
		spellOptions: ChooseOptions
	}

	type SubtraitOptions {
		choose: Int!
		options: [Subtrait]!
	}

	input SubtraitInput {
		uuid: ID!
		name: String!
		description: String!
		hpBonusPerLevel: Int
		proficiencies: [ItemInput!]
		proficiencyOptions: ChooseOptionsInput
		spells: [ItemInput!]
		spellOptions: ChooseOptionsInput
	}

	input SubtraitOptionsInput {
		choose: Int!
		options: [SubtraitInput!]!
	}

	input TraitInput {
		uuid: ID!
		name: String!
		description: String!
		hpBonusPerLevel: Int
		proficiencies: [ItemInput!]
		proficiencyOptions: ChooseOptionsInput
		spells: [ItemInput!]
		spellOptions: ChooseOptionsInput
		subtraitOptions: SubtraitOptionsInput
	}

	type Trait {
		uuid: ID!
		name: String!
		description: String!
		hpBonusPerLevel: Int
		proficiencies: [Item!]
		proficiencyOptions: ChooseOptions
		spells: [Item!]
		spellOptions: ChooseOptions
		subtraitOptions: SubtraitOptions
	}
`;

export default typeDefs;
