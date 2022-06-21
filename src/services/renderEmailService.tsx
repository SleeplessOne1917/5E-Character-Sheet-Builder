import ForgotUsernameOrPassword from '../emails/ForgotUsernameOrPassword';
import { renderEmail } from 'react-html-email';

export const renderForgotUsername = () =>
	renderEmail(
		<ForgotUsernameOrPassword subject="Username reminder" type="username" />
	);

export const renderForgotPassword = () =>
	renderEmail(
		<ForgotUsernameOrPassword subject="Reset your password" type="password" />
	);
