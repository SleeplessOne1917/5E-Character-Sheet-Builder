import {
	ChangeEventHandler,
	FocusEventHandler,
	KeyboardEventHandler,
	ReactNode,
	useCallback,
	useState
} from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

import PasswordValidator from '../PasswordValidator/PasswordValidator';
import classes from './TextInput.module.css';
import { handleKeyDownEvent } from '../../services/handlerService';

type TextInputProps = {
	touched?: boolean;
	error?: string;
	id: string;
	value: string;
	label: ReactNode;
	onChange: ChangeEventHandler<HTMLInputElement>;
	onBlur: FocusEventHandler<HTMLInputElement>;
	type?: 'text' | 'password' | 'validate-password';
	darkBackground?: boolean;
};

const TextInput = ({
	touched,
	error,
	id,
	value,
	label,
	onChange,
	onBlur,
	type = 'text',
	darkBackground = false
}: TextInputProps) => {
	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = useCallback(() => {
		setShowPassword(prevState => !prevState);
	}, [setShowPassword]);

	const toggleShowPasswordKeyDown: KeyboardEventHandler<SVGSVGElement> =
		useCallback(
			event => {
				handleKeyDownEvent<SVGSVGElement>(event, toggleShowPassword);
			},
			[toggleShowPassword]
		);

	return (
		<div
			className={classes['input-and-error-container']}
			data-testid="text-input"
		>
			<div className={classes['input-and-label-container']}>
				<div className={classes['input-container']}>
					<input
						className={`${classes.input}${
							touched && error ? ` ${classes['input-error']}` : ''
						}`}
						id={id}
						name={id}
						type={showPassword || type === 'text' ? 'text' : 'password'}
						value={value}
						onChange={onChange}
						onBlur={onBlur}
					/>
					{type === 'text' ? (
						''
					) : showPassword ? (
						<EyeSlashIcon
							className={classes.eye}
							onClick={toggleShowPassword}
							onKeyDown={toggleShowPasswordKeyDown}
							tabIndex={0}
							aria-hidden="false"
							aria-label={`Hide ${typeof label === 'string' ? label : id}`}
						/>
					) : (
						<EyeIcon
							className={classes.eye}
							onClick={toggleShowPassword}
							onKeyDown={toggleShowPasswordKeyDown}
							tabIndex={0}
							aria-hidden="false"
							aria-label={`Show ${typeof label === 'string' ? label : id}`}
						/>
					)}
				</div>
				<label
					htmlFor={id}
					className={`${classes.label}${
						value.length > 0 ? ` ${classes['label-selected']}` : ''
					}${darkBackground ? ` ${classes['light-label']}` : ''}`}
				>
					{label}
				</label>
			</div>
			{type === 'validate-password' ? (
				<PasswordValidator password={value} />
			) : (
				touched && error && <div className={classes.error}>{error}</div>
			)}
		</div>
	);
};

export default TextInput;
