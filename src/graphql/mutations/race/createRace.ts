import { gql } from 'urql';

const CREATE_RACE = gql`
	mutation CreateRace($race: RaceInput!) {
		createRace(race: $race)
	}
`;

export default CREATE_RACE;
