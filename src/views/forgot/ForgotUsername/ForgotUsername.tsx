import Button, { ButtonType } from '../../../components/Button/Button';

import { Formik } from 'formik';
import MainContent from '../../../components/MainContent/MainContent';
import { ToastType } from '../../../types/toast';
import classes from './ForgotUsername.module.css';
import forgotUsernameSchema from '../../../yup-schemas/forgotUsernameSchema';
import { show } from '../../../redux/features/toast';
import { useAppDispatch } from '../../../hooks/reduxHooks';

const ForgotUsername = () => {
	const dispatch = useAppDispatch();

	return (
		<MainContent testId="forgot-username">
			<div className={classes.content}>
				<h1 className={classes['big-text']}>Forgot username</h1>
				<p className={classes.blurb}>
					Enter your email address. If it&apos;s in the system, you&apos;ll
					receive an email with a link to view your username.
				</p>
				<Formik
					initialValues={{ email: '' }}
					validationSchema={forgotUsernameSchema}
					onSubmit={({}, { resetForm }) => {
						dispatch(
							show({
								closeTimeoutSeconds: 10,
								message: 'Email sent!',
								type: ToastType.success
							})
						);
						resetForm();
					}}
				>
					{({
						touched,
						errors,
						values,
						handleChange,
						handleBlur,
						handleSubmit,
						isSubmitting
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
											values.email && values.email.length > 0
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
							<Button
								disabled={isSubmitting}
								type={ButtonType.submit}
								positive
								size="medium"
								spacing={4}
							>
								Send username reminder
							</Button>
						</form>
					)}
				</Formik>
			</div>
		</MainContent>
	);
};

export default ForgotUsername;
