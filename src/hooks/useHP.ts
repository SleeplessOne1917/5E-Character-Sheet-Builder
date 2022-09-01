import { getTotalScore } from './../services/abilityScoreService';
import { calculateModifier } from '../services/abilityScoreService';
import { useAppSelector } from './reduxHooks';

const useHP = () => {
	const hit_die = useAppSelector(
		state => state.editingCharacter.classInfo.class?.hit_die
	);
	const levelHPBonuses = useAppSelector(
		state => state.editingCharacter.hp.levelHPBonuses
	);
	const constitutionAbility = useAppSelector(
		state => state.editingCharacter.abilityScores.con
	);
	const constitutionModifier = constitutionAbility.base
		? calculateModifier(getTotalScore(constitutionAbility))
		: 0;

	return hit_die && !levelHPBonuses.some(bonus => bonus === null)
		? hit_die +
				constitutionModifier +
				levelHPBonuses.reduce<number>(
					(acc, cur) => acc + (cur as number) + constitutionModifier,
					0
				)
		: null;
};

export default useHP;
