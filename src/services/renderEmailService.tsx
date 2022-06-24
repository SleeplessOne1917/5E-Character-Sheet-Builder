import ForgotUsernameOrPassword from '../emails/ForgotUsernameOrPassword';
import { renderEmail } from 'react-html-email';

export const renderForgotUsername = (link: string) =>
	renderEmail(
		<ForgotUsernameOrPassword
			subject="Username reminder"
			type="username"
			link={link}
		/>
	);

export const renderForgotPassword = (link: string) =>
	renderEmail(
		<ForgotUsernameOrPassword
			subject="Reset your password"
			type="password"
			link={link}
		/>
	);
