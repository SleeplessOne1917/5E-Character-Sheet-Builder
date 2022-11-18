import { AbilityItem, SrdItem } from '../../../../types/srd';
import {
	accessTokenKey,
	refreshTokenKey,
	tokenExpired
} from '../../../../constants/generalConstants';
import { useCallback, useEffect } from 'react';
import { useMutation, useQuery } from 'urql';

import GET_SPELL from '../../../../graphql/queries/CharacterSheetBuilder/spells/getSpell';
import GET_TOKEN from '../../../../graphql/mutations/user/token';
import LoadingPageContent from '../../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../../components/MainContent/MainContent';
import { PartialBy } from '../../../../types/helpers';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import SpellForm from '../../../../components/Spells/SpellForm/SpellForm';
import { ToastType } from '../../../../types/toast';
import UPDATE_SPELL from '../../../../graphql/mutations/spell/updateSpell';
import { show } from '../../../../redux/features/toast';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import useLogout from '../../../../hooks/useLogout';
import { useRouter } from 'next/router';

type EditSpellProps = {
	loading: boolean;
	id: string;
	srdClasses: SrdItem[];
	magicSchools: SrdItem[];
	damageTypes: SrdItem[];
	abilities: AbilityItem[];
};

const EditSpell = ({
	loading,
	id,
	srdClasses,
	magicSchools,
	damageTypes,
	abilities
}: EditSpellProps) => {
	const [spellResult, refetchSpell] = useQuery<{ spell: Spell }>({
		query: GET_SPELL,
		variables: { id }
	});
	const [_, getToken] = useMutation<{ token: string }>(GET_TOKEN);
	const [__, updateSpell] = useMutation(UPDATE_SPELL);
	const logout = useLogout();
	const router = useRouter();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (spellResult.error) {
			if (spellResult.error.message === tokenExpired) {
				const refreshToken = localStorage.getItem(refreshTokenKey);
				if (refreshToken) {
					getToken({ refreshToken }).then(result => {
						if (result.error || !result.data) {
							logout();
							return;
						}

						localStorage.setItem(accessTokenKey, result.data.token);
						refetchSpell();
					});
				}
			} else {
				router.replace('/my-stuff');
			}
		}
	}, [spellResult.error, getToken, logout, refetchSpell, router]);

	const handleSubmit = useCallback(
		async (values: PartialBy<Spell, 'id'>) => {
			const { id: _, ...spell } = values;
			const result = await updateSpell({ id, spell });

			if (result.error) {
				if (result.error.message === tokenExpired) {
					const refreshToken = localStorage.getItem(refreshTokenKey);
					const tokenResult = await getToken({ refreshToken });
					if (tokenResult.error || !tokenResult.data) {
						logout();
						return;
					}

					localStorage.setItem(accessTokenKey, tokenResult.data.token);

					const result2 = await updateSpell({ id, spell });

					if (result2.error) {
						const toast = {
							closeTimeoutSeconds: 10,
							message: result.error.message,
							type: ToastType.error
						};
						dispatch(show(toast));
					} else {
						router.replace('/my-stuff/spells');
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
				router.replace('/my-stuff/spells');
			}
		},
		[updateSpell, id, dispatch, getToken, logout, router]
	);

	return loading || spellResult.fetching || spellResult.error ? (
		<LoadingPageContent />
	) : (
		<MainContent>
			<h1>Edit {spellResult.data?.spell.name}</h1>
			<SpellForm
				abilities={abilities}
				damageTypes={damageTypes}
				magicSchools={magicSchools}
				srdClasses={srdClasses}
				initialValues={spellResult.data?.spell as Omit<Spell, 'id'>}
				shouldUseReduxStore={false}
				handleFormikSubmit={handleSubmit}
			/>
		</MainContent>
	);
};

export default EditSpell;
