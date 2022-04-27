import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { ToastShowPayload, show } from '../../redux/features/toast';

import { Formik } from 'formik';
import SIGN_UP from '../../graphql/mutations/user/signUp';
import { ToastType } from '../../types/toast';
import classes from './SignUp.module.css';
import commonClasses from '../Views.module.css';
import signUpSchema from '../../yup-schemas/signUpSchema';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useState } from 'react';

const SignUp = () => {
	const dispatch = useAppDispatch();
	const [showPassword, setShowPassword] = useState(false);
	const [signUpResult, signUp] = useMutation(SIGN_UP);

	return (
		<main className={commonClasses.main}>
			<div className={`${commonClasses.content} ${classes.content}`}>
				<h1 className={classes['big-text']}>Sign Up</h1>
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
						<form onSubmit={handleSubmit} className={classes.form}>
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
											values.email.length > 0
												? ` ${classes['label-selected']}`
												: ''
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
												onClick={() => setShowPassword(false)}
											/>
										) : (
											<EyeIcon
												className={classes.eye}
												onClick={() => setShowPassword(true)}
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
								{touched.password && errors.password && (
									<div className={classes.error}>{errors.password}</div>
								)}
							</div>
							<button
								className={classes.submit}
								disabled={isSubmitting}
								type="submit"
							>
								Submit
							</button>
						</form>
					)}
				</Formik>
			</div>
		</main>
	);
};

export default SignUp;
