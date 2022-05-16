import { AbilityScore } from './../redux/features/abilityScores';
import { getTotalScore } from './abilityScoreService';

describe('getTotalScore', () => {
	describe('override', () => {
		it('overrides sum of base and bonuses', () => {
			const abilityScore: AbilityScore = {
				base: 10,
				abilityImprovement: 2,
				miscBonus: 1,
				raceBonus: 1,
				otherBonus: 4,
				override: 3
			};

			expect(getTotalScore(abilityScore)).toBe(3);
		});

		it('can be higher than 20', () => {
			const abilityScore: AbilityScore = {
				base: 15,
				override: 21
			};

			expect(getTotalScore(abilityScore)).toBe(21);
		});
	});

	it('does not allow scores over 30', () => {
		const abilityScore: AbilityScore = {
			base: 10,
			override: 31
		};

		expect(getTotalScore(abilityScore)).toBe(30);
	});

	it('does not allow scores without other bonus or override over 20', () => {
		const abilityScore: AbilityScore = {
			base: 18,
			raceBonus: 2,
			abilityImprovement: 4
		};

		expect(getTotalScore(abilityScore)).toBe(20);
	});

	it('allows scores with other bonus over 20', () => {
		const abilityScore: AbilityScore = {
			base: 18,
			raceBonus: 2,
			otherBonus: 5
		};

		expect(getTotalScore(abilityScore)).toBe(25);
	});

	it('does not allow scores lower than 1', () => {
		const abilityScore: AbilityScore = {
			base: 3,
			otherBonus: -10
		};

		expect(getTotalScore(abilityScore)).toBe(1);
	});
});
