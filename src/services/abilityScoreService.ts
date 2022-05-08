import { AbilityScore } from '../redux/features/abilityScores';

export const getTotalScore = (ability: AbilityScore) => {
	let score = ability.override
		? ability.override
		: Object.values(ability).reduce((prev, cur) => prev + (cur ? cur : 0), 0);

	if (!ability.override && score && score < 1) {
		score = 1;
	}

	if (score && score > 30) {
		score = 30;
	}

	return score;
};
