import Button, { ButtonType } from '../Button/Button';
import { Formik, FormikHelpers } from 'formik';

import Link from 'next/link';
import TextInput from '../TextInput/TextInput';
import classes from './LogInSignUpForm.module.css';

type LogInSignUpValues = {
	username: string;
	password: string;
	email?: string;
};

export type LogInSignUpProps = {
	onSubmit: (
		values: LogInSignUpValues,
		formikHelpers: FormikHelpers<LogInSignUpValues>
	) => void | Promise<any>;
	schema: any;
	type: 'logIn' | 'signUp';
};

const LogInSignUpForm = ({ type, schema, onSubmit }: LogInSignUpProps) => (
	<Formik
		initialValues={{ username: '', password: '' }}
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
			touched,
			setTouched
		}) => (
			<form onSubmit={handleSubmit} className={classes.form} data-testid="form">
				<TextInput
					touched={touched.username}
					error={errors.username}
					id="username"
					label="Username"
					onBlur={handleBlur}
					onChange={event => {
						setTouched({ ...touched, username: false });
						handleChange(event);
					}}
					value={values.username}
				/>
				<TextInput
					touched={touched.password}
					error={errors.password}
					id="password"
					label="Password"
					onBlur={handleBlur}
					onChange={event => {
						setTouched({ ...touched, password: false });
						handleChange(event);
					}}
					value={values.password}
					type={type === 'logIn' ? 'password' : 'validate-password'}
				/>
				{type === 'signUp' && (
					<>
						<TextInput
							touched={touched.email}
							error={errors.email}
							id="email"
							label={
								<>
									Email{' '}
									<span className={classes['optional-text']}>(optional)</span>
								</>
							}
							onBlur={handleBlur}
							onChange={event => {
								setTouched({ ...touched, email: false });
								handleChange(event);
							}}
							value={values?.email ?? ''}
						/>
						<p className={classes['email-blurb']}>
							Forgetful? Providing your email will allow you to request a
							password reset or a reminder of your username. It will be
							encrypted so your data will still be secure in the event of a data
							breach. If you don&apos;t provide an email, make sure to put extra
							points into INT to help you with your remember credentials checks!
						</p>
					</>
				)}
				<Button
					disabled={isSubmitting}
					type={ButtonType.submit}
					positive
					size="large"
					spacing={4}
				>
					{type === 'logIn' ? 'Log In' : 'Sign Up'}
				</Button>
				{type === 'logIn' && (
					<Link href="/forgot">
						<a className={classes['forgot-link']}>
							Forgot your username or password?
						</a>
					</Link>
				)}
			</form>
		)}
	</Formik>
);

export default LogInSignUpForm;
