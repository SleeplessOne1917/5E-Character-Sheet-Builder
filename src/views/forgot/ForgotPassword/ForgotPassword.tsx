import Button, { ButtonType } from '../../../components/Button/Button';

import FORGOT_PASSWORD from '../../../graphql/mutations/user/forgotPassword';
import { Formik } from 'formik';
import MainContent from '../../../components/MainContent/MainContent';
import TextInput from '../../../components/TextInput/TextInput';
import { ToastType } from '../../../types/toast';
import classes from './ForgotPassword.module.css';
import forgotPasswordSchema from '../../../yup-schemas/forgotPasswordSchema';
import { show } from '../../../redux/features/toast';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';

type ForgotPasswordProps = {
	loading: boolean;
};

const ForgotPassword = ({ loading }: ForgotPasswordProps) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [_, forgotPassword] = useMutation(FORGOT_PASSWORD);

	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
				<MainContent testId="forgot-password">
					<div className={classes.content}>
						<h1>Reset your password</h1>
						<p className={classes.blurb}>
							Enter your username and email address. If they&apos;re in the
							system, you&apos;ll receive an email with a link to reset your
							password.
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
			)}
		</>
	);
};

export default ForgotPassword;
