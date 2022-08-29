import { ComponentMeta, ComponentStory } from '@storybook/react';

import Checkbox from './Checkbox';

export default {
	title: 'Components/Checkbox',
	component: Checkbox
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = args => (
	<Checkbox {...args} />
);

export const Default = Template.bind({});

export const Checked = Template.bind({});
Checked.args = {
	checked: true
};

export const Alternate = Template.bind({});
Alternate.args = {
	checked: true,
	useAlternateStyle: true
};
