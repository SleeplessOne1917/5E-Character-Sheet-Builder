import { ComponentMeta, ComponentStory } from '@storybook/react';

import MarkdownTextArea from './MarkdownTextArea';

export default {
	title: 'Components/MarkdownTextArea',
	component: MarkdownTextArea,
	args: {
		id: 'description',
		label: 'Description'
	}
} as ComponentMeta<typeof MarkdownTextArea>;

const Template: ComponentStory<typeof MarkdownTextArea> = args => (
	<MarkdownTextArea {...args} />
);

export const Default = Template.bind({});

export const Error = Template.bind({});

Error.args = {
	error: 'This is an error',
	touched: true
};
