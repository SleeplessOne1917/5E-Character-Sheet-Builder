import { AbilityItem, SrdItem, SrdProficiencyItem } from '../../../types/srd';
import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from 'urql';

import CREATE_RACE from '../../../graphql/mutations/race/createRace';
import GET_SPELLS from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpells';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import RaceForm from '../../../components/RaceForm/RaceForm';
import { Race, SpellItem } from '../../../types/characterSheetBuilderAPI';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import GET_TOKEN from '../../../graphql/mutations/user/token';
import { FormikHelpers } from 'formik';
import {
	accessTokenKey,
	refreshTokenKey,
	tokenExpired
} from '../../../constants/generalConstants';
import { ToastType } from '../../../types/toast';
import { useRouter } from 'next/router';
import useLogout from '../../../hooks/useLogout';
import { show } from '../../../redux/features/toast';
import {
	initialState as raceInitialState,
	resetRace
} from '../../../redux/features/editingRace';

type RaceProps = {
	loading: boolean;
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	srdSpells: SpellItem[];
};

const Race = ({
	loading,
	abilities,
	languages,
	proficiencies,
	srdSpells
}: RaceProps) => {
	const editingRace = useAppSelector(state => state.editingRace);
	const [_, createRace] = useMutation(CREATE_RACE);
	const [__, getToken] = useMutation<{ token: string }>(GET_TOKEN);
	const [initialValues, setInitialValues] = useState(editingRace);
	const [spellsResult] = useQuery<{ spells: { spells: SpellItem[] } }>({
		query: GET_SPELLS
	});
	const logout = useLogout();
	const router = useRouter();
	const dispatch = useAppDispatch();

	const spells = useMemo(
		() =>
			srdSpells.concat(spellsResult.data?.spells.spells ?? []).sort((a, b) => {
				const val = a.level - b.level;

				return val === 0 ? a.name.localeCompare(b.name) : val;
			}),
		[srdSpells, spellsResult.data?.spells.spells]
	);

	const handleSubmit = useCallback(
		async (
			values: Omit<Race, 'id'>,
			{ resetForm }: FormikHelpers<Omit<Race, 'id'>>
		) => {
			const result = await createRace({ race: values });
			if (result.error) {
				if (result.error.message === tokenExpired) {
					const refreshToken = localStorage.getItem(refreshTokenKey);
					const tokenResult = await getToken({ refreshToken });

					if (tokenResult.error || !tokenResult.data) {
						logout();
						return;
					}

					localStorage.setItem(accessTokenKey, tokenResult.data.token);

					const result2 = await createRace({ race: values });

					if (result2.error) {
						const toast = {
							closeTimeoutSeconds: 10,
							message: result2.error.message,
							type: ToastType.error
						};
						dispatch(show(toast));
					} else {
						setInitialValues(raceInitialState);
						resetForm();
						dispatch(resetRace());
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
				setInitialValues(raceInitialState);
				resetForm();
				dispatch(resetRace());
				router.replace('/my-stuff');
			}
		},
		[dispatch, createRace, router, getToken, logout]
	);

	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
				<MainContent testId="create-race">
					<h1>Create Race</h1>
					<RaceForm
						abilities={abilities}
						initialValues={initialValues as Omit<Race, 'id'>}
						shouldUseReduxStore
						languages={languages}
						proficiencies={proficiencies}
						spells={spells}
						onSubmit={handleSubmit}
					/>
				</MainContent>
			)}
		</>
	);
};

export default Race;
