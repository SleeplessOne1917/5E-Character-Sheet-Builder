import { ComponentMeta, ComponentStory } from '@storybook/react';
import Race, { mockRaces, mockSubraces } from './Race';

export default {
	title: 'Views/Race',
	component: Race,
	args: {
		races: mockRaces,
		subraces: mockSubraces
	}
} as ComponentMeta<typeof Race>;

const Template: ComponentStory<typeof Race> = args => <Race {...args} />;

export const Default = Template.bind({});
