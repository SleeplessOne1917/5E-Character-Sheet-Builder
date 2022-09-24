import { ComponentMeta, ComponentStory } from '@storybook/react';
import RollDisplay, { RollDisplayProps } from './RollDisplay';

import { mockAbilities } from '../../MockAbilitiesStore';

export default {
	title: 'Components/Create/Character/Abilities/Rolls/RollDisplay',
	component: RollDisplay,
	args: {
		abilities: mockAbilities
	},
	argTypes: {
		roll: { type: 'function' },
		onSelectAbility: { type: 'function' }
	}
} as ComponentMeta<typeof RollDisplay>;

const Template: ComponentStory<typeof RollDisplay> = (
	args: RollDisplayProps
) => <RollDisplay {...args} />;

export const ButtonShowing = Template.bind({});

export const RollNoAbilitySelected = Template.bind({});
RollNoAbilitySelected.args = {
	rolls: [6, 4, 1, 1],
	total: 11
};

export const RollWithAbilitySelected = Template.bind({});
RollWithAbilitySelected.args = {
	rolls: [6, 6, 6, 3],
	total: 18,
	ability: 'con'
};
