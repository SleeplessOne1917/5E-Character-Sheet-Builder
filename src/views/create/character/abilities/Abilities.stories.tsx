import { ComponentMeta, ComponentStory } from '@storybook/react';

import Abilities from './Abilities';
import { Provider } from 'react-redux';
import { ReactNode } from 'react';
import { getTestStore } from '../../../../redux/store';
import { mockAbilities } from '../../../../components/character-creation/Abilities/MockAbilitiesStore';

const MockStore = ({ children }: { children: ReactNode }) => (
	<Provider store={getTestStore()}>{children}</Provider>
);

export default {
	title: 'Views/Abilities',
	component: Abilities,
	args: {
		abilities: mockAbilities
	},
	decorators: [story => <MockStore>{story()}</MockStore>]
} as ComponentMeta<typeof Abilities>;

const Template: ComponentStory<typeof Abilities> = args => (
	<Abilities {...args} />
);

export const Default = Template.bind({});
