'use client';

import { AbilityItem, SrdItem } from '../../../../types/srd';
import { useCallback, useEffect, useState } from 'react';

import LoadingPageContent from '../../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../../components/MainContent/MainContent';
import { PartialBy } from '../../../../types/helpers';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import SpellForm from '../../../../components/Spells/SpellForm/SpellForm';
import { ToastType } from '../../../../types/toast';
import { show } from '../../../../redux/features/toast';
import { trpc } from '../../../../common/trpc';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useRouter } from 'next/navigation';

type EditSpellProps = {
	srdClasses: SrdItem[];
	magicSchools: SrdItem[];
	damageTypes: SrdItem[];
	abilities: AbilityItem[];
	id: string;
};

const EditSpell = ({
	id,
	srdClasses,
	magicSchools,
	damageTypes,
	abilities
}: EditSpellProps) => {
	const editSpellMutation = trpc.spells.editSpell.useMutation();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const spellResult = trpc.spells.spell.useQuery(id);
	const trpcContext = trpc.useContext();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (spellResult.isSuccess) {
			setLoading(false);
		}
	}, [spellResult.isSuccess]);

	const handleSubmit = useCallback(
		async (values: PartialBy<Spell, 'id'>) => {
			const { id: _, ...newSpell } = values;
			try {
				await editSpellMutation.mutateAsync({
					id,
					spell: newSpell
				});
			} catch (e) {
				const toast = {
					closeTimeoutSeconds: 10,
					message: (e as Error).message,
					type: ToastType.error
				};
				dispatch(show(toast));
			}

			trpcContext.spells.spells.invalidate();
			router.replace('/my-stuff/spells');
		},
		[editSpellMutation, id, dispatch, router, trpcContext.spells.spells]
	);

	return loading ? (
		<LoadingPageContent />
	) : (
		<MainContent>
			<h1>Edit {spellResult.data?.name}</h1>
			<SpellForm
				abilities={abilities}
				damageTypes={damageTypes}
				magicSchools={magicSchools}
				srdClasses={srdClasses}
				initialValues={spellResult.data as Omit<Spell, 'id'>}
				shouldUseReduxStore={false}
				onSubmit={handleSubmit}
			/>
		</MainContent>
	);
};

export default EditSpell;
