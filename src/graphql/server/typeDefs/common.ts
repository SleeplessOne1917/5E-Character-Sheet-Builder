import { gql } from 'urql/core';

const typeDefs = gql`
	enum Size {
		TINY
		SMALL
		MEDIUM
		LARGE
		HUGE
		GARGANTUAN
	}

	enum MonsterType {
		BEAST
		MONSTROSITY
		DRAGON
		HUMANOID
		UNDEAD
		FIEND
		CELESTIAL
		CONSTRUCT
		GIANT
		ELEMENTAL
		FEY
		ABERRATION
		OOZE
		PLANT
	}

	input ItemInput {
		id: String!
		name: String!
	}

	type Item {
		id: String!
		name: String!
	}

	input ChooseOptionsInput {
		choose: Int!
		options: [ItemInput!]!
	}

	type ChooseOptions {
		choose: Int!
		options: [Item!]!
	}
`;

export default typeDefs;
