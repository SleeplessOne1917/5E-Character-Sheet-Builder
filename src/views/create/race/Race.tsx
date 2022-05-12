import { SrdItem, SubraceItem } from '../../../types/srd';

import RaceOption from '../../../components/character-creation/Race/RaceOption';
import classes from './Race.module.css';
import commonClasses from '../../Views.module.css';

type RaceProps = {
	races: SrdItem[];
	subraces: SubraceItem[];
};

const Race = ({ races, subraces }: RaceProps): JSX.Element => {
	return (
		<main className={commonClasses.main}>
			<div className={commonClasses.content}>
				<h1 className={classes.title}>Choose Race</h1>
				<ul className={classes['race-list']}>
					{races.map(race => (
						<RaceOption
							race={race}
							subraces={subraces.filter(
								subrace => subrace.race.index === race.index
							)}
							key={race.index}
						/>
					))}
				</ul>
			</div>
		</main>
	);
};

export default Race;
