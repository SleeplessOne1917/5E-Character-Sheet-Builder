import { AbilityScore } from '../redux/features/abilityScores';

export const getTotalScore = (ability: AbilityScore) => {
	let score = (
		ability.override
			? ability.override
			: (ability.base || 0) +
			  (ability.raceBonus || 0) +
			  (ability.abilityImprovement || 0) +
			  (ability.miscBonus || 0)
	) as number;

	if (!ability.override) {
		if (score > ability.highest) {
			score = ability.highest;
		}

		score += ability.otherBonus ?? 0;
	}

	if (score > 30) {
		score = 30;
	}

	if (score < 1) {
		score = 1;
	}

	return score;
};

export const calculateModifier = (score: number) =>
	Math.floor((score - 10) / 2);
