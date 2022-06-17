import { ComponentMeta, ComponentStory } from '@storybook/react';
import LogInSignUpForm, { LogInSignUpProps } from './LogInSignUpForm';

import logInSchema from '../../yup-schemas/logInSchema';
import signUpSchema from '../../yup-schemas/signUpSchema';

export default {
	title: 'Components/LogInSignUpForm',
	component: LogInSignUpForm,
	argTypes: {
		onSubmit: { type: 'function' }
	}
} as ComponentMeta<typeof LogInSignUpForm>;

const Template: ComponentStory<typeof LogInSignUpForm> = (
	args: LogInSignUpProps
) => <LogInSignUpForm {...args} />;

export const LogIn = Template.bind({});
LogIn.args = {
	type: 'logIn',
	schema: logInSchema
};

export const SignUp = Template.bind({});
SignUp.args = {
	type: 'signUp',
	schema: signUpSchema
};
