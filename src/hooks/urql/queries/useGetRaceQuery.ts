import GET_RACE from '../../../graphql/queries/CharacterSheetBuilder/races/getRace';
import { Race } from '../../../types/characterSheetBuilderAPI';
import { useQuery } from 'urql';

const useGetRaceQuery = (
	id?: string,
	{ paused }: { paused: boolean } = { paused: false }
) =>
	useQuery<{ race: Race }, { id: string }>({
		query: GET_RACE,
		variables: { id: id as string },
		pause: !id || paused
	});

export default useGetRaceQuery;
