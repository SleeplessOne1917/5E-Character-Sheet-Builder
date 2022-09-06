import Button, { ButtonType } from '../../components/Button/Button';
import { useEffect, useState } from 'react';

import { Formik } from 'formik';
import MainContent from '../../components/MainContent/MainContent';
import RESET_PASSWORD from '../../graphql/mutations/user/resetPassword';
import TextInput from '../../components/TextInput/TextInput';
import { ToastType } from '../../types/toast';
import VALIDATE_RESET_PASSWORD from '../../graphql/mutations/user/validateResetPassword';
import classes from './ResetPassword.module.css';
import { cleanMessage } from '../../services/messageCleanerService';
import resetPasswordSchema from '../../yup-schemas/resetPasswordSchema';
import { show } from '../../redux/features/toast';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useMutation } from 'urql';
import useRedirectCountdown from '../../hooks/useRedirectCountdown';
import { useRouter } from 'next/router';
import LoadingPageContent from '../../components/LoadingPageContent/LoadingPageContent';

type ResetPasswordProps = {
	otlId: string;
	loggedInLoading: boolean;
};

const ResetPassword = ({ otlId, loggedInLoading }: ResetPasswordProps) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [{ error: validateError }, validateResetPassword] = useMutation(
		VALIDATE_RESET_PASSWORD
	);
	const [{ error: resetError }, resetPassword] = useMutation(RESET_PASSWORD);
	const { secondsLeft, startCountdown } = useRedirectCountdown({
		path: '/',
		replace: true,
		seconds: 10
	});

	useEffect(() => {
		validateResetPassword({ otlId }).then(() => {
			setLoading(false);
		});
	}, [validateResetPassword, setLoading, otlId]);

	useEffect(() => {
		if (validateError || resetError) {
			startCountdown();
		}
	}, [validateError, startCountdown, resetError, otlId]);

	let headerText = 'Loading...';
	let content;

	if (validateError || resetError) {
		headerText = 'Error';
		content = (
			<>
				<div className={classes['error-message']}>
					{cleanMessage(validateError?.message ?? resetError?.message ?? '')}
				</div>
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
				validationSchema={resetPasswordSchema}
				onSubmit={async (values, { resetForm }) => {
					const result = await resetPassword({ ...values, otlId });

					if (result.data) {
						dispatch(
							show({
								closeTimeoutSeconds: 10,
								message: result.data.resetPassword,
								type: ToastType.success
							})
						);

						resetForm();
						router.replace('/log-in');
					}
				}}
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

	return (
		<>
			{(loading || loggedInLoading) && <LoadingPageContent />}
			{!(loading || loggedInLoading) && (
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
