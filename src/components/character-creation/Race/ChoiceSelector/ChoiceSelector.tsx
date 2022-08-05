import Button from '../../../Button/Button';
import { ReactNode } from 'react';
import classes from './ChoiceSelector.module.css';

type ChoiceSelectorProps = {
	isSelected?: boolean;
	selects: ReactNode[];
	selectValues: string[];
	onApply?: () => void;
	onReset?: () => void;
	label: string;
};

const ChoiceSelector = ({
	isSelected = false,
	selects,
	selectValues,
	onApply = () => {},
	onReset = () => {},
	label
}: ChoiceSelectorProps) => (
	<div
		className={`${classes.selector}${isSelected ? ` ${classes.selected}` : ''}`}
		data-testid="choice-selector"
	>
		<div className={classes.label}>{label}</div>
		<div className={classes['select-div']}>{selects}</div>
		<div className={classes['button-div']}>
			<Button size="small" onClick={onReset}>
				Reset
			</Button>
			<Button
				size="small"
				positive
				onClick={onApply}
				disabled={selectValues.includes('blank')}
			>
				Apply
			</Button>
		</div>
		{isSelected && (
			<svg className={classes['dice-icon']}>
				<use xlinkHref="/Icons.svg#logo" />
			</svg>
		)}
	</div>
);
export default ChoiceSelector;
