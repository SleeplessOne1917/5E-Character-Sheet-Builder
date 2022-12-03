'use client';

import { AbilityItem, SrdItem } from '../../../../types/srd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import LoadingPageContent from '../../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../../components/MainContent/MainContent';
import { PartialBy } from '../../../../types/helpers';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import SpellForm from '../../../../components/Forms/SpellForm/SpellForm';
import { ToastType } from '../../../../types/toast';
import UPDATE_SPELL from '../../../../graphql/mutations/spell/updateSpell';
import { cleanFormValues } from '../../../../services/formValueCleaner';
import { show } from '../../../../redux/features/toast';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import useGetSpellQuery from '../../../../hooks/urql/queries/useGetSpellQuery';
import { useMutation } from 'urql';
import { useRouter } from 'next/navigation';

type EditSpellProps = {
	srdClasses: SrdItem[];
	magicSchools: SrdItem[];
	damageTypes: SrdItem[];
	abilities: AbilityItem[];
	id: string;
};

const EditSpell = ({
	srdClasses,
	magicSchools,
	damageTypes,
	abilities,
	id
}: EditSpellProps) => {
	const [__, updateSpell] = useMutation(UPDATE_SPELL);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);

	const [spellResult] = useGetSpellQuery(id);

	useEffect(() => {
		if (!spellResult.fetching) {
			if (spellResult.error) {
				router.replace('/my-stuff');
			} else {
				setLoading(false);
			}
		}
	}, [spellResult.fetching, spellResult.error, router]);

	const handleSubmit = useCallback(
		async (values: PartialBy<Spell, 'id'>) => {
			const { id: _, ...newSpell } = values;
			const result = await updateSpell({
				id,
				spell: cleanFormValues<PartialBy<Spell, 'id'>>(newSpell)
			});

			if (result.error) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: result.error.message,
					type: ToastType.error
				};
				dispatch(show(toast));
			} else {
				router.replace('/my-stuff/spells');
			}
		},
		[updateSpell, id, dispatch, router]
	);

	const initialValues = useMemo(
		() => cleanFormValues<Omit<Spell, 'id'>>(spellResult.data?.spell),
		[spellResult.data?.spell]
	);

	return loading ? (
		<LoadingPageContent />
	) : (
		<MainContent>
			<h1>Edit {spellResult?.data?.spell.name}</h1>
			<SpellForm
				abilities={abilities}
				damageTypes={damageTypes}
				magicSchools={magicSchools}
				srdClasses={srdClasses}
				initialValues={initialValues}
				shouldUseReduxStore={false}
				onSubmit={handleSubmit}
			/>
		</MainContent>
	);
};

export default EditSpell;
