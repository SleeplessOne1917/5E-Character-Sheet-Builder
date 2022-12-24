import AbilityScores from '../types/abilityScores';
import { AbilityScoresState } from '../redux/features/abilityScores';
import { useAppSelector } from './reduxHooks';
import { useCallback } from 'react';

export const getAbilityScoresTest = (
	abilityScores: AbilityScoresState,
	abilityIndex: AbilityScores
) => {
	switch (abilityIndex) {
		case 'str':
			return abilityScores.str;
		case 'dex':
			return abilityScores.dex;
		case 'con':
			return abilityScores.con;
		case 'int':
			return abilityScores.int;
		case 'wis':
			return abilityScores.wis;
		case 'cha':
			return abilityScores.cha;
	}
};

const useGetAbilityScore = () => {
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);

	const getAbilityScore = useCallback(
		(abilityIndex: AbilityScores) => {
			return getAbilityScoresTest(abilityScores, abilityIndex);
		},
		[abilityScores]
	);

	return getAbilityScore;
};

export default useGetAbilityScore;
