import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useState
} from 'react';
import {
	calculateModifier,
	getTotalScore
} from '../../../services/abilityScoreService';
import {
	updateOtherBonus,
	updateOverride
} from '../../../redux/features/abilityScores';

import AbilityScores from '../../../types/abilityScores';
import classes from './AbilityCalculation.module.css';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import useGetAbilityScore from '../../../hooks/useGetAbilityScore';

type AbilityCalculationProps = {
	index: string;
	name: string;
};

const AbilityCalculation = ({ index, name }: AbilityCalculationProps) => {
	const [otherBonus, setOtherBonus] = useState<number | undefined>(undefined);
	const [overrideScore, setOverrideScore] = useState<number | undefined>(
		undefined
	);
	const dispatch = useAppDispatch();
	const getAbilityScore = useGetAbilityScore();

	const onChangeOtherBonus: ChangeEventHandler<HTMLInputElement> = useCallback(
		event => {
			setOtherBonus(parseInt(event.target.value));
		},
		[setOtherBonus]
	);

	const onBlurOtherBonus: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			let value: number | null = parseInt(event.target.value);

			if (isNaN(value)) {
				value = null;
			} else {
				if (value < -10) {
					value = -10;
				}

				if (value > 10) {
					value = 10;
				}
			}

			setOtherBonus(value ? value : undefined);
			dispatch(
				updateOtherBonus({ value, abilityIndex: index as AbilityScores })
			);
		},
		[dispatch, index, setOtherBonus]
	);

	const onChangeOverrideScore: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				setOverrideScore(parseInt(event.target.value));
			},
			[setOverrideScore]
		);

	const onBlurOverrideScore: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			let value: number | null = parseInt(event.target.value);

			if (isNaN(value)) {
				value = null;
			} else {
				if (value < 3) {
					value = 3;
				}

				if (value > 30) {
					value = 30;
				}
			}

			setOverrideScore(value ? value : undefined);
			dispatch(updateOverride({ value, abilityIndex: index as AbilityScores }));
		},
		[dispatch, index, setOverrideScore]
	);

	const abilityScore = getAbilityScore(index as AbilityScores);
	const modifier = abilityScore.base
		? calculateModifier(getTotalScore(abilityScore))
		: null;
	return (
		<div className={classes.calculation}>
			<div className={classes.header}>
				<svg className={classes.icon}>
					<use xlinkHref={`/Icons.svg#${index}`} />
				</svg>
				{name}
			</div>
			<div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Total Score
					</div>
					<div className={classes.value}>
						{abilityScore.base ? getTotalScore(abilityScore) : '\u2014'}
					</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Modifier
					</div>
					<div className={classes.value}>
						{modifier !== null
							? `${modifier < 0 ? '-' : '+'}${Math.abs(modifier)}`
							: '\u2014'}
					</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Base Score
					</div>
					<div className={classes.value}>
						{abilityScore.base ? abilityScore.base : '\u2014'}
					</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Racial Bonus
					</div>
					<div className={classes.value}>
						+{abilityScore.raceBonus ? abilityScore.raceBonus : 0}
					</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Ability Improvements
					</div>
					<div className={classes.value}>
						+
						{abilityScore.abilityImprovement
							? abilityScore.abilityImprovement
							: 0}
					</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Misc Bonus
					</div>
					<div className={classes.value}>
						+{abilityScore.miscBonus ? abilityScore.miscBonus : 0}
					</div>
				</div>
				<div className={classes.component}>
					<div className={classes.label}>
						<label htmlFor={`other-${index}`}>Other Modifier</label>
					</div>
					<div className={classes.value}>
						<input
							id={`other-${index}`}
							type="number"
							placeholder="&mdash;"
							value={otherBonus}
							onChange={onChangeOtherBonus}
							onBlur={onBlurOtherBonus}
						/>
					</div>
				</div>
				<div className={classes.component}>
					<div className={classes.label}>
						<label htmlFor={`override-${index}`}>Override Score</label>
					</div>
					<div className={classes.value}>
						<input
							id={`override-${index}`}
							type="number"
							placeholder="&mdash;"
							value={overrideScore}
							onChange={onChangeOverrideScore}
							onBlur={onBlurOverrideScore}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AbilityCalculation;
