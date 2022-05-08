import AbilityScores from '../types/abilityScores';
import { useAppSelector } from './reduxHooks';
import { useCallback } from 'react';

const useGetAbilityScore = () => {
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);

	const getAbilityScore = useCallback(
		(abilityIndex: AbilityScores) => {
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
		},
		[abilityScores]
	);

	return getAbilityScore;
};

export default useGetAbilityScore;
