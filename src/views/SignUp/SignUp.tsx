import { FormEvent, FormEventHandler, useState } from 'react';
import { object, string } from 'yup';

import classes from './SignUp.module.css';
import commonClasses from '../Views.module.css';

const signUpSchema = object({
	email: string().email('Incorrect format').required('Email is required'),
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
			'Password must have at least 1 special character',
			function (value) {
				return (
					!!value && /[ !"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{}|~]/.test(value)
				);
			}
		)
});

const SignUp = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const submitForm: FormEventHandler<HTMLFormElement> = (event: FormEvent) => {
		event.preventDefault();

		console.log(`Email: ${email}`);
		console.log(`Password: ${password}`);
	};

	return (
		<main className={commonClasses.main}>
			<div className={`${commonClasses.content} ${classes.content}`}>
				<h1 className={classes['big-text']}>Sign Up</h1>
				<form onSubmit={submitForm} className={classes.form}>
					<div className={classes['input-and-label-container']}>
						<div className={classes['input-container']}>
							<input
								className={classes.input}
								id="email"
								name="email"
								type="text"
								value={email}
								placeholder="Email"
								onChange={event => setEmail(event.target.value)}
							/>
						</div>
						<label
							htmlFor="email"
							className={`${classes.label}${
								email.length > 0 ? ` ${classes['label-selected']}` : ''
							}`}
						>
							Email
						</label>
					</div>
					<div className={classes['input-and-label-container']}>
						<div className={classes['input-container']}>
							<input
								className={classes.input}
								id="password"
								name="password"
								type="password"
								value={password}
								placeholder="Password"
								onChange={event => setPassword(event.target.value)}
							/>
						</div>
						<label
							htmlFor="password"
							className={`${classes.label}${
								password.length > 0 ? ` ${classes['label-selected']}` : ''
							}`}
						>
							Password
						</label>
					</div>
					<button className={classes.submit}>Submit</button>
				</form>
			</div>
		</main>
	);
};

export default SignUp;
