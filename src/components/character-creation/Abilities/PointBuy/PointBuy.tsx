import {
	AbilityScoresState,
	updateBase
} from '../../../../redux/features/abilityScores';
import { KeyboardEvent, useCallback, useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import { AbilityItem } from '../../../../types/srd';
import AbilityScores from '../../../../types/abilityScores';
import classes from './PointBuy.module.css';
import { getTotalScore } from '../../../../services/abilityScoreService';
import { handleKeyDownEvent } from '../../../../services/handlerService';
import useGetAbilityScore from '../../../../hooks/useGetAbilityScore';

export type PointBuyProps = {
	abilities: AbilityItem[];
};

const MAX_POINTS = 27;

const calculateInitialPoints = (base: number, total: number): number => {
	if (base > 13) {
		return calculateInitialPoints(base - 1, total - 2);
	}
	if (base > 8) {
		return calculateInitialPoints(base - 1, total - 1);
	}

	return total;
};

const getInitialPoints = (abilityScores: AbilityScoresState) =>
	Object.values(abilityScores).reduce(
		(prev: number, { base }) => calculateInitialPoints(base as number, prev),
		MAX_POINTS
	);

const PointBuy = ({ abilities }: PointBuyProps): JSX.Element => {
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);
	const getAbilityScore = useGetAbilityScore();
	const dispatch = useAppDispatch();
	const [points, setPoints] = useState(getInitialPoints(abilityScores));

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

	const handleSubtractScoreKeyDown = useCallback(
		(event: KeyboardEvent<SVGSVGElement>, abilityIndex: AbilityScores) => {
			handleKeyDownEvent<SVGSVGElement>(event, () =>
				subtractScore(abilityIndex)
			);
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

	const handleAddScoreKeyDown = useCallback(
		(event: KeyboardEvent<SVGSVGElement>, abilityIndex: AbilityScores) => {
			handleKeyDownEvent<SVGSVGElement>(event, () => addScore(abilityIndex));
		},
		[addScore]
	);

	return (
		<div className={classes.container} role="region" aria-label="Point Buy">
			<div>
				<div className={classes['points-title']}>Points Remaining</div>
				<div className={classes['points-remaining']}>
					{points}/{MAX_POINTS}
				</div>
			</div>
			<div className={classes.abilities}>
				{abilities.map(ability => {
					const indexKey = ability.index as AbilityScores;
					const abilityScore = getAbilityScore(indexKey).base as number;

					return (
						<div key={ability.index} className={classes.ability}>
							<div>{ability.full_name}</div>
							<div className={classes['point-adjuster']}>
								{abilityScore > 8 && (
									<MinusIcon
										className={`${classes.icon} ${classes.minus}`}
										onClick={() => subtractScore(indexKey)}
										tabIndex={0}
										onKeyDown={event =>
											handleSubtractScoreKeyDown(event, indexKey)
										}
										aria-hidden="false"
										aria-label={`${ability.full_name} minus 1`}
										role="button"
									/>
								)}
								{abilityScore}
								{((abilityScore > 13 && points > 1) ||
									(abilityScore <= 13 && points > 0)) &&
									abilityScore < 15 && (
										<PlusIcon
											className={`${classes.icon} ${classes.plus}`}
											onClick={() => addScore(indexKey)}
											tabIndex={0}
											onKeyDown={event =>
												handleAddScoreKeyDown(event, indexKey)
											}
											aria-hidden="false"
											aria-label={`${ability.full_name} plus 1`}
											role="button"
										/>
									)}
							</div>
							<div>Total: {getTotalScore(getAbilityScore(indexKey))}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PointBuy;
