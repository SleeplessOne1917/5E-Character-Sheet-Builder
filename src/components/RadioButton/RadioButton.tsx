import { KeyboardEventHandler, useCallback } from 'react';
import { handleKeyDownEvent } from '../../services/handlerService';
import classes from './RadioButton.module.css';

type RadioButtonProps = {
	value: string;
	selected: string;
	onChange: (value: string) => void;
};

const RadioButton = ({ value, selected, onChange }: RadioButtonProps) => {
	const handleClick = useCallback(() => {
		onChange(value);
	}, [onChange, value]);

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = useCallback(
		e => {
			handleKeyDownEvent(e, handleClick);
		},
		[handleClick]
	);

	return (
		<div
			className={`${classes['radio-button']}${
				value === selected ? ` ${classes.selected}` : ''
			}`}
			tabIndex={0}
			role="radio"
			aria-checked={value === selected}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
		>
			<div className={classes['inner-circle']} />
		</div>
	);
};

export default RadioButton;
