'use client';

import { AbilityItem, SrdItem, SrdProficiencyItem } from '../../../types/srd';
import { useCallback, useEffect, useState } from 'react';

import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import SubraceForm from '../../../components/Forms/SubraceForm/SubraceForm';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import useCreateSubrace from '../../../hooks/urql/mutations/useCreateSubrace';
import useGetRaces from '../../../hooks/useGetRaces';
import useGetSpells from '../../../hooks/useGetSpells';
import { Subrace } from '../../../types/characterSheetBuilderAPI';
import { FormikHelpers } from 'formik';
import { cleanFormValues } from '../../../services/formValueCleaner';
import { ToastType } from '../../../types/toast';
import { show } from '../../../redux/features/toast';
import { useRouter } from 'next/navigation';
import { resetSubrace } from '../../../redux/features/editingSubrace';

type SubraceProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
};

const Subrace = ({ abilities, languages, proficiencies }: SubraceProps) => {
	const editingSubrace = useAppSelector(state => state.editingSubrace);
	const [loading, setLoading] = useState(true);
	const racesResult = useGetRaces();
	const spellsResult = useGetSpells();
	const [_, createSubrace] = useCreateSubrace();
	const dispatch = useAppDispatch();
	const router = useRouter();

	useEffect(() => {
		if (editingSubrace) {
			setLoading(false);
		}
	}, [editingSubrace]);

	const handleSubmit = useCallback(
		async (
			values: Omit<Subrace, 'id'>,
			{ resetForm }: FormikHelpers<Omit<Subrace, 'id'>>
		) => {
			const result = await createSubrace({
				subrace: cleanFormValues<Omit<Subrace, 'id'>>(values)
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
				dispatch(resetSubrace());
				router.replace('/my-stuff');
			}
		},
		[dispatch, createSubrace, router]
	);

	return loading || racesResult.fetching ? (
		<LoadingPageContent />
	) : (
		<MainContent>
			<h1>Create Subrace</h1>
			<SubraceForm
				initialValues={editingSubrace as Omit<Subrace, 'id'>}
				shouldUseReduxStore
				races={racesResult.races}
				abilities={abilities}
				languages={languages}
				spells={spellsResult.spells}
				proficiencies={proficiencies}
				onSubmit={handleSubmit}
			/>
		</MainContent>
	);
};

export default Subrace;
