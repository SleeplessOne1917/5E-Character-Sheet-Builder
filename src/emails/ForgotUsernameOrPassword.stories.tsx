import { ComponentMeta, ComponentStory } from '@storybook/react';

import ForgotUsernameOrPassword from './ForgotUsernameOrPassword';

export default {
	title: 'Emails/ForgotUsernameOrPassword',
	component: ForgotUsernameOrPassword
} as ComponentMeta<typeof ForgotUsernameOrPassword>;

const Template: ComponentStory<typeof ForgotUsernameOrPassword> = args => (
	<ForgotUsernameOrPassword {...args} />
);

export const ForgotUsername = Template.bind({});
ForgotUsername.args = {
	subject: 'Username reminder',
	type: 'username'
};

export const ForgotPassword = Template.bind({});
ForgotPassword.args = {
	subject: 'Reset your password',
	type: 'password'
};
