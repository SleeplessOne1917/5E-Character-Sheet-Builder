import { KeyboardEvent, useCallback, useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/solid';

import { AbilityItem } from '../../../types/srd';
import AbilityScores from '../../../types/abilityScores';
import classes from './PointBuy.module.css';
import { getTotalScore } from '../../../services/abilityScoreService';
import { updateBase } from '../../../redux/features/abilityScores';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import useGetAbilityScore from '../../../hooks/useGetAbilityScore';

type PointBuyProps = {
	abilities: AbilityItem[];
};

const MAX_POINTS = 27;

const PointBuy = ({ abilities }: PointBuyProps): JSX.Element => {
	const getAbilityScore = useGetAbilityScore();
	const dispatch = useAppDispatch();
	const [points, setPoints] = useState(MAX_POINTS);

	const subtractScore = useCallback(
		(abilityIndex: AbilityScores) => {
			const oldScore = getAbilityScore(abilityIndex).base as number;
			if (oldScore == 15 || oldScore == 14) {
				setPoints(prevState => prevState + 2);
			} else {
				setPoints(prevState => prevState + 1);
			}

			dispatch(updateBase({ value: oldScore - 1, abilityIndex }));
		},
		[setPoints, dispatch, getAbilityScore]
	);

	const handleSubtractScoreKeyUp = useCallback(
		(event: KeyboardEvent<SVGSVGElement>, abilityIndex: AbilityScores) => {
			event.preventDefault();
			const code = event.code;

			if (code === 'Enter') {
				subtractScore(abilityIndex);
			}
		},
		[subtractScore]
	);

	const addScore = useCallback(
		(abilityIndex: AbilityScores) => {
			const oldScore = getAbilityScore(abilityIndex).base as number;
			if (oldScore == 13 || oldScore == 14) {
				setPoints(prevState => prevState - 2);
			} else {
				setPoints(prevState => prevState - 1);
			}

			dispatch(updateBase({ value: oldScore + 1, abilityIndex }));
		},
		[setPoints, dispatch, getAbilityScore]
	);

	const handleAddScoreKeyUp = useCallback(
		(event: KeyboardEvent<SVGSVGElement>, abilityIndex: AbilityScores) => {
			event.preventDefault();
			const code = event.code;

			if (code === 'Enter') {
				addScore(abilityIndex);
			}
		},
		[addScore]
	);

	return (
		<div className={classes.container}>
			<div className={classes['points-remaining']}>
				<h3>Points Remaining</h3>
				<div>
					{points}/{MAX_POINTS}
				</div>
			</div>
			<div className={classes.abilities}>
				{abilities.map(ability => {
					const indexKey = ability.index as AbilityScores;
					const abilityScore = getAbilityScore(indexKey).base as number;

					return (
						<div key={ability.index} className={classes.ability}>
							<h3>{ability.full_name}</h3>
							<div className={classes['point-adjuster']}>
								{abilityScore > 8 && (
									<MinusIcon
										className={`${classes.icon} ${classes.minus}`}
										onClick={() => subtractScore(indexKey)}
										tabIndex={0}
										onKeyUp={event => handleSubtractScoreKeyUp(event, indexKey)}
									/>
								)}
								<h1>{abilityScore}</h1>
								{((abilityScore > 13 && points > 1) ||
									(abilityScore <= 13 && points > 0)) &&
									abilityScore < 15 && (
										<PlusIcon
											className={`${classes.icon} ${classes.plus}`}
											onClick={() => addScore(indexKey)}
											tabIndex={0}
											onKeyUp={event => handleAddScoreKeyUp(event, indexKey)}
										/>
									)}
							</div>
							<h4>Total: {getTotalScore(getAbilityScore(indexKey))}</h4>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PointBuy;
