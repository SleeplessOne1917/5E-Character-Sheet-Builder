import Button, { ButtonType } from '../../../components/Button/Button';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { KeyboardEventHandler, useCallback, useState } from 'react';

import { Formik } from 'formik';
import LOG_IN from '../../../graphql/mutations/user/logIn';
import MainContent from '../../../components/MainContent/MainContent';
import { ToastType } from '../../../types/toast';
import { fetchLoggedInEmail } from '../../../redux/features/viewer';
import logInClasses from '../LogInSignUp.module.css';
import logInSchema from '../../../yup-schemas/logInSchema';
import { show } from '../../../redux/features/toast';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';

const LogIn = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const [logInResult, logIn] = useMutation(LOG_IN);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	const toggleShowPassword = useCallback(() => {
		setShowPassword(prevState => !prevState);
	}, [setShowPassword]);

	const toggleShowPasswordKeyUp: KeyboardEventHandler<SVGSVGElement> =
		useCallback(
			event => {
				if (event.code === 'Enter') {
					toggleShowPassword();
				}
			},
			[toggleShowPassword]
		);

	return (
		<MainContent>
			<h1 className={logInClasses['big-text']}>Log In</h1>
			<Formik
				initialValues={{ email: '', password: '' }}
				validationSchema={logInSchema}
				onSubmit={(values, { resetForm }) => {
					const { email, password } = values;
					logIn({ user: { email, password } }).then(result => {
						if (result.error) {
							const toast = {
								closeTimeoutSeconds: 10,
								message: result.error.message,
								type: ToastType.error
							};
							dispatch(show(toast));
						} else {
							dispatch(fetchLoggedInEmail());
							router.replace('/');
						}
					});
					resetForm();
				}}
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
					<form onSubmit={handleSubmit} className={logInClasses.form}>
						<div className={logInClasses['input-and-error-container']}>
							<div className={logInClasses['input-and-label-container']}>
								<div className={logInClasses['input-container']}>
									<input
										className={`${logInClasses.input}${
											touched.email && errors.email
												? ` ${logInClasses['input-error']}`
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
									className={`${logInClasses.label}${
										values.email.length > 0
											? ` ${logInClasses['label-selected']}`
											: ''
									}`}
								>
									Email
								</label>
							</div>
							{touched.email && errors.email && (
								<div className={logInClasses.error}>{errors.email}</div>
							)}
						</div>
						<div className={logInClasses['input-and-error-container']}>
							<div className={logInClasses['input-and-label-container']}>
								<div className={logInClasses['input-container']}>
									<input
										className={`${logInClasses.input}${
											touched.password && errors.password
												? ` ${logInClasses['input-error']}`
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
											className={logInClasses.eye}
											onClick={toggleShowPassword}
											onKeyUp={toggleShowPasswordKeyUp}
											tabIndex={0}
											aria-hidden="false"
											aria-label="Hide Password"
										/>
									) : (
										<EyeIcon
											className={logInClasses.eye}
											onClick={toggleShowPassword}
											onKeyUp={toggleShowPasswordKeyUp}
											tabIndex={0}
											aria-hidden="false"
											aria-label="Show Password"
										/>
									)}
								</div>
								<label
									htmlFor="password"
									className={`${logInClasses.label}${
										values.password.length > 0
											? ` ${logInClasses['label-selected']}`
											: ''
									}`}
								>
									Password
								</label>
							</div>
							{touched.password && errors.password && (
								<div className={logInClasses.error}>{errors.password}</div>
							)}
						</div>
						<Button
							disabled={isSubmitting}
							type={ButtonType.submit}
							positive
							size="large"
							spacing={4}
						>
							Log In
						</Button>
					</form>
				)}
			</Formik>
		</MainContent>
	);
};

export default LogIn;
