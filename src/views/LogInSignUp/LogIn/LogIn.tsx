import Button, { ButtonType } from '../../../components/Button/Button';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { ToastShowPayload, show } from '../../../redux/features/toast';

import { Formik } from 'formik';
import { ToastType } from '../../../types/toast';
import commonClasses from '../../Views.module.css';
import logInClasses from '../LogInSignUp.module.css';
import logInSchema from '../../../yup-schemas/logInSchema';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useState } from 'react';

const LogIn = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const [showPassword, setShowPassword] = useState(false);

	return (
		<main className={commonClasses.main}>
			<div className={`${commonClasses.content} ${logInClasses.content}`}>
				<h1 className={logInClasses['big-text']}>Log In</h1>
				<Formik
					initialValues={{ email: '', password: '' }}
					validationSchema={logInSchema}
					onSubmit={(values, { resetForm }) => {
						const { email, password } = values;
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
								{touched.password && errors.password && (
									<div className={logInClasses.error}>{errors.password}</div>
								)}
							</div>
							<Button disabled={isSubmitting} type={ButtonType.submit}>
								Log In
							</Button>
						</form>
					)}
				</Formik>
			</div>
		</main>
	);
};

export default LogIn;
