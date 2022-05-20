import Button, { ButtonType } from '../Button/Button';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { Formik, FormikHelpers } from 'formik';
import { KeyboardEventHandler, useCallback, useState } from 'react';

import PasswordValidator from '../PasswordValidator/PasswordValidator';
import classes from './LogInSignUpForm.module.css';

type LogInSignUpValues = {
	email: string;
	password: string;
};

export type LogInSignUpProps = {
	onSubmit: ((
		values: LogInSignUpValues,
		formikHelpers: FormikHelpers<LogInSignUpValues>
	) => void | Promise<any>) &
		((
			values: LogInSignUpValues,
			{ resetForm }: FormikHelpers<LogInSignUpValues>
		) => void);
	schema: any;
	type: 'logIn' | 'signUp';
};

const LogInSignUpForm = ({ type, schema, onSubmit }: LogInSignUpProps) => {
	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = useCallback(() => {
		setShowPassword(prevState => !prevState);
	}, [setShowPassword]);

	const toggleShowPasswordKeyDown: KeyboardEventHandler<SVGSVGElement> =
		useCallback(
			event => {
				if (event.code === 'Enter' || event.code === 'Space') {
					event.preventDefault();
					event.stopPropagation();
					toggleShowPassword();
				}
			},
			[toggleShowPassword]
		);

	return (
		<Formik
			initialValues={{ email: '', password: '' }}
			validationSchema={schema}
			onSubmit={onSubmit}
		>
			{({
				values,
				handleChange,
				handleBlur,
				handleSubmit,
				isSubmitting,
				errors,
				touched
			}) => (
				<form onSubmit={handleSubmit} className={classes.form} role="form">
					<div className={classes['input-and-error-container']}>
						<div className={classes['input-and-label-container']}>
							<div className={classes['input-container']}>
								<input
									className={`${classes.input}${
										touched.email && errors.email
											? ` ${classes['input-error']}`
											: ''
									}`}
									id="email"
									name="email"
									type="text"
									value={values.email}
									placeholder="Email"
									onChange={handleChange}
									onBlur={handleBlur}
								/>{' '}
							</div>
							<label
								htmlFor="email"
								className={`${classes.label}${
									values.email.length > 0 ? ` ${classes['label-selected']}` : ''
								}`}
							>
								Email
							</label>
						</div>
						{touched.email && errors.email && (
							<div className={classes.error}>{errors.email}</div>
						)}
					</div>
					<div className={classes['input-and-error-container']}>
						<div className={classes['input-and-label-container']}>
							<div className={classes['input-container']}>
								<input
									className={`${classes.input}${
										touched.password && errors.password
											? ` ${classes['input-error']}`
											: ''
									}`}
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									value={values.password}
									placeholder="Password"
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								{showPassword ? (
									<EyeOffIcon
										className={classes.eye}
										onClick={toggleShowPassword}
										onKeyDown={toggleShowPasswordKeyDown}
										tabIndex={0}
										aria-hidden="false"
										aria-label="Hide Password"
									/>
								) : (
									<EyeIcon
										className={classes.eye}
										onClick={toggleShowPassword}
										onKeyDown={toggleShowPasswordKeyDown}
										tabIndex={0}
										aria-hidden="false"
										aria-label="Show Password"
									/>
								)}
							</div>
							<label
								htmlFor="password"
								className={`${classes.label}${
									values.password.length > 0
										? ` ${classes['label-selected']}`
										: ''
								}`}
							>
								Password
							</label>
						</div>
						{type === 'logIn' ? (
							touched.password &&
							errors.password && (
								<div className={classes.error}>{errors.password}</div>
							)
						) : (
							<PasswordValidator password={values.password} />
						)}
					</div>
					<Button
						disabled={isSubmitting}
						type={ButtonType.submit}
						positive
						size="large"
						spacing={4}
					>
						{type === 'logIn' ? 'Log In' : 'Sign Up'}
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default LogInSignUpForm;
