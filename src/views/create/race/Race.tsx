'use client';

import { AbilityItem, SrdItem, SrdProficiencyItem } from '../../../types/srd';
import { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'urql';

import CREATE_RACE from '../../../graphql/mutations/race/createRace';
import MainContent from '../../../components/MainContent/MainContent';
import RaceForm from '../../../components/Forms/RaceForm/RaceForm';
import { Race } from '../../../types/characterSheetBuilderAPI';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { FormikHelpers } from 'formik';
import { ToastType } from '../../../types/toast';
import { useRouter } from 'next/navigation';
import { show } from '../../../redux/features/toast';
import { resetRace } from '../../../redux/features/editingRace';
import useGetSpells from '../../../hooks/useGetSpells';
import { cleanFormValues } from '../../../services/formValueCleaner';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';

type RaceProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
};

const Race = ({ abilities, languages, proficiencies }: RaceProps) => {
	const editingRace = useAppSelector(state => state.editingRace);
	const [_, createRace] = useMutation(CREATE_RACE);
	const spellsResult = useGetSpells();

	const router = useRouter();
	const dispatch = useAppDispatch();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (editingRace) {
			setLoading(false);
		}
	}, [editingRace]);

	const handleSubmit = useCallback(
		async (
			values: Omit<Race, 'id'>,
			{ resetForm }: FormikHelpers<Omit<Race, 'id'>>
		) => {
			const result = await createRace({
				race: cleanFormValues<Omit<Race, 'id'>>(values)
			});
			if (result.error) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: result.error.message,
					type: ToastType.error
				};
				dispatch(show(toast));
			} else {
				resetForm();
				dispatch(resetRace());
				router.replace('/my-stuff');
			}
		},
		[dispatch, createRace, router]
	);

	return loading ? (
		<LoadingPageContent />
	) : (
		<MainContent testId="create-race">
			<h1>Create Race</h1>
			<RaceForm
				abilities={abilities}
				initialValues={editingRace as Omit<Race, 'id'>}
				shouldUseReduxStore
				languages={languages}
				proficiencies={proficiencies}
				spells={spellsResult.spells ?? []}
				onSubmit={handleSubmit}
			/>
		</MainContent>
	);
};

export default Race;
