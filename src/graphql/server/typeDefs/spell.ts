import { gql } from 'urql/core';

const typeDefs = gql`
	enum SpellComponent {
		V
		S
		M
	}

	input SpellInput {
		name: String!
		level: Int!
		castingTime: String!
		duration: String!
		range: String!
		school: ItemInput!
		components: [SpellComponent!]!
		material: String
		concentration: Boolean
		ritual: Boolean
		description: String!
		atHigherLevels: String
		damageType: ItemInput
		classes: [ItemInput!]!
		summons: [SummonInput!]
	}

	type Spell {
		id: ID!
		name: String!
		level: Int!
		castingTime: String!
		duration: String!
		range: String!
		school: Item!
		components: [SpellComponent!]!
		material: String
		concentration: Boolean
		ritual: Boolean
		description: String!
		atHigherLevels: String
		damageType: Item
		classes: [Item!]!
		summons: [Summon!]
	}

	type SpellsResponse {
		count: Int!
		spells: [Spell!]!
	}
`;

export default typeDefs;
