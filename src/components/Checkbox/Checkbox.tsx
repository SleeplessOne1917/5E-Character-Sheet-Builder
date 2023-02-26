'use client';

import { KeyboardEvent, useCallback, useState } from 'react';

import { CheckIcon } from '@heroicons/react/20/solid';
import classes from './Checkbox.module.css';
import { handleKeyDownEvent } from '../../services/handlerService';

type CheckboxProps = {
	checked?: boolean;
	label: string;
	onChange: (value: boolean) => void;
	useAlternateStyle?: boolean;
	hideLabel?: boolean;
	disabled?: boolean;
};

const Checkbox = ({
	checked,
	onChange,
	label,
	useAlternateStyle = false,
	hideLabel = false,
	disabled = false
}: CheckboxProps) => {
	const [isChecked, setIsChecked] = useState(checked ?? false);

	const handleChange = useCallback(() => {
		onChange(!isChecked);

		setIsChecked(prev => !prev);
	}, [onChange, setIsChecked, isChecked]);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			handleKeyDownEvent(event, handleChange);
		},
		[handleChange]
	);

	return (
		<label
			onClick={!disabled ? handleChange : () => {}}
			className={`${classes.label}${disabled ? ` ${classes.disabled}` : ''}`}
			data-testid="checkbox"
		>
			<div
				className={`${classes.checkbox}${
					checked || isChecked ? ` ${classes.checked}` : ''
				}${useAlternateStyle ? ` ${classes.alternate}` : ''}${
					disabled ? ` ${classes.disabled}` : ''
				}`}
				tabIndex={disabled ? -1 : 0}
				role="checkbox"
				aria-disabled={disabled}
				aria-checked={isChecked}
				aria-label={label}
				onKeyDown={!disabled ? handleKeyDown : () => {}}
			>
				{(checked || isChecked) && <CheckIcon className={classes.check} />}
			</div>
			{!hideLabel && label}
		</label>
	);
};

export default Checkbox;
