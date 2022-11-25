'use client';

import Button from '../../../../Button/Button';
import { ReactNode } from 'react';
import classes from './ChoiceSelector.module.css';
import useMediaQuery from '../../../../../hooks/useMediaQuery';

type ChoiceSelectorProps = {
	isSelected?: boolean;
	selects: ReactNode[];
	onReset?: () => void;
	label: string;
};

const ChoiceSelector = ({
	isSelected = false,
	selects,
	onReset = () => {},
	label
}: ChoiceSelectorProps) => {
	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');

	return (
		<div
			className={`${classes.selector}${
				isSelected ? ` ${classes.selected}` : ''
			}`}
			data-testid="choice-selector"
		>
			<div className={classes.label}>{label}</div>
			<div className={classes['select-div']}>{selects}</div>
			<div className={classes['button-div']}>
				<Button size={isMediumOrLarger ? 'medium' : 'small'} onClick={onReset}>
					Reset
				</Button>
			</div>
		</div>
	);
};
export default ChoiceSelector;
