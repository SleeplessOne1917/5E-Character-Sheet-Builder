import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import { AbilityItem } from '../../../../types/srd';
import AbilityScores from '../../../../types/abilityScores';
import Select from '../../../Select/Select/Select';
import classes from './StandardArray.module.css';
import { getTotalScore } from '../../../../services/abilityScoreService';
import {
	AbilityScore,
	updateBase
} from '../../../../redux/features/abilityScores';
import { useCallback } from 'react';
import useGetAbilityScore from '../../../../hooks/useGetAbilityScore';
import usePreparedSpells from '../../../../hooks/usePreparedSpells';
import { removeSpell } from '../../../../redux/features/spellcasting';
import { removeClassSpell } from '../../../../redux/features/classInfo';

const arrayValues = [8, 10, 12, 13, 14, 15];

export type StandardArrayProps = {
	abilities: AbilityItem[];
};

const StandardArray = ({ abilities }: StandardArrayProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const getAbilityScore = useGetAbilityScore();
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);
	const spellcastingAbility = useAppSelector(
		state =>
			state.editingCharacter.classInfo.class?.spellcasting?.spellcasting_ability
				.index
	);
	const { getNumberOfSpellsToPrepare, shouldPrepareSpells } =
		usePreparedSpells();
	const classSpells = useAppSelector(
		state => state.editingCharacter.classInfo.spells
	)?.filter(({ level }) => level > 0);

	const handleValueSelect = useCallback(
		(value: string | number, abilityIndex: AbilityScores) => {
			if (value === 'blank') {
				dispatch(updateBase({ value: null, abilityIndex }));
			} else {
				dispatch(updateBase({ value: value as number, abilityIndex }));
			}

			if (
				spellcastingAbility &&
				abilityIndex === spellcastingAbility &&
				shouldPrepareSpells
			) {
				const newPreparedSpellsNumber = getNumberOfSpellsToPrepare({
					abilityScore: {
						...(
							abilityScores as {
								[key: string]: AbilityScore;
							}
						)[abilityIndex],
						base: value === 'blank' ? null : (value as number)
					}
				});

				if (classSpells && newPreparedSpellsNumber < classSpells.length) {
					for (
						let i = 0;
						i < classSpells.length - newPreparedSpellsNumber;
						++i
					) {
						const spellToRemove = classSpells[classSpells.length - (i + 1)];

						dispatch(removeSpell(spellToRemove.index));
						dispatch(removeClassSpell(spellToRemove.index));
					}
				}
			}
		},
		[
			dispatch,
			abilityScores,
			classSpells,
			getNumberOfSpellsToPrepare,
			shouldPrepareSpells,
			spellcastingAbility
		]
	);

	return (
		<div
			className={classes.abilities}
			role="region"
			aria-label="Standard Array"
		>
			{abilities.map(ability => {
				const abilityScore = getAbilityScore(ability.index as AbilityScores);

				return (
					<div key={ability.index} className={classes.ability}>
						<Select
							fontSize="1.5rem"
							testId={ability.index}
							label={ability.full_name}
							id={`${ability.index}-select`}
							onChange={value =>
								handleValueSelect(value, ability.index as AbilityScores)
							}
							value={abilityScore.base ? abilityScore.base : 'blank'}
							options={(
								[{ value: 'blank', label: '\u2014' }] as {
									value: string | number;
									label: string;
								}[]
							).concat(
								(abilityScore.base ? [abilityScore.base] : [])
									.concat(
										arrayValues.filter(
											value =>
												!Object.values(abilityScores)
													.map(score => score.base)
													.includes(value)
										)
									)
									.sort((a, b) => a - b)
									.map(value => ({
										value: value,
										label: `${value}`
									}))
							)}
						/>
						<div>
							Total:{' '}
							{abilityScore.base ? getTotalScore(abilityScore) : '\u2014'}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default StandardArray;
