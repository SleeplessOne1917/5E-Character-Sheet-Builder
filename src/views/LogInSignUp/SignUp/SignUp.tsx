import BigButton, { ButtonType } from '../../../components/Button/BigButton';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { ToastShowPayload, show } from '../../../redux/features/toast';

import { Formik } from 'formik';
import PasswordValidator from '../../../components/PasswordValidator/PasswordValidator';
import SIGN_UP from '../../../graphql/mutations/user/signUp';
import { ToastType } from '../../../types/toast';
import commonClasses from '../../Views.module.css';
import { fetchLoggedInEmail } from '../../../redux/features/viewer';
import logInClasses from '../LogInSignUp.module.css';
import signUpSchema from '../../../yup-schemas/signUpSchema';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';
import { useState } from 'react';

const SignUp = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const [signUpResult, signUp] = useMutation(SIGN_UP);
	const router = useRouter();

	return (
		<main className={commonClasses.main}>
			<div className={`${commonClasses.content} ${logInClasses.content}`}>
				<h1 className={logInClasses['big-text']}>Sign Up</h1>
				<Formik
					initialValues={{ email: '', password: '' }}
					validationSchema={signUpSchema}
					onSubmit={(values, { resetForm }) => {
						const { email, password } = values;
						signUp({ user: { email, password } }).then(result => {
							let toast: ToastShowPayload;
							const closeTimeoutSeconds = 10;
							if (result.error) {
								toast = {
									closeTimeoutSeconds,
									message: result.error.message,
									type: ToastType.error
								};
							} else {
								toast = {
									closeTimeoutSeconds,
									message: 'Successfully signed up! Logging you in now...',
									type: ToastType.success
								};
								dispatch(fetchLoggedInEmail());
								router.replace('/');
							}

							dispatch(show(toast));
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
												onClick={() => setShowPassword(false)}
											/>
										) : (
											<EyeIcon
												className={logInClasses.eye}
												onClick={() => setShowPassword(true)}
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
								<PasswordValidator password={values.password} />
							</div>
							<BigButton disabled={isSubmitting} type={ButtonType.submit}>
								Sign Up
							</BigButton>
						</form>
					)}
				</Formik>
			</div>
		</main>
	);
};

export default SignUp;
