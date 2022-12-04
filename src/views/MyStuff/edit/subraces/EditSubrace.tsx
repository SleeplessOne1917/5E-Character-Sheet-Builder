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
import { Subrace } from '../../../../types/characterSheetBuilderAPI';
import SubraceForm from '../../../../components/Forms/SubraceForm/SubraceForm';
import { ToastType } from '../../../../types/toast';
import { cleanFormValues } from '../../../../services/formValueCleaner';
import { show } from '../../../../redux/features/toast';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import useGetRaces from '../../../../hooks/useGetRaces';
import useGetSpells from '../../../../hooks/useGetSpells';
import useGetSubraceQuery from '../../../../hooks/urql/queries/useGetSubraceQuery';
import { useRouter } from 'next/navigation';
import useUpdateSubrace from '../../../../hooks/urql/mutations/useUpdateSubrace';

type EditSubraceProps = {
	abilities: AbilityItem[];
	id: string;
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
};

const EditSubrace = ({
	abilities,
	id,
	languages,
	proficiencies
}: EditSubraceProps) => {
	const spellsResult = useGetSpells();
	const racesResult = useGetRaces();
	const [subraceResult] = useGetSubraceQuery(id);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [_, updateSubrace] = useUpdateSubrace();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (!subraceResult.fetching) {
			if (subraceResult.error) {
				router.replace('/my-stuff');
			} else {
				setLoading(false);
			}
		}
	}, [subraceResult.fetching, subraceResult.error, router]);

	const handleSubmit = useCallback(
		async (values: PartialBy<Subrace, 'id'>) => {
			const { id: _, ...newSubrace } = values;
			const result = await updateSubrace({
				id,
				subrace: cleanFormValues<PartialBy<Subrace, 'id'>>(newSubrace)
			});

			if (result.error) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: result.error.message,
					type: ToastType.error
				};
				dispatch(show(toast));
			} else {
				router.replace('/my-stuff/subraces');
			}
		},
		[updateSubrace, id, dispatch, router]
	);

	const initialValues = useMemo(
		() => cleanFormValues<Omit<Subrace, 'id'>>(subraceResult.data?.subrace),
		[subraceResult.data?.subrace]
	);

	return loading ? (
		<LoadingPageContent />
	) : (
		<MainContent>
			<h1>Edit {subraceResult.data?.subrace.name}</h1>
			<SubraceForm
				abilities={abilities}
				languages={languages}
				proficiencies={proficiencies}
				spells={spellsResult.spells ?? []}
				onSubmit={handleSubmit}
				initialValues={initialValues}
				races={racesResult.races}
			/>
		</MainContent>
	);
};

export default EditSubrace;
