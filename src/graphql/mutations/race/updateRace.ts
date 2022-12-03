import { gql } from 'urql/core';

const UPDATE_RACE = gql`
	mutation UpdateRace($id: ID!, $race: RaceInput!) {
		updateRace(id: $id, race: $race)
	}
`;

export default UPDATE_RACE;
