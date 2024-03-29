'use client';

import { AbilityItem, SrdItem } from '../../../types/srd';
import { resetSpell } from '../../../redux/features/editingSpell';
import { useCallback, useEffect, useState } from 'react';
import { FormikHelpers } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import CREATE_SPELL from '../../../graphql/mutations/spell/createSpell';
import MainContent from '../../../components/MainContent/MainContent';
import SpellForm from '../../../components/Forms/SpellForm/SpellForm';
import { ToastType } from '../../../types/toast';
import { show } from '../../../redux/features/toast';
import { useMutation } from 'urql';
import { useRouter } from 'next/navigation';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import { cleanFormValues } from '../../../services/formValueCleaner';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';

type SpellProps = {
	magicSchools: SrdItem[];
	srdClasses: SrdItem[];
	damageTypes: SrdItem[];
	abilities: AbilityItem[];
};

const Spell = ({
	magicSchools,
	damageTypes,
	srdClasses,
	abilities
}: SpellProps) => {
	const editingSpell = useAppSelector(state => state.editingSpell);
	const dispatch = useAppDispatch();
	const [_, createSpell] = useMutation(CREATE_SPELL);
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (editingSpell) {
			setLoading(false);
		}
	}, [editingSpell]);

	const handleSubmit = useCallback(
		async (
			values: Omit<Spell, 'id'>,
			{ resetForm }: FormikHelpers<Omit<Spell, 'id'>>
		) => {
			const result = await createSpell({
				spell: cleanFormValues<Omit<Spell, 'id'>>(values)
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
				dispatch(resetSpell(undefined));
				router.replace('/my-stuff');
			}
		},
		[dispatch, createSpell, router]
	);

	return loading ? (
		<LoadingPageContent />
	) : (
		<MainContent testId="create-spell">
			<h1>Create Spell</h1>
			<SpellForm
				abilities={abilities}
				damageTypes={damageTypes}
				magicSchools={magicSchools}
				shouldUseReduxStore
				srdClasses={srdClasses}
				initialValues={editingSpell as Omit<Spell, 'id'>}
				onSubmit={handleSubmit}
			/>
		</MainContent>
	);
};

export default Spell;
