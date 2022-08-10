import { AbilityBonus } from './../types/srd';
import { SrdFullRaceItem, SrdFullSubraceItem } from '../types/srd';

export const getIsAllBonusesSame = (abilityBonuses: AbilityBonus[]) =>
	abilityBonuses.reduce(
		(acc: { isSame: boolean; value?: number }, cur) => {
			if (!acc.value) {
				return {
					...acc,
					value: cur.bonus
				};
			} else {
				return {
					...acc,
					isSame: acc.value === cur.bonus
				};
			}
		},
		{ isSame: true, value: undefined }
	);

export const getAbilityScoreDescription = (
	race: Partial<SrdFullRaceItem> & Pick<SrdFullRaceItem, 'ability_bonuses'>,
	subrace?: Partial<SrdFullSubraceItem> &
		Pick<SrdFullSubraceItem, 'ability_bonuses'>
) => {
	let description: string;
	let abilityBonuses = race.ability_bonuses;

	if (subrace) {
		abilityBonuses = abilityBonuses.concat(subrace.ability_bonuses);

		abilityBonuses = abilityBonuses.filter(
			abilityBonus =>
				abilityBonus.bonus ===
				abilityBonuses.reduce(
					(acc, cur) =>
						cur.ability_score.index === abilityBonus.ability_score.index &&
						cur.bonus > acc
							? cur.bonus
							: acc,
					0
				)
		);
	}

	const allSameBonuses = getIsAllBonusesSame(abilityBonuses);

	if (allSameBonuses.isSame && abilityBonuses.length > 1) {
		description = `+${allSameBonuses.value} to ${abilityBonuses.reduce(
			(acc, cur, index) =>
				`${acc}${
					index === abilityBonuses.length - 1 && !race.ability_bonus_options
						? 'and '
						: ''
				}${cur.ability_score.full_name}${
					index === abilityBonuses.length - 1
						? ''
						: abilityBonuses.length === 2 && !race.ability_bonus_options
						? ' '
						: ', '
				}`,
			''
		)}`;
	} else if (abilityBonuses.length === 1) {
		const abilityBonus = abilityBonuses[0];
		description = `+${abilityBonus.bonus} to ${abilityBonus.ability_score.full_name}`;
	} else {
		description = abilityBonuses.reduce(
			(acc, cur, index) =>
				`${acc}${
					index === abilityBonuses.length - 1 && !race.ability_bonus_options
						? 'and '
						: ''
				}+${cur.bonus} ${cur.ability_score.full_name}${
					index === abilityBonuses.length - 1
						? ''
						: abilityBonuses.length === 2 && !race.ability_bonus_options
						? ' '
						: ', '
				}`,
			''
		);
	}

	if (race.ability_bonus_options) {
		const allSameBonusChoices = getIsAllBonusesSame(
			race.ability_bonus_options.from.options
		);

		if (allSameBonusChoices.isSame) {
			description = `${description}, and +${allSameBonusChoices.value} to ${
				race.ability_bonus_options.choose
			} from ${race.ability_bonus_options.from.options.reduce(
				(acc, cur, index) =>
					`${acc}${
						index === (race.ability_bonus_options?.from.options.length ?? 1) - 1
							? 'and '
							: ''
					}${cur.ability_score.full_name}${
						index === (race.ability_bonus_options?.from.options.length ?? 1) - 1
							? '.'
							: (race.ability_bonus_options?.from.options.length ?? 1) == 2
							? ' '
							: ', '
					}`,
				''
			)}`;
		} else {
			description = `${description}, and ${
				race.ability_bonus_options.choose
			} from ${race.ability_bonus_options.from.options.reduce(
				(acc, cur, index) =>
					`${acc}${
						index === (race.ability_bonus_options?.from.options.length ?? 1) - 1
							? 'and '
							: ''
					}+${cur.bonus} ${cur.ability_score.full_name}${
						index === (race.ability_bonus_options?.from.options.length ?? 1) - 1
							? '.'
							: (race.ability_bonus_options?.from.options.length ?? 1) == 2
							? ' '
							: ', '
					}`,
				''
			)}`;
		}
	}

	if (!description.endsWith('.')) {
		description = description + '.';
	}

	return description;
};
