'use client';

import { AbilityItem, SrdItem, SrdProficiencyItem } from '../../../types/srd';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'urql';

import CREATE_RACE from '../../../graphql/mutations/race/createRace';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import RaceForm from '../../../components/RaceForm/RaceForm';
import { Race, SpellItem } from '../../../types/characterSheetBuilderAPI';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { FormikHelpers } from 'formik';
import { ToastType } from '../../../types/toast';
import { useRouter } from 'next/navigation';
import { show } from '../../../redux/features/toast';
import {
	initialState as raceInitialState,
	resetRace
} from '../../../redux/features/editingRace';

type RaceProps = {
	username?: string;
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
};

const Race = ({
	username,
	abilities,
	languages,
	proficiencies,
	spells
}: RaceProps) => {
	const editingRace = useAppSelector(state => state.editingRace);
	const [_, createRace] = useMutation(CREATE_RACE);
	const [initialValues, setInitialValues] = useState(editingRace);

	const router = useRouter();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!username) {
			router.replace('/');
		}
	}, [username, router]);

	const handleSubmit = useCallback(
		async (
			values: Omit<Race, 'id'>,
			{ resetForm }: FormikHelpers<Omit<Race, 'id'>>
		) => {
			const result = await createRace({ race: values });
			if (result.error) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: result.error.message,
					type: ToastType.error
				};
				dispatch(show(toast));
			} else {
				setInitialValues(raceInitialState);
				resetForm();
				dispatch(resetRace());
				router.replace('/my-stuff');
			}
		},
		[dispatch, createRace, router]
	);

	return (
		<>
			{!username && <LoadingPageContent />}
			{username && (
				<MainContent testId="create-race">
					<h1>Create Race</h1>
					<RaceForm
						abilities={abilities}
						initialValues={initialValues as Omit<Race, 'id'>}
						shouldUseReduxStore
						languages={languages}
						proficiencies={proficiencies}
						spells={spells}
						onSubmit={handleSubmit}
					/>
				</MainContent>
			)}
		</>
	);
};

export default Race;
