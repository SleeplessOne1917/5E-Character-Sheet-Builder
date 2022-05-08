import { ChangeEventHandler, MouseEventHandler, memo } from 'react';

import { AbilityItem } from '../../../types/srd';
import SmallButton from '../../Button/SmallButton';
import classes from './RollDisplay.module.css';

type RollDisplayProps = {
	rolls?: number[] | null;
	abilities: AbilityItem[];
	roll: MouseEventHandler<HTMLButtonElement>;
	ability: string;
	total?: number;
	onSelectAbility: ChangeEventHandler<HTMLSelectElement>;
};

const RollDisplay = ({
	rolls,
	abilities,
	roll,
	onSelectAbility,
	ability,
	total
}: RollDisplayProps) => {
	if (rolls) {
		return (
			<div className={classes['display-container']}>
				<h1>{total}</h1>
				<div className={classes.rolls}>
					{rolls.map((roll, index) => (
						<div key={index} className={classes.roll}>
							{roll}
						</div>
					))}
				</div>
				<select onChange={onSelectAbility} value={ability}>
					<option value="blank">&mdash;</option>
					{abilities.map(a => (
						<option value={a.index} key={a.index}>
							{a.index.toUpperCase()}
						</option>
					))}
				</select>
			</div>
		);
	} else {
		return (
			<div className={classes['display-container']}>
				<h2>&mdash;</h2>
				<SmallButton
					style={{ padding: '1rem', fontSize: '1rem' }}
					positive
					onClick={roll}
				>
					Roll
				</SmallButton>
			</div>
		);
	}
};

export default memo(RollDisplay);
