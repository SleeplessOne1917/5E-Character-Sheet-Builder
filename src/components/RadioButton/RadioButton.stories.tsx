import { ComponentMeta, ComponentStory } from '@storybook/react';

import RadioButton from './RadioButton';

export default {
	title: 'Components/RadioButton',
	component: RadioButton,
	args: {
		selected: 'bar',
		value: 'foo',
		labelText: 'Foo'
	}
} as ComponentMeta<typeof RadioButton>;

const Template: ComponentStory<typeof RadioButton> = args => (
	<RadioButton {...args} />
);

export const Default = Template.bind({});

export const Checked = Template.bind({});

Checked.args = {
	selected: 'foo'
};
