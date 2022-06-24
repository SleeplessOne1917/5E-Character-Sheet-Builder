import Button, { ButtonType } from '../../../components/Button/Button';

import FORGOT_PASSWORD from '../../../graphql/mutations/user/forgotPassword';
import { Formik } from 'formik';
import MainContent from '../../../components/MainContent/MainContent';
import { ToastType } from '../../../types/toast';
import classes from './ForgotPassword.module.css';
import forgotPasswordSchema from '../../../yup-schemas/forgotPasswordSchema';
import { show } from '../../../redux/features/toast';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [forgotPasswordResult, forgotPassword] = useMutation(FORGOT_PASSWORD);

	return (
		<MainContent testId="forgot-password">
			<div className={classes.content}>
				<h1 className={classes['big-text']}>Reset your password</h1>
				<p className={classes.blurb}>
					Enter your username and email address. If they&apos;re in the system,
					you&apos;ll receive an email with a link to reset your password.
				</p>
				<Formik
					initialValues={{ email: '', username: '' }}
					validationSchema={forgotPasswordSchema}
					onSubmit={async (values, { resetForm }) => {
						const result = await forgotPassword({ request: values });

						if (result.error) {
							dispatch(
								show({
									closeTimeoutSeconds: 10,
									message: result.error.message,
									type: ToastType.error
								})
							);
							resetForm();
						}
						dispatch(
							show({
								closeTimeoutSeconds: 15,
								message: result.data.forgotPassword.message,
								type: ToastType.success
							})
						);
						resetForm();
						router.replace('/');
					}}
				>
					{({
						touched,
						errors,
						values,
						handleChange,
						handleBlur,
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
												touched.username && errors.username
													? ` ${classes['input-error']}`
													: ''
											}`}
											id="username"
											name="username"
											type="text"
											value={values.username}
											placeholder="Username"
											onChange={event => {
												setTouched({ ...touched, username: false });
												handleChange(event);
											}}
											onBlur={handleBlur}
										/>{' '}
									</div>
									<label
										htmlFor="username"
										className={`${classes.label}${
											values.username && values.username.length > 0
												? ` ${classes['label-selected']}`
												: ''
										}`}
									>
										Username
									</label>
								</div>
								{touched.username && errors.username && (
									<div className={classes.error}>{errors.username}</div>
								)}
							</div>
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
											onChange={event => {
												setTouched({ ...touched, email: false });
												handleChange(event);
											}}
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
								Send reset password link
							</Button>
						</form>
					)}
				</Formik>
			</div>
		</MainContent>
	);
};

export default ForgotPassword;
