import { KeyboardEvent, useCallback, useState } from 'react';

import { CheckIcon } from '@heroicons/react/20/solid';
import classes from './Checkbox.module.css';
import { handleKeyDownEvent } from '../../services/handlerService';

type CheckboxProps = {
	checked?: boolean;
	label: string;
	onChange: (value: boolean) => void;
	useAlternateStyle?: boolean;
};

const Checkbox = ({
	checked,
	onChange,
	label,
	useAlternateStyle = false
}: CheckboxProps) => {
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
		<label
			onClick={handleChange}
			className={classes.label}
			data-testid="checkbox"
		>
			<div
				className={`${classes.checkbox}${
					checked || isChecked ? ` ${classes.checked}` : ''
				}${useAlternateStyle ? ` ${classes.alternate}` : ''}`}
				tabIndex={0}
				role="checkbox"
				aria-checked={isChecked}
				onKeyDown={handleKeyDown}
			>
				{(checked || isChecked) && <CheckIcon className={classes.check} />}
			</div>
			{label}
		</label>
	);
};

export default Checkbox;
