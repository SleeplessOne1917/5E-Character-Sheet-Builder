import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../redux/store';
import Race, { mockRaces, mockSubraces } from './Race';

export default {
	title: 'Views/Race',
	component: Race,
	args: {
		races: mockRaces,
		subraces: mockSubraces
	},
	decorators: [Story => <Provider store={getTestStore()}>{<Story />}</Provider>]
} as ComponentMeta<typeof Race>;

const Template: ComponentStory<typeof Race> = args => <Race {...args} />;

export const Default = Template.bind({});
