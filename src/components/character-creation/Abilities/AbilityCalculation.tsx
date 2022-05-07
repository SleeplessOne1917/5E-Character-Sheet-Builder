import classes from './AbilityCalculation.module.css';

type AbilityCalculationProps = {
	index: string;
	name: string;
};

const AbilityCalculation = ({ index, name }: AbilityCalculationProps) => {
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
					<div className={classes.value}>10</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Modifier
					</div>
					<div className={classes.value}>+0</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Base Score
					</div>
					<div className={classes.value}>10</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Racial Bonus
					</div>
					<div className={classes.value}>+0</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Ability Improvements
					</div>
					<div className={classes.value}>+0</div>
				</div>
				<div
					className={`${classes.component} ${classes['calculation-component']}`}
				>
					<div className={`${classes.label} ${classes['calculation-label']}`}>
						Misc Bonus
					</div>
					<div className={classes.value}>+0</div>
				</div>
				<div className={classes.component}>
					<div className={classes.label}>Other Modifier</div>
					<div className={classes.value}>
						<input type="number" placeholder="--" />
					</div>
				</div>
				<div className={classes.component}>
					<div className={classes.label}>Override Score</div>
					<div className={classes.value}>
						<input type="number" placeholder="--" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AbilityCalculation;
