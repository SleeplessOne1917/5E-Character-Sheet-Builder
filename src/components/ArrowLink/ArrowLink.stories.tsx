import { ComponentMeta, ComponentStory } from '@storybook/react';

import ArrowLink from './ArrowLink';

export default {
	title: 'Components/ArrowLink',
	component: ArrowLink,
	args: {
		href: '/foo',
		text: 'Click Me!'
	}
} as ComponentMeta<typeof ArrowLink>;

const Template: ComponentStory<typeof ArrowLink> = args => (
	<ArrowLink {...args} />
);

export const Default = Template.bind({});
