import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { object, string } from 'yup';

import { Formik } from 'formik';
import classes from './SignUp.module.css';
import commonClasses from '../Views.module.css';
import { useState } from 'react';

const signUpSchema = object({
	email: string()
		.email('Enter your email in the format: yourname@example.com')
		.required('Email is required'),
	password: string()
		.min(8, 'Password must be at least 8 characters long')
		.required('Password is required')
		.test(
			'contains-lowercase',
			'Password must have at least 1 lowercase character',
			function (value) {
				return !!value && /[a-z]/.test(value);
			}
		)
		.test(
			'contains-uppercase',
			'Password must have at least 1 uppercase character',
			function (value) {
				return !!value && /[A-Z]/.test(value);
			}
		)
		.test(
			'contains-number',
			'Password must have at least 1 number',
			function (value) {
				return !!value && /\d/.test(value);
			}
		)
		.test(
			'contains-special-character',
			'Password must contain one of the following characters:  !"#$%&\'()*+,-./:;<=>?@[\\]^_`{}|~',
			function (value) {
				return (
					!!value && /[ !"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{}|~]/.test(value)
				);
			}
		)
});

const SignUp = () => {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<main className={commonClasses.main}>
			<div className={`${commonClasses.content} ${classes.content}`}>
				<h1 className={classes['big-text']}>Sign Up</h1>
				<Formik
					initialValues={{ email: '', password: '' }}
					validationSchema={signUpSchema}
					onSubmit={values => {
						console.log(`Email: ${values.email}`);
						console.log(`Password: ${values.password}`);
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
							<button className={classes.submit} disabled={!isSubmitting}>
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
