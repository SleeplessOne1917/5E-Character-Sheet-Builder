import { gql } from 'urql/core';

const typeDefs = gql`
	type Query {
		spells(limit: Int, skip: Int, class: String): SpellsResponse!
		spell(id: ID!): Spell!
		races(limit: Int, skip: Int): RacesResponse!
		race(id: ID!): Race!
		subraces(limit: Int, skip: Int): SubracesResponse!
		subrace(id: ID!): Subrace!
	}
`;

export default typeDefs;
