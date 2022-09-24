import { ComponentMeta, ComponentStory } from '@storybook/react';

import ProficiencyChoiceSelector from './ProficiencyChoiceSelector';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../../../redux/store';

export default {
	title:
		'Components/Create/Character/Race/ChoiceSelector/ProficiencyChoiceSelector',
	component: ProficiencyChoiceSelector,
	args: {
		choice: {
			choose: 2,
			from: {
				options: [
					{ item: { index: 'foo', name: 'Foo', type: 'ARTISANS_TOOLS' } },
					{ item: { index: 'bar', name: 'Bar', type: 'ARTISANS_TOOLS' } },
					{ item: { index: 'baz', name: 'Baz', type: 'ARTISANS_TOOLS' } }
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
} as ComponentMeta<typeof ProficiencyChoiceSelector>;

const Template: ComponentStory<typeof ProficiencyChoiceSelector> = args => (
	<ProficiencyChoiceSelector {...args} />
);

export const Default = Template.bind({});
