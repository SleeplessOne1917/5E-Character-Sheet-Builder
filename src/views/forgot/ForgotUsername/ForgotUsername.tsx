'use client';

import Button, { ButtonType } from '../../../components/Button/Button';
import { Formik, FormikHelpers } from 'formik';
import { useCallback, useEffect } from 'react';

import FORGOT_USERNAME from '../../../graphql/mutations/user/forgotUsername';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import TextInput from '../../../components/TextInput/TextInput';
import { ToastType } from '../../../types/toast';
import classes from './ForgotUsername.module.css';
import forgotUsernameSchema from '../../../yup-schemas/forgotUsernameSchema';
import { show } from '../../../redux/features/toast';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/navigation';

type ForgotUsernameProps = {
	username?: string;
};

type FormValues = {
	email: string;
};

const ForgotUsername = ({ username }: ForgotUsernameProps) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [_, forgotUsername] = useMutation(FORGOT_USERNAME);

	useEffect(() => {
		if (username) {
			router.replace('/');
		}
	}, [username, router]);

	const handleForgotUsernameSubmit = useCallback(
		async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
			const result = await forgotUsername({ request: values });

			if (result.error) {
				dispatch(
					show({
						closeTimeoutSeconds: 10,
						message: result.error.message,
						type: ToastType.error
					})
				);
			} else {
				dispatch(
					show({
						closeTimeoutSeconds: 15,
						message: result.data.forgotUsername.message,
						type: ToastType.success
					})
				);
				router.replace('/');
			}

			resetForm();
		},
		[forgotUsername, dispatch, router]
	);

	return (
		<>
			{username && <LoadingPageContent />}
			{!username && (
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
			)}
		</>
	);
};

export default ForgotUsername;
