import { ComponentMeta, ComponentStory } from '@storybook/react';

import ChoiceSelector from './ChoiceSelector';

export default {
	title: 'Components/ChoiceSelector',
	component: ChoiceSelector,
	args: {
		choice: {
			choose: 2,
			from: {
				options: [
					{ item: { index: 'foo', name: 'Foo' } },
					{ item: { index: 'bar', name: 'Bar' } },
					{ item: { index: 'baz', name: 'Baz' } }
				]
			}
		},
		label: 'Choose stuff'
	}
} as ComponentMeta<typeof ChoiceSelector>;

const Template: ComponentStory<typeof ChoiceSelector> = args => (
	<ChoiceSelector {...args} />
);

export const Default = Template.bind({});
