import GET_SUBRACE from '../../../graphql/queries/CharacterSheetBuilder/subraces/getSubrace';
import { Subrace } from '../../../types/characterSheetBuilderAPI';
import { useQuery } from 'urql';

const useGetSubraceQuery = (
	id?: string,
	{ paused }: { paused: boolean } = { paused: false }
) =>
	useQuery<{ subrace: Subrace }, { id: string }>({
		query: GET_SUBRACE,
		variables: { id: id as string },
		pause: !id || paused
	});

export default useGetSubraceQuery;
