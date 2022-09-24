import { ComponentMeta, ComponentStory } from '@storybook/react';

import AbilityBonusSelector from './AbilityBonusSelector';
import { mockAbilities } from '../../Abilities/MockAbilitiesStore';

export default {
	title: 'Components/CharacterCreation/Class/AbilityBonusSelector',
	component: AbilityBonusSelector,
	args: {
		abilities: mockAbilities,
		values: [null, null]
	}
} as ComponentMeta<typeof AbilityBonusSelector>;

const Template: ComponentStory<typeof AbilityBonusSelector> = args => (
	<AbilityBonusSelector {...args} />
);

export const NoneSelected = Template.bind({});

export const OneSelected = Template.bind({});

OneSelected.args = {
	values: [null, 'dex']
};

export const TwoSelected = Template.bind({});

TwoSelected.args = {
	values: ['cha', 'int']
};

export const SameSelected = Template.bind({});

SameSelected.args = {
	values: ['str', 'str']
};
