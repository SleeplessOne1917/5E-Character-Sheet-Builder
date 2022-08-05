import { ComponentMeta, ComponentStory } from '@storybook/react';

import SrdItemChoiceSelector from './SrdItemChoiceSelector';

export default {
	title: 'Components/ChoiceSelector/SrdItemChoiceSelector',
	component: SrdItemChoiceSelector,
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
} as ComponentMeta<typeof SrdItemChoiceSelector>;

const Template: ComponentStory<typeof SrdItemChoiceSelector> = args => (
	<SrdItemChoiceSelector {...args} />
);

export const Default = Template.bind({});
