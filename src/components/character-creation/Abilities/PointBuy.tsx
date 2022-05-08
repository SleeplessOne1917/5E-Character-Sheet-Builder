import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { useCallback, useState } from 'react';

import { AbilityItem } from '../../../types/srd';
import classes from './PointBuy.module.css';

type PointBuyProps = {
	abilities: AbilityItem[];
};

const MAX_POINTS = 27;

const PointBuy = ({ abilities }: PointBuyProps) => {
	const [abilityScores, setAbilityScores] = useState(
		abilities.reduce((prev, cur) => ({ ...prev, [cur.index]: 8 }), {})
	);
	const [points, setPoints] = useState(MAX_POINTS);

	const subtractScore = useCallback(
		(abilityIndex: keyof typeof abilityScores) => {
			const oldScore = abilityScores[abilityIndex];
			if (oldScore == 15 || oldScore == 14) {
				setPoints(prevState => prevState + 2);
			} else {
				setPoints(prevState => prevState + 1);
			}

			setAbilityScores(prevState => ({
				...prevState,
				[abilityIndex]: oldScore - 1
			}));
		},
		[abilityScores, setPoints, setAbilityScores]
	);

	const addScore = useCallback(
		(abilityIndex: keyof typeof abilityScores) => {
			const oldScore = abilityScores[abilityIndex];
			if (oldScore == 13 || oldScore == 14) {
				setPoints(prevState => prevState - 2);
			} else {
				setPoints(prevState => prevState - 1);
			}

			setAbilityScores(prevState => ({
				...prevState,
				[abilityIndex]: oldScore + 1
			}));
		},
		[abilityScores, setPoints, setAbilityScores]
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
					const indexKey = ability.index as keyof typeof abilityScores;
					const abilityScore = abilityScores[indexKey];

					return (
						<div key={ability.index} className={classes.ability}>
							<h3>{ability.full_name}</h3>
							<div className={classes['point-adjuster']}>
								{abilityScore > 8 && (
									<MinusIcon
										className={`${classes.icon} ${classes.minus}`}
										onClick={() => subtractScore(indexKey)}
									/>
								)}
								<h1>{abilityScore}</h1>
								{((abilityScore > 13 && points > 1) ||
									(abilityScore <= 13 && points > 0)) &&
									abilityScore < 15 && (
										<PlusIcon
											className={`${classes.icon} ${classes.plus}`}
											onClick={() => addScore(indexKey)}
										/>
									)}
							</div>
							<h4>Total: 10</h4>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PointBuy;
