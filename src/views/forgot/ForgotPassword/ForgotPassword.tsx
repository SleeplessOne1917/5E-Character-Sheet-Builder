'use client';

import Button, { ButtonType } from '../../../components/Button/Button';
import { Formik, FormikHelpers } from 'formik';

import MainContent from '../../../components/MainContent/MainContent';
import TextInput from '../../../components/TextInput/TextInput';
import { ToastType } from '../../../types/toast';
import classes from './ForgotPassword.module.css';
import forgotPasswordSchema from '../../../yup-schemas/forgotPasswordSchema';
import { show } from '../../../redux/features/toast';
import { trpc } from '../../../common/trpc';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

type FormValues = {
	email: string;
	username: string;
};

const ForgotPassword = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const forgotPasswordMutation = trpc.forgot.password.useMutation();

	const handleForgotPasswordSubmit = useCallback(
		async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
			try {
				const result = await forgotPasswordMutation.mutateAsync(values);

				dispatch(
					show({
						closeTimeoutSeconds: 15,
						message: result,
						type: ToastType.success
					})
				);
				router.replace('/');
			} catch (e) {
				dispatch(
					show({
						closeTimeoutSeconds: 10,
						message: (e as Error).message,
						type: ToastType.error
					})
				);
			} finally {
				resetForm();
			}
		},
		[forgotPasswordMutation, dispatch, router]
	);

	return (
		<MainContent testId="forgot-password">
			<div className={classes.content}>
				<h1>Reset your password</h1>
				<p className={classes.blurb}>
					Enter your username and email address. If they&apos;re in the system,
					you&apos;ll receive an email with a link to reset your password.
				</p>
				<Formik
					initialValues={{ email: '', username: '' }}
					validationSchema={forgotPasswordSchema}
					onSubmit={handleForgotPasswordSubmit}
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
							<TextInput
								id="username"
								label="Username"
								onBlur={handleBlur}
								onChange={event => {
									setTouched({ ...touched, username: false });
									handleChange(event);
								}}
								value={values.username}
								error={errors.username}
								touched={touched.username}
							/>
							<TextInput
								id="email"
								label="Email"
								onBlur={handleBlur}
								onChange={event => {
									setTouched({ ...touched, email: false });
									handleChange(event);
								}}
								value={values.email}
								error={errors.email}
								touched={touched.email}
							/>
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
