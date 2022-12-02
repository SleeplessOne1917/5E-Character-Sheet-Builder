'use client';

import Button, { ButtonType } from '../../components/Button/Button';
import { Formik, FormikHelpers } from 'formik';
import { useCallback, useEffect, useState } from 'react';

import LoadingPageContent from '../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../components/MainContent/MainContent';
import TextInput from '../../components/TextInput/TextInput';
import { ToastType } from '../../types/toast';
import classes from './ResetPassword.module.css';
import resetPasswordSchema from '../../yup-schemas/resetPasswordSchema';
import { show } from '../../redux/features/toast';
import { trpc } from '../../common/trpcFrontend';
import { useAppDispatch } from '../../hooks/reduxHooks';
import useRedirectCountdown from '../../hooks/useRedirectCountdown';
import { useRouter } from 'next/navigation';

type ResetPasswordProps = {
	otlId: string;
};

type FormValues = {
	password: string;
	confirmPassword: string;
};

const ResetPassword = ({ otlId }: ResetPasswordProps) => {
	const [fetched, setFetched] = useState(false);
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [error, setError] = useState<string>();
	const resetPasswordMutation = trpc.password.resetPassword.useMutation();
	const validateResetMutation = trpc.password.validateReset.useMutation();
	const { secondsLeft, startCountdown } = useRedirectCountdown({
		path: '/',
		replace: true,
		seconds: 10
	});

	useEffect(() => {
		if (!fetched) {
			validateResetMutation
				.mutateAsync(otlId)
				.catch(e => {
					setError((e as Error).message);
				})
				.finally(() => {
					setFetched(true);
				});
		}
	}, [validateResetMutation, otlId, fetched]);

	useEffect(() => {
		if (error) {
			startCountdown();
		}
	}, [error, startCountdown]);

	const handleResetPasswordSubmit = useCallback(
		async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
			try {
				const result = await resetPasswordMutation.mutateAsync({
					...values,
					otlId
				});

				dispatch(
					show({
						closeTimeoutSeconds: 10,
						message: result,
						type: ToastType.success
					})
				);

				router.replace('/log-in');
			} catch (e) {
				const errorMessage = (e as Error).message;
				dispatch(
					show({
						closeTimeoutSeconds: 10,
						message: errorMessage,
						type: ToastType.error
					})
				);

				setError(errorMessage);
			} finally {
				resetForm();
			}
		},
		[resetPasswordMutation, dispatch, router, otlId]
	);

	let headerText: string;
	let content: JSX.Element;

	if (error) {
		headerText = 'Error';
		content = (
			<>
				<div className={classes['error-message']}>{error}</div>
				<p className={classes['countdown-message']}>
					You will be redirected back to the home page in{' '}
					<span className={classes.countdown}>
						{secondsLeft} second{secondsLeft === 1 ? '' : 's'}
					</span>
					.
				</p>
			</>
		);
	} else {
		headerText = 'Reset Password';
		content = (
			<Formik
				initialValues={{ password: '', confirmPassword: '' }}
				validationSchema={resetPasswordSchema.omit(['otlId'])}
				onSubmit={handleResetPasswordSubmit}
			>
				{({
					errors,
					touched,
					values,
					handleBlur,
					handleChange,
					handleSubmit,
					isSubmitting,
					setTouched
				}) => (
					<form onSubmit={handleSubmit} className={classes.form}>
						<TextInput
							id="password"
							label="New Password"
							onBlur={handleBlur}
							onChange={event => {
								setTouched({ ...touched, password: false });
								handleChange(event);
							}}
							value={values.password}
							error={errors.password}
							touched={touched.password}
							type="validate-password"
						/>
						<TextInput
							id="confirmPassword"
							label="Confirm Password"
							onBlur={handleBlur}
							onChange={event => {
								setTouched({ ...touched, confirmPassword: false });
								handleChange(event);
							}}
							value={values.confirmPassword}
							error={errors.confirmPassword}
							touched={touched.confirmPassword}
							type="password"
						/>
						<Button
							disabled={isSubmitting}
							type={ButtonType.submit}
							positive
							size="medium"
							spacing={4}
						>
							Reset password
						</Button>
					</form>
				)}
			</Formik>
		);
	}

	const isLoading = !fetched || validateResetMutation.isLoading;

	return (
		<>
			{isLoading && <LoadingPageContent />}
			{!isLoading && (
				<MainContent>
					<div className={classes.content}>
						<h1>{headerText}</h1>
						{content}
					</div>
				</MainContent>
			)}
		</>
	);
};

export default ResetPassword;
