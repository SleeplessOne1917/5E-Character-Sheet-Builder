import { ChangeEvent, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import { AbilityItem } from '../../../types/srd';
import AbilityScores from '../../../types/abilityScores';
import classes from './StandardArray.module.css';
import { getTotalScore } from '../../../services/abilityScoreService';
import { updateBase } from '../../../redux/features/abilityScores';
import useGetAbilityScore from '../../../hooks/useGetAbilityScore';

const arrayValues = [8, 10, 12, 13, 14, 15];

type StandardArrayProps = {
	abilities: AbilityItem[];
};

const StandardArray = ({ abilities }: StandardArrayProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const getAbilityScore = useGetAbilityScore();
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);
	const handleValueSelect = useCallback(
		(event: ChangeEvent<HTMLSelectElement>, abilityIndex: AbilityScores) => {
			const newValue = event.target.value;

			if (newValue === 'blank') {
				dispatch(updateBase({ value: null, abilityIndex }));
			} else {
				dispatch(updateBase({ value: parseInt(newValue), abilityIndex }));
			}
		},
		[dispatch]
	);

	return (
		<div className={classes.abilities}>
			{abilities.map(ability => {
				const abilityScore = getAbilityScore(ability.index as AbilityScores);

				return (
					<div key={ability.index} className={classes.ability}>
						<h3>{ability.full_name}</h3>
						<select
							onChange={event =>
								handleValueSelect(event, ability.index as AbilityScores)
							}
							value={abilityScore.base ? abilityScore.base : 'blank'}
						>
							<option value="blank">&mdash;</option>
							{(abilityScore.base ? [abilityScore.base] : [])
								.concat(
									arrayValues.filter(
										value =>
											!Object.values(abilityScores)
												.map(score => score.base)
												.includes(value)
									)
								)
								.sort((a, b) => {
									if (a < b) {
										return -1;
									} else if (a > b) {
										return 1;
									} else {
										return 0;
									}
								})
								.map(value => (
									<option key={value} value={value}>
										{value}
									</option>
								))}
						</select>
						<h4>
							Total:{' '}
							{abilityScore.base ? getTotalScore(abilityScore) : '\u2014'}
						</h4>
					</div>
				);
			})}
		</div>
	);
};

export default StandardArray;
