'use client';

import { AbilityItem, SrdItem } from '../../../types/srd';
import {
	resetSpell,
	initialState as spellInitialState
} from '../../../redux/features/editingSpell';
import { useCallback, useEffect, useState } from 'react';
import { FormikHelpers } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import CREATE_SPELL from '../../../graphql/mutations/spell/createSpell';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import SpellForm from '../../../components/Spells/SpellForm/SpellForm';
import { ToastType } from '../../../types/toast';
import { show } from '../../../redux/features/toast';
import { useMutation } from 'urql';
import { useRouter } from 'next/navigation';
import { Spell } from '../../../types/characterSheetBuilderAPI';

type SpellProps = {
	magicSchools: SrdItem[];
	srdClasses: SrdItem[];
	damageTypes: SrdItem[];
	username?: string;
	abilities: AbilityItem[];
};

const Spell = ({
	magicSchools,
	username,
	damageTypes,
	srdClasses,
	abilities
}: SpellProps) => {
	const editingSpell = useAppSelector(state => state.editingSpell);
	const dispatch = useAppDispatch();
	const [initialValues, setInitialValues] = useState(editingSpell);
	const [_, createSpell] = useMutation(CREATE_SPELL);
	const router = useRouter();

	useEffect(() => {
		if (!username) {
			router.replace('/');
		}
	}, [username, router]);

	const handleSubmit = useCallback(
		async (
			values: Omit<Spell, 'id'>,
			{ resetForm }: FormikHelpers<Omit<Spell, 'id'>>
		) => {
			const result = await createSpell({ spell: values });
			if (result.error) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: result.error.message,
					type: ToastType.error
				};
				dispatch(show(toast));
			} else {
				setInitialValues(spellInitialState);
				resetForm();
				dispatch(resetSpell(undefined));
				router.replace('/my-stuff');
			}
		},
		[dispatch, createSpell, router]
	);

	return (
		<>
			{!username && <LoadingPageContent />}
			{username && (
				<MainContent testId="create-spell">
					<h1>Create Spell</h1>
					<SpellForm
						abilities={abilities}
						damageTypes={damageTypes}
						magicSchools={magicSchools}
						shouldUseReduxStore
						srdClasses={srdClasses}
						initialValues={initialValues as Omit<Spell, 'id'>}
						onSubmit={handleSubmit}
					/>
				</MainContent>
			)}
		</>
	);
};

export default Spell;
