import { ComponentMeta, ComponentStory } from '@storybook/react';
import LogInSignUpForm, { LogInSignUpProps } from './LogInSignUpForm';

export default {
	title: 'Components/LogInSignUpForm',
	component: LogInSignUpForm,
	args: {
		schema: {}
	},
	argTypes: {
		onSubmit: { type: 'function' }
	}
} as ComponentMeta<typeof LogInSignUpForm>;

const Template: ComponentStory<typeof LogInSignUpForm> = (
	args: LogInSignUpProps
) => <LogInSignUpForm {...args} />;

export const LogIn = Template.bind({});
LogIn.args = {
	type: 'logIn'
};

export const SignUp = Template.bind({});
SignUp.args = {
	type: 'signUp'
};
