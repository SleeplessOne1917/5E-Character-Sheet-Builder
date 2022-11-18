import { AbilityItem, SrdItem } from '../../../types/srd';
import {
	resetSpell,
	initialState as spellInitialState
} from '../../../redux/features/editingSpell';
import { useCallback, useState } from 'react';
import { FormikHelpers } from 'formik';
import {
	accessTokenKey,
	refreshTokenKey,
	tokenExpired
} from '../../../constants/generalConstants';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import CREATE_SPELL from '../../../graphql/mutations/spell/createSpell';
import GET_TOKEN from '../../../graphql/mutations/user/token';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import SpellForm from '../../../components/Spells/SpellForm/SpellForm';
import { ToastType } from '../../../types/toast';
import { show } from '../../../redux/features/toast';
import useLogout from '../../../hooks/useLogout';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';
import { Spell } from '../../../types/characterSheetBuilderAPI';

type SpellProps = {
	magicSchools: SrdItem[];
	srdClasses: SrdItem[];
	damageTypes: SrdItem[];
	loading: boolean;
	abilities: AbilityItem[];
};

const Spell = ({
	magicSchools,
	loading,
	damageTypes,
	srdClasses,
	abilities
}: SpellProps) => {
	const editingSpell = useAppSelector(state => state.editingSpell);
	const dispatch = useAppDispatch();
	const [initialValues, setInitialValues] = useState(editingSpell);
	const [_, createSpell] = useMutation(CREATE_SPELL);
	const [__, getToken] = useMutation<{ token: string }>(GET_TOKEN);
	const logout = useLogout();
	const router = useRouter();

	const handleFormikSubmit = useCallback(
		async (
			values: Omit<Spell, 'id'>,
			{ resetForm }: FormikHelpers<Omit<Spell, 'id'>>
		) => {
			const result = await createSpell({ spell: values });
			if (result.error) {
				if (result.error.message === tokenExpired) {
					const refreshToken = localStorage.getItem(refreshTokenKey);
					const tokenResult = await getToken({ refreshToken });

					if (tokenResult.error || !tokenResult.data) {
						logout();
						return;
					}

					localStorage.setItem(accessTokenKey, tokenResult.data.token);

					const result2 = await createSpell({ spell: values });

					if (result2.error) {
						const toast = {
							closeTimeoutSeconds: 10,
							message: result2.error.message,
							type: ToastType.error
						};
						dispatch(show(toast));
					} else {
						setInitialValues(spellInitialState);
						resetForm();
						dispatch(resetSpell(undefined));
						router.replace('/my-stuff');
					}
				} else {
					const toast = {
						closeTimeoutSeconds: 10,
						message: result.error.message,
						type: ToastType.error
					};
					dispatch(show(toast));
				}
			} else {
				setInitialValues(spellInitialState);
				resetForm();
				dispatch(resetSpell(undefined));
				router.replace('/my-stuff');
			}
		},
		[dispatch, createSpell, router, getToken, logout]
	);

	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
				<MainContent testId="create-spell">
					<h1>Create Spell</h1>
					<SpellForm
						abilities={abilities}
						damageTypes={damageTypes}
						magicSchools={magicSchools}
						shouldUseReduxStore
						srdClasses={srdClasses}
						initialValues={initialValues as Omit<Spell, 'id'>}
						handleFormikSubmit={handleFormikSubmit}
					/>
				</MainContent>
			)}
		</>
	);
};

export default Spell;
