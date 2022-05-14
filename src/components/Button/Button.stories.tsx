import Button, { ButtonProps, ButtonType } from './Button';
import { ComponentMeta, ComponentStory } from '@storybook/react';

const ButtonSb = {
	title: 'Components/Button',
	component: Button,
	args: {
		children: 'Button Text'
	},
	argTypes: {
		positive: { type: 'boolean' },
		disabled: { type: 'boolean' },
		spacing: { type: 'number' }
	}
} as ComponentMeta<typeof Button>;

export default ButtonSb;

const Template: ComponentStory<typeof Button> = (args: ButtonProps) => (
	<Button {...args} />
);

export const Default = Template.bind({});
Default.args = {
	size: 'medium'
};

export const Positive = Template.bind({});
Positive.args = {
	size: 'medium',
	positive: true
};

export const Small = Template.bind({});
Small.args = {
	size: 'small'
};

export const Large = Template.bind({});
Large.args = {
	size: 'large'
};

export const Submit = Template.bind({});
Submit.args = {
	size: 'large',
	positive: true,
	type: ButtonType.submit
};

export const Disabled = Template.bind({});
Disabled.args = {
	size: 'medium',
	disabled: true
};
