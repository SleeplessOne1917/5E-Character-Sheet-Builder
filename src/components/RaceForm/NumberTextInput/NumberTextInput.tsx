'use client';

import { CSSProperties, ChangeEventHandler, FocusEventHandler } from 'react';

import classes from './NumberTextInput.module.css';

type NumberTextInputProps = {
	label: string;
	id: string;
	touched?: boolean;
	error?: string;
	value?: string | number | null;
	onChange: ChangeEventHandler<HTMLInputElement>;
	onBlur: FocusEventHandler<HTMLInputElement>;
	errorStyle?: CSSProperties;
};

const NumberTextInput = ({
	id,
	label,
	value,
	touched,
	error,
	onBlur,
	onChange,
	errorStyle
}: NumberTextInputProps) => (
	<div className={classes['input-container']}>
		<label htmlFor={id} className={classes['input-label']}>
			{label}
		</label>
		<input
			id={id}
			className={`${classes.input}${
				touched && error ? ` ${classes.error}` : ''
			}`}
			placeholder={'\u2014'}
			type="text"
			onChange={onChange}
			style={{ marginTop: '0.2rem' }}
			value={value ?? ''}
			onBlur={onBlur}
		/>
		{touched && error && (
			<div className={classes['error-message']} style={errorStyle}>
				{error}
			</div>
		)}
	</div>
);

export default NumberTextInput;
