import { useEffect, useState } from 'react';

import { Race } from '../types/characterSheetBuilderAPI';
import { SrdFullRaceItem } from '../types/srd';
import { getRace } from '../graphql/srdClientService';
import { isObjectId } from '../services/objectIdService';
import mapRace from '../services/raceMapper';
import useGetRaceQuery from './urql/queries/useGetRaceQuery';

const useGetRace = (
	id?: string,
	{ paused }: { paused: boolean } = { paused: false }
) => {
	const [race, setRace] = useState<Race>();
	const [error, setError] = useState<string>();
	const [fetching, setFetching] = useState(false);
	const [customRaceResult] = useGetRaceQuery(id, {
		paused: !id || paused || !isObjectId(id)
	});

	useEffect(() => {
		if (id && !(isObjectId(id) || race?.id === id || paused)) {
			setFetching(true);
			setError(undefined);
			getRace(id)
				.then(s => {
					setRace(mapRace(s.data?.race as SrdFullRaceItem));
					setFetching(false);
				})
				.catch((e: Error) => {
					setError(e.message);
				});
		}
	}, [id, race, paused]);

	return {
		race: isObjectId(id) ? customRaceResult.data?.race : race,
		fetching: fetching || customRaceResult.fetching,
		error: isObjectId(id) ? customRaceResult.error?.message : error
	};
};

export default useGetRace;
