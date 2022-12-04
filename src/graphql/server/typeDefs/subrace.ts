import { gql } from 'urql/core';

const typeDefs = gql`
	input SubraceInput {
		name: String!
		race: ItemInput!
		abilityBonuses: [AbilityBonusInput!]
		abilityBonusOptions: AbilityBonusOptionsInput
		languages: [ItemInput!]
		numberOfLanguageOptions: Int
		size: Size
		speed: Int
		omittedRaceTraits: [String!]
		traits: [TraitInput!]
	}

	type Subrace {
		id: ID!
		name: String!
		race: Item!
		abilityBonuses: [AbilityBonus!]
		abilityBonusOptions: AbilityBonusOptions
		languages: [Item!]
		numberOfLanguageOptions: Int
		size: Size
		speed: Int
		omittedRaceTraits: [String!]
		traits: [Trait!]
	}

	type SubracesResponse {
		count: Int!
		subraces: [Subrace!]!
	}
`;

export default typeDefs;
