import { SrdRace, SrdSubrace } from '../../../../types/srd';

import classes from './SelectedRaceDisplay.module.css';

type SelectedRaceDisplayProps = {
	race: SrdRace;
	subrace?: SrdSubrace;
};

const SelectedRaceDisplay = ({
	race,
	subrace
}: SelectedRaceDisplayProps): JSX.Element => {
	return (
		<div className={classes.container}>
			<div className={classes.summary}>
				<div className={classes['summary-bar']}>
					<div className={classes['summary-item']}>
						<div className={classes['summary-item-header']}>Speed</div>
						<div className={classes['summary-item-data']}>{race.speed}ft</div>
					</div>
					<div className={classes['summary-item']}>
						<div className={classes['summary-item-header']}>Size</div>
						<div
							className={classes['summary-item-data']}
						>{`${race.size[0].toUpperCase()}${race.size
							.slice(1)
							.toLowerCase()}`}</div>
					</div>
					<div className={classes['summary-item']}>
						<div className={classes['summary-item-header']}>Languages</div>
						<div className={classes['summary-item-data']}>
							{race.languages.map(language => language.name).join(', ')}
						</div>
					</div>
				</div>
				{subrace && <p>{subrace.desc}</p>}
			</div>
			<div></div>
		</div>
	);
};

export default SelectedRaceDisplay;
