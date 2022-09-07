import { ComponentMeta, ComponentStory } from '@storybook/react';
import MultiSelect from './MultiSelect';

export default {
	title: 'Components/Select/MultiSelect',
	component: MultiSelect,
	args: {
		id: 'stuff',
		label: 'Stuff',
		options: [
			{ value: 'foo', label: 'Foo' },
			{ value: 'bar', label: 'Bar' },
			{ value: 'baz', label: 'Baz' }
		]
	}
} as ComponentMeta<typeof MultiSelect>;

const Template: ComponentStory<typeof MultiSelect> = args => (
	<MultiSelect {...args} />
);

export const Default = Template.bind({});

export const LotsOfOptions = Template.bind({});

LotsOfOptions.args = {
	options: [
		{ value: 'foo', label: 'Foo' },
		{ value: 'bar', label: 'Bar' },
		{ value: 'baz', label: 'Baz' },
		{ value: 'spam', label: 'Eggs' },
		{ value: 'barbarian', label: 'Barbarian' },
		{ value: 'druid', label: 'Druid' },
		{ value: 'bard', label: 'Bard' },
		{ value: 'fighter', label: 'Fighter' },
		{ value: 'wizard', label: 'Wizard' }
	]
};

export const Error = Template.bind({});

Error.args = {
	touched: true,
	error: 'Your values suck'
};
