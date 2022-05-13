import {
	ChevronDownIcon,
	ChevronRightIcon,
	ChevronUpIcon
} from '@heroicons/react/solid';
import {
	KeyboardEvent,
	KeyboardEventHandler,
	useCallback,
	useState
} from 'react';
import { SrdItem, SubraceItem } from '../../../types/srd';

import classes from './RaceOption.module.css';

type RaceOptionProps = {
	race: SrdItem;
	subraces?: SubraceItem[];
	onChoose: (subraceIndex?: string) => void;
};

const RaceOption = ({
	race,
	subraces,
	onChoose
}: RaceOptionProps): JSX.Element => {
	const [showSubraces, setShowSubraces] = useState(false);
	const hasMultipleSubraces = subraces && subraces.length > 1;
	const hasOneSubrace = subraces && subraces.length === 1;
	const raceTitle = hasOneSubrace ? subraces[0].name : race.name;

	const handleRaceClick = useCallback(() => {
		if (hasMultipleSubraces) {
			setShowSubraces(prevState => !prevState);
		} else if (hasOneSubrace) {
			onChoose(subraces[0].index);
		} else {
			onChoose();
		}
	}, [setShowSubraces, hasMultipleSubraces, onChoose, hasOneSubrace, subraces]);

	const handleRaceKeyUp: KeyboardEventHandler<HTMLDivElement> = useCallback(
		event => {
			if (event.code === 'Enter') {
				handleRaceClick();
			}
		},
		[handleRaceClick]
	);

	const handleSubraceClick = useCallback(
		(subraceIndex: string) => {
			onChoose(subraceIndex);
		},
		[onChoose]
	);

	const handleSubraceKeyUp = useCallback(
		(event: KeyboardEvent<HTMLDivElement>, subraceIndex: string) => {
			if (event.code === 'Enter') {
				onChoose(subraceIndex);
			}
		},
		[onChoose]
	);

	return (
		<li className={classes['race-li']}>
			<div>
				<div
					className={classes['race-container']}
					tabIndex={0}
					onClick={handleRaceClick}
					onKeyUp={handleRaceKeyUp}
					aria-label={raceTitle}
				>
					<div className={classes['race-title']}>{raceTitle}</div>
					{hasMultipleSubraces ? (
						showSubraces ? (
							<ChevronUpIcon className={classes.chevron} />
						) : (
							<ChevronDownIcon className={classes.chevron} />
						)
					) : (
						<ChevronRightIcon className={classes.chevron} />
					)}
				</div>
				{showSubraces && (
					<ul className={classes['subrace-list']}>
						{subraces?.map(subrace => (
							<li key={subrace.index}>
								<div
									className={classes['race-container']}
									tabIndex={0}
									aria-label={subrace.name}
									onClick={() => handleSubraceClick(subrace.index)}
									onKeyUp={event => handleSubraceKeyUp(event, subrace.index)}
								>
									<div className={classes['race-title']}>{subrace.name}</div>
									<ChevronRightIcon className={classes.chevron} />
								</div>
							</li>
						))}
					</ul>
				)}
			</div>
		</li>
	);
};

export default RaceOption;
