import { gql } from 'urql/core';

const typeDefs = gql`
	input AbilityBonusInput {
		abilityScore: ItemInput!
		bonus: Int!
	}

	input AbilityBonusOptionsInput {
		bonus: Int!
		numberOfAbilityScores: Int!
	}

	type AbilityBonus {
		abilityScore: Item!
		bonus: Int!
	}

	type AbilityBonusOptions {
		bonus: Int!
		numberOfAbilityScores: Int!
	}
`;

export default typeDefs;
