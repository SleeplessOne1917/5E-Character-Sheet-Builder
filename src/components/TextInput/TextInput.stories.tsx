import { ComponentMeta, ComponentStory } from '@storybook/react';

import TextInput from './TextInput';

export default {
	title: 'Components/TextInput',
	component: TextInput,
	args: {
		label: 'Label',
		id: 'id'
	}
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = args => (
	<TextInput {...args} />
);

export const Default = Template.bind({});
Default.args = {
	value: ''
};

export const Password = Template.bind({});
Password.args = {
	type: 'password',
	label: 'Password',
	value: 'abcde'
};

export const ValidatePassword = Template.bind({});
ValidatePassword.args = {
	value: 'abcde',
	type: 'validate-password',
	label: 'Password'
};

export const WithError = Template.bind({});
WithError.args = {
	error: 'This is an error',
	touched: true,
	value: 'abcd1234'
};
