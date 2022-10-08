import Button, { ButtonType } from '../../components/Button/Button';
import {
	accessTokenKey,
	refreshTokenKey,
	tokenExpired
} from '../../constants/generalConstants';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';

import CREATE_NEW_PASSWORD from '../../graphql/mutations/user/createNewPassword';
import { Formik } from 'formik';
import GET_TOKEN from '../../graphql/mutations/user/token';
import LoadingPageContent from '../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../components/MainContent/MainContent';
import TextInput from '../../components/TextInput/TextInput';
import { ToastType } from '../../types/toast';
import classes from './Account.module.css';
import newPasswordSchema from '../../yup-schemas/newPasswordSchema';
import { show } from '../../redux/features/toast';
import useLogout from '../../hooks/useLogout';
import { useMutation } from 'urql';

type AccountProps = {
	loading: boolean;
};

const Account = ({ loading }: AccountProps) => {
	const username = useAppSelector(state => state.viewer);
	const [_, createNewPassword] =
		useMutation<{ createNewPassword: string }>(CREATE_NEW_PASSWORD);
	const [__, getToken] = useMutation<{ token: string }>(GET_TOKEN);
	const logout = useLogout();
	const dispatch = useAppDispatch();

	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
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
						onSubmit={async (values, { resetForm }) => {
							const result = await createNewPassword(values);

							if (result.error) {
								if (result.error.message === tokenExpired) {
									const refreshToken = localStorage.getItem(refreshTokenKey);
									const tokenResult = await getToken({ refreshToken });
									if (tokenResult.error || !tokenResult.data) {
										logout();
										return;
									}
									localStorage.setItem(
										accessTokenKey,
										tokenResult.data?.token ?? ''
									);

									const result2 = await createNewPassword(values);

									if (result2.error) {
										dispatch(
											show({
												closeTimeoutSeconds: 10,
												message: result2.error.message,
												type: ToastType.error
											})
										);
									} else {
										dispatch(
											show({
												closeTimeoutSeconds: 10,
												message: result2.data?.createNewPassword ?? '',
												type: ToastType.success
											})
										);
									}
								} else {
									dispatch(
										show({
											closeTimeoutSeconds: 10,
											message: result.error.message,
											type: ToastType.error
										})
									);
								}
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
						}}
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
			)}
		</>
	);
};

export default Account;
