import Button, { ButtonType } from '../../components/Button/Button';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { KeyboardEventHandler, useCallback, useEffect, useState } from 'react';

import { Formik } from 'formik';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../components/MainContent/MainContent';
import PasswordValidator from '../../components/PasswordValidator/PasswordValidator';
import RESET_PASSWORD from '../../graphql/mutations/user/resetPassword';
import { ToastType } from '../../types/toast';
import VALIDATE_RESET_PASSWORD from '../../graphql/mutations/user/validateResetPassword';
import classes from './ResetPassword.module.css';
import { cleanMessage } from '../../services/messageCleanerService';
import resetPasswordSchema from '../../yup-schemas/resetPasswordSchema';
import { show } from '../../redux/features/toast';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useMutation } from 'urql';
import useRedirectCountdown from '../../hooks/useRedirectCountdown';
import { useRouter } from 'next/router';

type ResetPasswordProps = {
	otlId: string;
};

const ResetPassword = ({ otlId }: ResetPasswordProps) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(true);
	const [{ error: validateError }, validateResetPassword] = useMutation(
		VALIDATE_RESET_PASSWORD
	);
	const [{ error: resetError }, resetPassword] = useMutation(RESET_PASSWORD);
	const { secondsLeft, startCountdown } = useRedirectCountdown({
		path: '/',
		replace: true,
		seconds: 10
	});

	useEffect(() => {
		if (otlId) {
			validateResetPassword({ otlId }).then(() => {
				setLoading(false);
			});
		}
	}, [validateResetPassword, setLoading, otlId]);

	useEffect(() => {
		if (validateError || resetError) {
			startCountdown();
		}
	}, [validateError, startCountdown, resetError, otlId]);

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

	const toggleShowConfirmPassword = useCallback(() => {
		setShowConfirmPassword(prevState => !prevState);
	}, [setShowConfirmPassword]);

	const toggleShowConfirmPasswordKeyDown: KeyboardEventHandler<SVGSVGElement> =
		useCallback(
			event => {
				if (event.code === 'Enter' || event.code === 'Space') {
					event.preventDefault();
					event.stopPropagation();
					toggleShowConfirmPassword();
				}
			},
			[toggleShowConfirmPassword]
		);

	let headerText = 'Loading...';
	let content = (
		<div className={classes['spinner-container']}>
			<LoadingSpinner />
		</div>
	);

	if (!loading) {
		if (validateError || resetError) {
			headerText = 'Error';
			content = (
				<>
					<div className={classes['error-message']}>
						{cleanMessage(validateError?.message ?? resetError?.message ?? '')}
					</div>
					<p className={classes['countdown-message']}>
						You will be redirected back to the home page in{' '}
						<span className={classes.countdown}>
							{secondsLeft} second{secondsLeft === 1 ? '' : 's'}
						</span>
						.
					</p>
				</>
			);
		} else {
			headerText = 'Reset Password';
			content = (
				<Formik
					initialValues={{ password: '', confirmPassword: '' }}
					validationSchema={resetPasswordSchema}
					onSubmit={async (values, { resetForm }) => {
						const result = await resetPassword({ ...values, otlId });

						if (result.data) {
							dispatch(
								show({
									closeTimeoutSeconds: 10,
									message: result.data.resetPassword,
									type: ToastType.success
								})
							);

							resetForm();
							router.replace('/log-in');
						}
					}}
				>
					{({
						errors,
						touched,
						values,
						handleBlur,
						handleChange,
						handleSubmit,
						isSubmitting,
						setTouched
					}) => (
						<form onSubmit={handleSubmit} className={classes.form}>
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
											placeholder="New Password"
											onChange={event => {
												setTouched({ ...touched, password: false });
												handleChange(event);
											}}
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
										New Password
									</label>
								</div>
								<PasswordValidator password={values.password} />
							</div>
							<div className={classes['input-and-error-container']}>
								<div className={classes['input-and-label-container']}>
									<div className={classes['input-container']}>
										<input
											className={`${classes.input}${
												touched.confirmPassword && errors.confirmPassword
													? ` ${classes['input-error']}`
													: ''
											}`}
											id="confirmPassword"
											name="confirmPassword"
											type={showConfirmPassword ? 'text' : 'password'}
											value={values.confirmPassword}
											placeholder="Confirm Password"
											onChange={event => {
												setTouched({ ...touched, confirmPassword: false });
												handleChange(event);
											}}
											onBlur={handleBlur}
										/>
										{showConfirmPassword ? (
											<EyeOffIcon
												className={classes.eye}
												onClick={toggleShowConfirmPassword}
												onKeyDown={toggleShowConfirmPasswordKeyDown}
												tabIndex={0}
												aria-hidden="false"
												aria-label="Hide Confirm Password"
											/>
										) : (
											<EyeIcon
												className={classes.eye}
												onClick={toggleShowConfirmPassword}
												onKeyDown={toggleShowConfirmPasswordKeyDown}
												tabIndex={0}
												aria-hidden="false"
												aria-label="Show Confirm Password"
											/>
										)}
									</div>
									<label
										htmlFor="confirmPassword"
										className={`${classes.label}${
											values.confirmPassword.length > 0
												? ` ${classes['label-selected']}`
												: ''
										}`}
									>
										Confirm Password
									</label>
								</div>
								{touched.confirmPassword && errors.confirmPassword && (
									<div className={classes.error}>{errors.confirmPassword}</div>
								)}
							</div>
							<Button
								disabled={isSubmitting}
								type={ButtonType.submit}
								positive
								size="medium"
								spacing={4}
							>
								Reset password
							</Button>
						</form>
					)}
				</Formik>
			);
		}
	}

	return (
		<MainContent>
			<div className={classes.content}>
				<h1 className={classes['big-text']}>{headerText}</h1>
				{content}
			</div>
		</MainContent>
	);
};

export default ResetPassword;
