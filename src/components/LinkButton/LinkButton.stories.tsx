import { ComponentMeta, ComponentStory } from '@storybook/react';
import LinkButton, { LinkButtonProps } from './LinkButton';

const LinkButtonSb = {
	title: 'Components/LinkButton',
	component: LinkButton,
	args: {
		children: 'Link Text',
		href: 'foo/bar'
	}
} as ComponentMeta<typeof LinkButton>;

export default LinkButtonSb;

const Template: ComponentStory<typeof LinkButton> = (args: LinkButtonProps) => (
	<LinkButton {...args} />
);

export const Default = Template.bind({});

export const Untabbable = Template.bind({});
Untabbable.args = {
	tabIndex: -1
};
