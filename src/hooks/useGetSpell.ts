import { useEffect, useState } from 'react';

import { Spell } from '../types/characterSheetBuilderAPI';
import { SrdSpell } from '../types/srd';
import { getSpell } from '../graphql/srdClientService';
import { isObjectId } from '../services/objectIdService';
import { mapSpell } from '../services/spellsService';
import useGetSpellQuery from './urql/queries/useGetSpellQuery';

const useGetSpell = (
	id?: string,
	{ paused }: { paused: boolean } = { paused: false }
) => {
	const [spell, setSpell] = useState<Spell>();
	const [fetching, setFetching] = useState(false);
	const [customSpellResult] = useGetSpellQuery(id, {
		paused: !id || paused || !isObjectId(id)
	});

	useEffect(() => {
		if (id && !(isObjectId(id) || spell?.id === id || paused)) {
			setFetching(true);
			getSpell(id).then(s => {
				setSpell(mapSpell(s.data?.spell as SrdSpell));
				setFetching(false);
			});
		}
	}, [id, spell, paused]);

	return {
		spell: !id
			? undefined
			: isObjectId(id)
			? customSpellResult.data?.spell
			: spell,
		fetching: fetching || customSpellResult.fetching
	};
};

export default useGetSpell;
