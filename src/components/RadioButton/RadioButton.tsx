import { KeyboardEventHandler, useCallback } from 'react';

import classes from './RadioButton.module.css';
import { handleKeyDownEvent } from '../../services/handlerService';

type RadioButtonProps = {
	value: string;
	selected: string;
	labelText: string;
	onChange: (value: string) => void;
};

const RadioButton = ({
	value,
	selected,
	onChange,
	labelText
}: RadioButtonProps) => {
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
		<label
			className={classes['radio-label']}
			onClick={handleClick}
			data-testid="radio-button"
		>
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
			{labelText}
		</label>
	);
};

export default RadioButton;
