import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import { AbilityItem } from '../../../../types/srd';
import AbilityScores from '../../../../types/abilityScores';
import Select from '../../../Select/Select';
import classes from './StandardArray.module.css';
import { getTotalScore } from '../../../../services/abilityScoreService';
import { updateBase } from '../../../../redux/features/abilityScores';
import { useCallback } from 'react';
import useGetAbilityScore from '../../../../hooks/useGetAbilityScore';

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
	const handleValueSelect = useCallback(
		(value: string | number, abilityIndex: AbilityScores) => {
			if (value === 'blank') {
				dispatch(updateBase({ value: null, abilityIndex }));
			} else {
				dispatch(
					updateBase({ value: parseInt(value as string, 10), abilityIndex })
				);
			}
		},
		[dispatch]
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
						<label id={`${ability.index}-select-label`}>
							{ability.full_name}
						</label>
						<Select
							testId={ability.index}
							labelledBy={`${ability.index}-select-label`}
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
