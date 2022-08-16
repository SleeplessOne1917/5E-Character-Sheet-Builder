import { MouseEventHandler, memo } from 'react';

import { AbilityItem } from '../../../../../types/srd';
import Button from '../../../../Button/Button';
import Select from '../../../../Select/Select';
import classes from './RollDisplay.module.css';

export type RollDisplayProps = {
	rolls?: number[] | null;
	abilities: AbilityItem[];
	roll: MouseEventHandler<HTMLButtonElement>;
	ability?: string | null;
	total?: number;
	selectTestId?: string;
	onSelectAbility: (value: string) => void;
};

const RollDisplay = ({
	rolls,
	abilities,
	roll,
	onSelectAbility,
	ability,
	total,
	selectTestId
}: RollDisplayProps): JSX.Element => {
	if (rolls) {
		return (
			<div className={classes['display-container']} data-testid="roll-display">
				<div className={classes.total} data-testid="roll-total">
					{total}
				</div>
				<div className={classes.rolls}>
					{rolls.map((roll, index) => (
						<div key={index} className={classes.roll} data-testid="roll-die">
							{roll}
						</div>
					))}
				</div>
				<Select
					fontSize="1.5rem"
					onChange={onSelectAbility as (value: string | number) => void}
					value={ability ? ability : 'blank'}
					options={[{ value: 'blank', label: '\u2014' }].concat(
						abilities.map(a => ({
							value: a.index,
							label: a.index.toUpperCase()
						}))
					)}
					testId={selectTestId}
				/>
			</div>
		);
	} else {
		return (
			<div className={classes['display-container']} data-testid="roll-display">
				<div className={classes.total}>&mdash;</div>
				<Button positive onClick={roll} size="medium">
					Roll
				</Button>
			</div>
		);
	}
};

export default memo(RollDisplay);
