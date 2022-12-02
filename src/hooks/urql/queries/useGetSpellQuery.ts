import GET_SPELL from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpell';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import { useQuery } from 'urql';

const useGetSpellQuery = (
	id?: string,
	{ paused }: { paused: boolean } = { paused: false }
) =>
	useQuery<{ spell: Spell }, { id: string }>({
		query: GET_SPELL,
		variables: { id: id as string },
		pause: !id || paused
	});

export default useGetSpellQuery;
