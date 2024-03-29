'use client';

import {
	AbilityItem,
	SrdItem,
	SrdProficiencyItem
} from '../../../../types/srd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import LoadingPageContent from '../../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../../components/MainContent/MainContent';
import { PartialBy } from '../../../../types/helpers';
import { Race } from '../../../../types/characterSheetBuilderAPI';
import RaceForm from '../../../../components/Forms/RaceForm/RaceForm';
import { ToastType } from '../../../../types/toast';
import UPDATE_RACE from '../../../../graphql/mutations/race/updateRace';
import { cleanFormValues } from '../../../../services/formValueCleaner';
import { show } from '../../../../redux/features/toast';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import useGetRaceQuery from '../../../../hooks/urql/queries/useGetRaceQuery';
import useGetSpells from '../../../../hooks/useGetSpells';
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
	const spellsResult = useGetSpells();
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
			const result = await updateRace({
				id,
				race: cleanFormValues<PartialBy<Race, 'id'>>(newRace)
			});

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

	const initialValues = useMemo(
		() => cleanFormValues<Omit<Race, 'id'>>(raceResult.data?.race),
		[raceResult.data?.race]
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
				spells={spellsResult.spells ?? []}
				onSubmit={handleSubmit}
				initialValues={initialValues}
			/>
		</MainContent>
	);
};

export default EditRace;
