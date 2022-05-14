import { ComponentMeta, ComponentStory } from '@storybook/react';
import PasswordValidator, { PasswordValidatorProps } from './PasswordValidator';

const PasswordValidatorSb = {
	title: 'Components/PasswordValidator',
	component: PasswordValidator
} as ComponentMeta<typeof PasswordValidator>;

export default PasswordValidatorSb;

const Template: ComponentStory<typeof PasswordValidator> = (
	args: PasswordValidatorProps
) => <PasswordValidator {...args} />;

export const NoPassword = Template.bind({});

export const EmptyPassword = Template.bind({});
EmptyPassword.args = {
	password: ''
};

export const LowercaseLetterPassword = Template.bind({});
LowercaseLetterPassword.args = {
	password: 'abcde'
};

export const UppercaseLetterPassword = Template.bind({});
UppercaseLetterPassword.args = {
	password: 'ABCDE'
};

export const MinLengthPassword = Template.bind({});
MinLengthPassword.args = {
	password: 'abcd1234'
};

export const NumberPassword = Template.bind({});
NumberPassword.args = {
	password: '12345'
};

export const SpecialCharPassword = Template.bind({});
SpecialCharPassword.args = {
	password: '!@#$%'
};

export const ValidPassword = Template.bind({});
ValidPassword.args = {
	password: 'aaaaBBBB1122@$'
};
