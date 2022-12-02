'use client';

import Button, { ButtonType } from '../../../components/Button/Button';
import { Formik, FormikHelpers } from 'formik';

import MainContent from '../../../components/MainContent/MainContent';
import TextInput from '../../../components/TextInput/TextInput';
import { ToastType } from '../../../types/toast';
import classes from './ForgotUsername.module.css';
import forgotUsernameSchema from '../../../yup-schemas/forgotUsernameSchema';
import { show } from '../../../redux/features/toast';
import { trpc } from '../../../common/trpcNext';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

type FormValues = {
	email: string;
};

const ForgotUsername = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const forgotUsernameMutation = trpc.forgot.username.useMutation();

	const handleForgotUsernameSubmit = useCallback(
		async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
			try {
				const result = await forgotUsernameMutation.mutateAsync(values);

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
		[forgotUsernameMutation, dispatch, router]
	);

	return (
		<MainContent testId="forgot-username">
			<div className={classes.content}>
				<h1>Forgot username</h1>
				<p className={classes.blurb}>
					Enter your email address. If it&apos;s in the system, you&apos;ll
					receive an email with a link to view your username.
				</p>
				<Formik
					initialValues={{ email: '' }}
					validationSchema={forgotUsernameSchema}
					onSubmit={handleForgotUsernameSubmit}
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
