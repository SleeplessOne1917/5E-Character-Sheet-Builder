import { ComponentMeta, ComponentStory } from '@storybook/react';
import Descriptor, { DescriptorProps } from './Descriptor';

export default {
	title: 'Components/Create/Character/Descriptor',
	component: Descriptor,
	argTypes: { toggleOpen: { type: 'function' } }
} as ComponentMeta<typeof Descriptor>;

const Template: ComponentStory<typeof Descriptor> = (args: DescriptorProps) => (
	<Descriptor {...args} />
);

export const OneParagraph = Template.bind({});
OneParagraph.args = {
	title: 'Bar',
	description: 'This is a paragraph.'
};

export const MultipleParagraphs = Template.bind({});
MultipleParagraphs.args = {
	title: 'Baz',
	description: ['This is a paragraph.', 'This is another paragraph.']
};
