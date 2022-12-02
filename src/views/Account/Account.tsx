'use client';

import Button, { ButtonType } from '../../components/Button/Button';
import { Formik, FormikHelpers } from 'formik';

import MainContent from '../../components/MainContent/MainContent';
import TextInput from '../../components/TextInput/TextInput';
import { ToastType } from '../../types/toast';
import classes from './Account.module.css';
import newPasswordSchema from '../../yup-schemas/newPasswordSchema';
import { show } from '../../redux/features/toast';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { useCallback } from 'react';
import useCreateNewPasswordMutation from '../../hooks/urql/mutations/useCreateNewPasswordMutation';

type AccountProps = {
	username?: string;
};

type FormValues = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

const Account = ({ username }: AccountProps) => {
	const [_, createNewPassword] = useCreateNewPasswordMutation();
	const dispatch = useAppDispatch();

	const handleCreatePasswordSubmit = useCallback(
		async (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
			const result = await createNewPassword(values);

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
						closeTimeoutSeconds: 10,
						message: result.data?.createNewPassword ?? '',
						type: ToastType.success
					})
				);
			}

			resetForm();
		},
		[createNewPassword, dispatch]
	);

	return (
		<MainContent testId="account">
			<h1>Account</h1>
			<div className={classes['username-blurb']}>
				Your username is&nbsp;
				<span className={classes.username}>{username}</span>
			</div>
			<h2 className={classes['reset-text']}>Create New Password</h2>
			<Formik
				initialValues={{
					currentPassword: '',
					newPassword: '',
					confirmPassword: ''
				}}
				validationSchema={newPasswordSchema}
				onSubmit={handleCreatePasswordSubmit}
			>
				{({
					errors,
					touched,
					values,
					handleBlur,
					handleChange,
					handleSubmit,
					setTouched,
					isSubmitting
				}) => (
					<form onSubmit={handleSubmit} className={classes.form}>
						<TextInput
							id="currentPassword"
							label="Current Password"
							onBlur={handleBlur}
							onChange={event => {
								setTouched({ ...touched, currentPassword: false });
								handleChange(event);
							}}
							value={values.currentPassword}
							error={errors.currentPassword}
							touched={touched.currentPassword}
							type="password"
						/>
						<TextInput
							id="newPassword"
							label="New Password"
							onBlur={handleBlur}
							onChange={event => {
								setTouched({ ...touched, newPassword: false });
								handleChange(event);
							}}
							value={values.newPassword}
							error={errors.newPassword}
							touched={touched.newPassword}
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
						<div style={{ marginTop: '1rem' }}>
							<Button
								disabled={isSubmitting}
								type={ButtonType.submit}
								size="medium"
								positive
							>
								Create new password
							</Button>
						</div>
					</form>
				)}
			</Formik>
		</MainContent>
	);
};

export default Account;
