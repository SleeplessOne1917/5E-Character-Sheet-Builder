import { gql } from 'urql/core';

const UPDATE_SPELL = gql`
	mutation UpdateSpell($id: ID!, $spell: SpellInput!) {
		updateSpell(id: $id, spell: $spell)
	}
`;

export default UPDATE_SPELL;
