'use client';

import {
	AbilityItem,
	SrdItem,
	SrdProficiencyItem
} from '../../../../types/srd';
import { useCallback, useEffect, useState } from 'react';

import LoadingPageContent from '../../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../../components/MainContent/MainContent';
import { PartialBy } from '../../../../types/helpers';
import { Race } from '../../../../types/characterSheetBuilderAPI';
import RaceForm from '../../../../components/RaceForm/RaceForm';
import { ToastType } from '../../../../types/toast';
import UPDATE_RACE from '../../../../graphql/mutations/race/updateRace';
import { show } from '../../../../redux/features/toast';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import useGetLimitedSpellsQuery from '../../../../hooks/urql/queries/useGetLimitedSpellsQuery';
import useGetRaceQuery from '../../../../hooks/urql/queries/useGetRaceQuery';
import { useMutation } from 'urql';
import { useRouter } from 'next/navigation';

type EditRaceProps = {
	abilities: AbilityItem[];
	id: string;
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
};

const EditRace = ({
	abilities,
	id,
	languages,
	proficiencies
}: EditRaceProps) => {
	const [spellsResult] = useGetLimitedSpellsQuery();
	const [raceResult] = useGetRaceQuery(id);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [_, updateRace] = useMutation(UPDATE_RACE);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!raceResult.fetching) {
			if (raceResult.error) {
				router.replace('/my-stuff');
			} else {
				setLoading(false);
			}
		}
	}, [raceResult.fetching, raceResult.error, router]);

	const handleSubmit = useCallback(
		async (values: PartialBy<Race, 'id'>) => {
			const { id: _, ...newRace } = values;
			const result = await updateRace({ id, race: newRace });

			if (result.error) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: result.error.message,
					type: ToastType.error
				};
				dispatch(show(toast));
			} else {
				router.replace('/my-stuff/races');
			}
		},
		[updateRace, id, dispatch, router]
	);

	return loading ? (
		<LoadingPageContent />
	) : (
		<MainContent>
			<h1>Edit {raceResult.data?.race.name}</h1>
			<RaceForm
				abilities={abilities}
				languages={languages}
				proficiencies={proficiencies}
				spells={spellsResult.data?.spells.spells ?? []}
				onSubmit={handleSubmit}
				initialValues={raceResult.data?.race as Omit<Race, 'id'>}
			/>
		</MainContent>
	);
};

export default EditRace;
