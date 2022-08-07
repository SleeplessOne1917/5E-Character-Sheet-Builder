import { ComponentMeta, ComponentStory } from '@storybook/react';

import LanguageChoiceSelector from './LanguageChoiceSelector';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../../redux/store';

export default {
	title: 'Components/ChoiceSelector/LanguageChoiceSelector',
	component: LanguageChoiceSelector,
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
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof LanguageChoiceSelector>;

const Template: ComponentStory<typeof LanguageChoiceSelector> = args => (
	<LanguageChoiceSelector {...args} />
);

export const Default = Template.bind({});
