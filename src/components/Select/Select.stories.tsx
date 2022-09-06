import { ComponentMeta, ComponentStory } from '@storybook/react';
import Select from './Select';

export default {
	title: 'Components/Select',
	component: Select,
	args: {
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
		],
		id: 'test'
	}
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = args => <Select {...args} />;

export const Default = Template.bind({});
