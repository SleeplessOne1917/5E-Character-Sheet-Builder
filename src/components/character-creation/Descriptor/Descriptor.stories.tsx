import { ComponentMeta, ComponentStory } from '@storybook/react';
import Descriptor, { DescriptorProps } from './Descriptor';

export default {
	title: 'Components/Descriptor',
	component: Descriptor,
	argTypes: { toggleOpen: { type: 'function' } }
} as ComponentMeta<typeof Descriptor>;

const Template: ComponentStory<typeof Descriptor> = (args: DescriptorProps) => (
	<Descriptor {...args} />
);

export const Closed = Template.bind({});
Closed.args = {
	isOpen: false,
	title: 'Foo',
	description: 'text'
};

export const OneParagraph = Template.bind({});
OneParagraph.args = {
	isOpen: true,
	title: 'Bar',
	description: 'This is a paragraph.'
};

export const MultipleParagraphs = Template.bind({});
MultipleParagraphs.args = {
	isOpen: true,
	title: 'Baz',
	description: ['This is a paragraph.', 'This is another paragraph.']
};
