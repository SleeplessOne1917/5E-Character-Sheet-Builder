import { gql } from 'urql/core';

const typeDefs = gql`
	input RaceInput {
		name: String!
		abilityBonuses: [AbilityBonusInput!]!
		abilityBonusOptions: AbilityBonusOptionsInput
		languages: [ItemInput!]!
		numberOfLanguageOptions: Int
		size: Size!
		speed: Int!
		traits: [TraitInput!]
	}

	type Race {
		id: ID!
		name: String!
		abilityBonuses: [AbilityBonus!]!
		abilityBonusOptions: AbilityBonusOptions
		languages: [Item!]!
		numberOfLanguageOptions: Int
		size: Size!
		speed: Int!
		traits: [Trait!]
	}

	type RacesResponse {
		count: Int!
		races: [Race!]!
	}
`;

export default typeDefs;
