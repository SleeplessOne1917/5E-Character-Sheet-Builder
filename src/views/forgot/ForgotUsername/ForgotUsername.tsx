import Button, { ButtonType } from '../../../components/Button/Button';

import FORGOT_USERNAME from '../../../graphql/mutations/user/forgotUsername';
import { Formik } from 'formik';
import MainContent from '../../../components/MainContent/MainContent';
import TextInput from '../../../components/TextInput/TextInput';
import { ToastType } from '../../../types/toast';
import classes from './ForgotUsername.module.css';
import forgotUsernameSchema from '../../../yup-schemas/forgotUsernameSchema';
import { show } from '../../../redux/features/toast';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useMutation } from 'urql';
import { useRouter } from 'next/router';

const ForgotUsername = () => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const [_, forgotUsername] = useMutation(FORGOT_USERNAME);

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
					onSubmit={async (values, { resetForm }) => {
						const result = await forgotUsername({ request: values });

						if (result.error) {
							dispatch(
								show({
									closeTimeoutSeconds: 10,
									message: result.error.message,
									type: ToastType.error
								})
							);
							resetForm();
						} else {
							dispatch(
								show({
									closeTimeoutSeconds: 15,
									message: result.data.forgotUsername.message,
									type: ToastType.success
								})
							);
							resetForm();
							router.replace('/');
						}
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
