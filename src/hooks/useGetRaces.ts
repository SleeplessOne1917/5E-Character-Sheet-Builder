import { combineItemArrays, mapItem } from '../services/itemHelpers';
import { useEffect, useState } from 'react';

import { Item } from '../types/db/item';
import { getRaces } from '../graphql/srdClientService';
import useGetLimitedRacesQuery from './urql/queries/useGetLimitedRacesQuery';

const useGetRaces = () => {
	const [races, setRaces] = useState<Item[]>();
	const [fetching, setFetching] = useState(false);

	const [customRacesResult] = useGetLimitedRacesQuery();

	useEffect(() => {
		if (!races) {
			setFetching(true);
			getRaces().then(r => {
				setRaces(r.data?.races.map(mapItem) ?? []);
				setFetching(false);
			});
		}
	}, [races]);

	return {
		races: combineItemArrays(
			races ?? [],
			customRacesResult.data?.races.races ?? []
		),
		fetching: fetching || customRacesResult.fetching
	};
};

export default useGetRaces;
