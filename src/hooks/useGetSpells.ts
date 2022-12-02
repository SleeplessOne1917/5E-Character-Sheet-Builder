import { combineSpellArrays, mapSpellItem } from '../services/spellsService';
import { useEffect, useState } from 'react';

import { SpellItem } from '../types/characterSheetBuilderAPI';
import { getSpells } from '../graphql/srdClientService';
import useGetLimitedSpellsQuery from './urql/queries/useGetLimitedSpellsQuery';

const useGetSpells = () => {
	const [spells, setSpells] = useState<SpellItem[]>();
	const [fetching, setFetching] = useState(false);

	const [customSpellsResult] = useGetLimitedSpellsQuery();

	useEffect(() => {
		if (!spells) {
			setFetching(true);
			getSpells().then(s => {
				setSpells(s.data?.spells.map(mapSpellItem));
				setFetching(false);
			});
		}
	}, [spells]);

	return {
		spells: combineSpellArrays(spells, customSpellsResult.data?.spells.spells),
		fetching: fetching || customSpellsResult.fetching
	};
};

export default useGetSpells;
