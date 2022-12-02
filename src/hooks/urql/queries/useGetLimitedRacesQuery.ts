import GET_RACES from '../../../graphql/queries/CharacterSheetBuilder/races/getRaces';
import { Item } from '../../../types/db/item';
import { useQuery } from 'urql';

const useGetLimitedRacesQuery = ({
	limit,
	skip
}: {
	limit?: number;
	skip?: number;
} = {}) =>
	useQuery<{
		races: {
			races: Item[];
			count: number;
		};
	}>({
		query: GET_RACES,
		variables: { limit, skip }
	});

export default useGetLimitedRacesQuery;
