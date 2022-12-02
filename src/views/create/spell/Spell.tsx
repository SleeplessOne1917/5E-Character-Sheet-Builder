'use client';

import { AbilityItem, SrdItem } from '../../../types/srd';
import {
	resetSpell,
	initialState as spellInitialState
} from '../../../redux/features/editingSpell';
import { useCallback, useState } from 'react';
import { FormikHelpers } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import MainContent from '../../../components/MainContent/MainContent';
import SpellForm from '../../../components/Spells/SpellForm/SpellForm';
import { ToastType } from '../../../types/toast';
import { show } from '../../../redux/features/toast';
import { useRouter } from 'next/navigation';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import { trpc } from '../../../common/trpcNext';

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
	const [initialValues, setInitialValues] = useState(editingSpell);
	const createSpellMutation = trpc.spells.createSpell.useMutation();
	const router = useRouter();

	const handleSubmit = useCallback(
		async (
			values: Omit<Spell, 'id'>,
			{ resetForm }: FormikHelpers<Omit<Spell, 'id'>>
		) => {
			try {
				await createSpellMutation.mutateAsync(values);
			} catch (e) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: (e as Error).message,
					type: ToastType.error
				};
				dispatch(show(toast));
			}

			setInitialValues(spellInitialState);
			resetForm();
			dispatch(resetSpell(undefined));
			router.replace('/my-stuff');
		},
		[dispatch, createSpellMutation, router]
	);

	return (
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
	);
};

export default Spell;
