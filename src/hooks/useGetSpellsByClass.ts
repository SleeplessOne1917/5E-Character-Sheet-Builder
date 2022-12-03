import { combineSpellArrays, mapSpellItem } from '../services/spellsService';
import { useEffect, useState } from 'react';

import GET_SPELLS from '../graphql/queries/CharacterSheetBuilder/spells/getSpells';
import { SpellItem } from '../types/characterSheetBuilderAPI';
import { getSpellsByClass } from '../graphql/srdClientService';
import { useQuery } from 'urql';

const useGetSpellsByClass = (klass?: string) => {
	const [spells, setSpells] = useState<SpellItem[]>();
	const [fetching, setFetching] = useState(false);

	const [customSpellsResult] = useQuery<
		{ spells: { spells: SpellItem[]; count: number } },
		{ class: string }
	>({
		query: GET_SPELLS,
		variables: { class: klass as string },
		pause: !klass
	});

	useEffect(() => {
		if (klass && !spells) {
			setFetching(true);
			getSpellsByClass(klass).then(s => {
				setSpells(s.data?.spells.map(mapSpellItem) ?? []);
				setFetching(false);
			});
		}
	}, [klass, spells]);

	return {
		spells: combineSpellArrays(spells, customSpellsResult.data?.spells.spells),
		fetching: fetching || customSpellsResult.fetching
	};
};

export default useGetSpellsByClass;
