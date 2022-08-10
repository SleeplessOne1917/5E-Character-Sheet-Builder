import { AbilityBonus } from './../types/srd';
import { SrdFullRaceItem, SrdFullSubraceItem } from '../types/srd';

import {
	getAbilityScoreDescription,
	getIsAllBonusesSame
} from './abilityBonusService';

describe('getIsAllBonusesSame', () => {
	it('isSame is true when all bonuses are the same', () => {
		const mockAbilityBonuses: AbilityBonus[] = [
			{ bonus: 1, ability_score: { index: 'cha', full_name: 'Charisma' } },
			{ bonus: 1, ability_score: { index: 'dex', full_name: 'Dexterity' } },
			{ bonus: 1, ability_score: { index: 'wis', full_name: 'Wisdom' } }
		];

		const result = getIsAllBonusesSame(mockAbilityBonuses);

		expect(result.isSame).toBe(true);
	});

	it('isSame is false when bonuses are different', () => {
		const mockAbilityBonuses: AbilityBonus[] = [
			{ bonus: 1, ability_score: { index: 'cha', full_name: 'Charisma' } },
			{ bonus: 1, ability_score: { index: 'dex', full_name: 'Dexterity' } },
			{ bonus: 2, ability_score: { index: 'wis', full_name: 'Wisdom' } }
		];

		const result = getIsAllBonusesSame(mockAbilityBonuses);

		expect(result.isSame).toBe(false);
	});
});

describe('getAbilityScoreDescription', () => {
	it('returns expected output when there is one ability bonus', () => {
		const mockRace: Pick<SrdFullRaceItem, 'ability_bonuses'> = {
			ability_bonuses: [
				{ bonus: 2, ability_score: { index: 'dex', full_name: 'Dexterity' } }
			]
		};

		const result = getAbilityScoreDescription(mockRace);

		expect(result).toBe('+2 to Dexterity.');
	});
	it('returns expected output with just race ability bonuses', () => {
		const mockRace: Pick<SrdFullRaceItem, 'ability_bonuses'> = {
			ability_bonuses: [
				{ bonus: 1, ability_score: { index: 'dex', full_name: 'Dexterity' } },
				{ bonus: 2, ability_score: { index: 'str', full_name: 'Strength' } }
			]
		};

		const result = getAbilityScoreDescription(mockRace);

		expect(result).toBe('+1 Dexterity and +2 Strength.');
	});

	it('returns expected output when all ability bonuses are the same', () => {
		const mockRace: Pick<SrdFullRaceItem, 'ability_bonuses'> = {
			ability_bonuses: [
				{ bonus: 1, ability_score: { index: 'dex', full_name: 'Dexterity' } },
				{ bonus: 1, ability_score: { index: 'str', full_name: 'Strength' } },
				{ bonus: 1, ability_score: { index: 'wis', full_name: 'Wisdom' } },
				{ bonus: 1, ability_score: { index: 'cha', full_name: 'Charisma' } },
				{
					bonus: 1,
					ability_score: { index: 'con', full_name: 'Constitution' }
				},
				{ bonus: 1, ability_score: { index: 'int', full_name: 'Intelligence' } }
			]
		};

		const result = getAbilityScoreDescription(mockRace);

		expect(result).toBe(
			'+1 to Dexterity, Strength, Wisdom, Charisma, Constitution, and Intelligence.'
		);
	});

	it('merges race and subrace ability bonuses', () => {
		const mockRace: Pick<SrdFullRaceItem, 'ability_bonuses'> = {
			ability_bonuses: [
				{ bonus: 1, ability_score: { index: 'dex', full_name: 'Dexterity' } },
				{ bonus: 1, ability_score: { index: 'str', full_name: 'Strength' } }
			]
		};
		const mockSubrace: Pick<SrdFullSubraceItem, 'ability_bonuses'> = {
			ability_bonuses: [
				{ bonus: 1, ability_score: { index: 'wis', full_name: 'Wisdom' } }
			]
		};

		const result = getAbilityScoreDescription(mockRace, mockSubrace);

		expect(result).toBe('+1 to Dexterity, Strength, and Wisdom.');
	});

	it('returns expected output when dealing with ability score options with same bonus', () => {
		const mockRace: Pick<
			SrdFullRaceItem,
			'ability_bonuses' | 'ability_bonus_options'
		> = {
			ability_bonuses: [
				{ bonus: 1, ability_score: { index: 'dex', full_name: 'Dexterity' } },
				{ bonus: 2, ability_score: { index: 'str', full_name: 'Strength' } }
			],
			ability_bonus_options: {
				choose: 1,
				from: {
					options: [
						{
							bonus: 1,
							ability_score: { index: 'int', full_name: 'Intelligence' }
						},
						{ bonus: 1, ability_score: { index: 'wis', full_name: 'Wisdom' } }
					]
				}
			}
		};

		const result = getAbilityScoreDescription(mockRace);

		expect(result).toBe(
			'+1 Dexterity, +2 Strength, and +1 to 1 from Intelligence and Wisdom.'
		);
	});

	it('returns expected output when dealing with ability score options with same bonuses', () => {
		const mockRace: Pick<
			SrdFullRaceItem,
			'ability_bonuses' | 'ability_bonus_options'
		> = {
			ability_bonuses: [
				{ bonus: 1, ability_score: { index: 'dex', full_name: 'Dexterity' } },
				{ bonus: 2, ability_score: { index: 'str', full_name: 'Strength' } }
			],
			ability_bonus_options: {
				choose: 1,
				from: {
					options: [
						{
							bonus: 1,
							ability_score: { index: 'int', full_name: 'Intelligence' }
						},
						{ bonus: 2, ability_score: { index: 'wis', full_name: 'Wisdom' } }
					]
				}
			}
		};

		const result = getAbilityScoreDescription(mockRace);

		expect(result).toBe(
			'+1 Dexterity, +2 Strength, and 1 from +1 Intelligence and +2 Wisdom.'
		);
	});

	it('returns expected output when both ability scores bonuses and options have same bonuses', () => {
		const mockRace: Pick<
			SrdFullRaceItem,
			'ability_bonuses' | 'ability_bonus_options'
		> = {
			ability_bonuses: [
				{
					bonus: 1,
					ability_score: {
						index: 'str',
						full_name: 'Strength'
					}
				},
				{
					bonus: 1,
					ability_score: {
						index: 'dex',
						full_name: 'Dexterity'
					}
				}
			],
			ability_bonus_options: {
				choose: 2,
				from: {
					options: [
						{
							bonus: 1,
							ability_score: {
								index: 'wis',
								full_name: 'Wisdom'
							}
						},
						{
							bonus: 1,
							ability_score: {
								index: 'int',
								full_name: 'Intelligence'
							}
						},
						{
							bonus: 1,
							ability_score: {
								index: 'cha',
								full_name: 'Charisma'
							}
						}
					]
				}
			}
		};

		const mockSubrace: Pick<SrdFullSubraceItem, 'ability_bonuses'> = {
			ability_bonuses: [
				{
					bonus: 1,
					ability_score: {
						index: 'con',
						full_name: 'Constitution'
					}
				}
			]
		};

		const result = getAbilityScoreDescription(mockRace, mockSubrace);

		expect(result).toBe(
			'+1 to Strength, Dexterity, Constitution, and +1 to 2 from Wisdom, Intelligence, and Charisma.'
		);
	});
});
