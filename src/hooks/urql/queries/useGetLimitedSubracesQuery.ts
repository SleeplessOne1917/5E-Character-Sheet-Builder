import GET_SUBRACES from '../../../graphql/queries/CharacterSheetBuilder/subraces/getSubraces';
import { Item } from '../../../types/db/item';
import { useQuery } from 'urql';

const useGetLimitedSubracesQuery = ({
	limit,
	skip
}: {
	limit?: number;
	skip?: number;
} = {}) =>
	useQuery<{
		subraces: {
			subraces: Item[];
			count: number;
		};
	}>({
		query: GET_SUBRACES,
		variables: { limit, skip }
	});

export default useGetLimitedSubracesQuery;
