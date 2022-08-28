import classes from './Checkbox.module.css';
import { useState, KeyboardEvent, useCallback } from 'react';
import { handleKeyDownEvent } from '../../services/handlerService';
import { CheckIcon } from '@heroicons/react/20/solid';

type CheckboxProps = {
	checked?: boolean;
	label?: string;
	onChange: (value: boolean) => void;
};

const Checkbox = ({ checked, onChange, label }: CheckboxProps) => {
	const [isChecked, setIsChecked] = useState(checked ?? false);

	const handleChange = useCallback(() => {
		setIsChecked(prev => {
			onChange(!prev);

			return !prev;
		});
	}, [onChange, setIsChecked]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			handleKeyDownEvent(event, handleChange);
		},
		[handleChange]
	);

	return (
		<div
			className={`${classes.checkbox}${
				checked || isChecked ? ` ${classes.checked}` : ''
			}`}
			tabIndex={0}
			role="checkbox"
			aria-checked={isChecked}
			onClick={handleChange}
			onKeyDown={handleKeyDown}
			aria-label={label}
		>
			{(checked || isChecked) && <CheckIcon className={classes.check} />}
		</div>
	);
};

export default Checkbox;
