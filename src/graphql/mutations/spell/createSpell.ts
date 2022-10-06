import { gql } from 'urql';

const CREATE_SPELL = gql`
	mutation CreateSpell($spell: SpellInput!) {
		createSpell(spell: $spell)
	}
`;

export default CREATE_SPELL;
