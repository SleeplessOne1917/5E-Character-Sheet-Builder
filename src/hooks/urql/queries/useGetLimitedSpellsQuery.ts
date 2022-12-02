import GET_SPELLS from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpells';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import { useQuery } from 'urql';

const useGetLimitedSpellsQuery = ({
	limit,
	skip
}: {
	limit?: number;
	skip?: number;
} = {}) =>
	useQuery<{
		spells: SpellItem[];
		count: number;
	}>({
		query: GET_SPELLS,
		variables: { limit, skip }
	});

export default useGetLimitedSpellsQuery;
