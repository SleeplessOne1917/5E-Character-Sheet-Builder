import nodemailer, { Transporter } from 'nodemailer';
import {
	renderForgotPassword,
	renderForgotUsername
} from './renderEmailService';

let transporter: Transporter | undefined;

const getTransporter = (): Transporter => {
	if (transporter) {
		return transporter;
	}

	transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.FROM_EMAIL,
			pass: process.env.EMAIL_PASSWORD
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	return transporter;
};

export const sendUsernameReminder = (email: string) => {
	getTransporter().sendMail({
		from: `"5E Character Sheet Builder No Reply" <${process.env.FROM_EMAIL}>`,
		to: email,
		subject: 'Username reminder',
		html: renderForgotUsername()
	});
};

export const sendResetPassword = (email: string) => {
	getTransporter().sendMail({
		from: `"5E Character Sheet Builder No Reply" <${process.env.FROM_EMAIL}>`,
		to: email,
		subject: 'Reset your password',
		html: renderForgotPassword()
	});
};
