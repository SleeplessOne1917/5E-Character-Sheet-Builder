import { ComponentMeta, ComponentStory } from '@storybook/react';
import Select from './Select';

export default {
	title: 'Components/Select/Select',
	component: Select,
	args: {
		label: 'Stuff',
		id: 'stuff',
		options: [
			{
				value: 'foo',
				label: 'Foo'
			},
			{
				value: 'bar',
				label: 'Bar'
			},
			{
				value: 'baz',
				label: 'Baz'
			},
			{
				value: 'qux',
				label: 'Qux'
			}
		]
	}
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = args => <Select {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});

Error.args = {
	touched: true,
	error: 'Your value sucks'
};
