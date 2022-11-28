'use client';

import { AbilityItem, SrdItem } from '../../../../types/srd';

import MainContent from '../../../../components/MainContent/MainContent';
import { PartialBy } from '../../../../types/helpers';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import SpellForm from '../../../../components/Spells/SpellForm/SpellForm';
import { ToastType } from '../../../../types/toast';
import UPDATE_SPELL from '../../../../graphql/mutations/spell/updateSpell';
import { show } from '../../../../redux/features/toast';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useCallback } from 'react';
import { useMutation } from 'urql';
import { useRouter } from 'next/navigation';

type EditSpellProps = {
	srdClasses: SrdItem[];
	magicSchools: SrdItem[];
	damageTypes: SrdItem[];
	abilities: AbilityItem[];
	spell?: Spell;
};

const EditSpell = ({
	spell,
	srdClasses,
	magicSchools,
	damageTypes,
	abilities
}: EditSpellProps) => {
	const [__, updateSpell] = useMutation(UPDATE_SPELL);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const handleSubmit = useCallback(
		async (values: PartialBy<Spell, 'id'>) => {
			const { id: _, ...newSpell } = values;
			const result = await updateSpell({ id: spell?.id, spell: newSpell });

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
		[updateSpell, spell?.id, dispatch, router]
	);

	return (
		<MainContent>
			<h1>Edit {spell?.name}</h1>
			<SpellForm
				abilities={abilities}
				damageTypes={damageTypes}
				magicSchools={magicSchools}
				srdClasses={srdClasses}
				initialValues={spell as Omit<Spell, 'id'>}
				shouldUseReduxStore={false}
				onSubmit={handleSubmit}
			/>
		</MainContent>
	);
};

export default EditSpell;
