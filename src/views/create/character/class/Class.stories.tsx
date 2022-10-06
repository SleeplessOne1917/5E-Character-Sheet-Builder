import Class, { mockClasses } from './Class';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import { getTestStore } from '../../../../redux/store';
import { mockAbilities } from '../../../../components/Create/Character/Abilities/MockAbilitiesStore';

export default {
	title: 'Views/Create/Character/Class',
	component: Class,
	args: {
		classes: mockClasses,
		abilities: mockAbilities
	},
	decorators: [Story => <Provider store={getTestStore()}>{<Story />}</Provider>]
} as ComponentMeta<typeof Class>;

const Template: ComponentStory<typeof Class> = args => <Class {...args} />;

export const Default = Template.bind({});
