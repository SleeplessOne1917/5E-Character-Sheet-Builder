import { ComponentMeta, ComponentStory } from '@storybook/react';
import { AbilityScoresState } from '../../../../../redux/features/abilityScores';
import MockStore, { mockAbilities } from '../MockAbilitiesStore';
import StandardArray, { StandardArrayProps } from './StandardArray';

export default {
	title: 'Components/CharacterCreation/Abilities/StandardArray',
	component: StandardArray,
	args: {
		abilities: mockAbilities
	}
} as ComponentMeta<typeof StandardArray>;

const Template: ComponentStory<typeof StandardArray> = (
	args: StandardArrayProps
) => <StandardArray {...args} />;

const defaultOverride: AbilityScoresState = {
	str: { highest: 20, abilityImprovement: 0 },
	dex: { highest: 20, abilityImprovement: 0 },
	con: { highest: 20, abilityImprovement: 0 },
	int: { highest: 20, abilityImprovement: 0 },
	cha: { highest: 20, abilityImprovement: 0 },
	wis: { highest: 20, abilityImprovement: 0 }
};

export const NoneSelected = Template.bind({});
NoneSelected.decorators = [
	story => <MockStore overrideValues={defaultOverride}>{story()}</MockStore>
];

export const HalfSelected = Template.bind({});
HalfSelected.decorators = [
	story => (
		<MockStore
			overrideValues={{
				...defaultOverride,
				str: { base: 8, highest: 20, abilityImprovement: 0 },
				int: { base: 15, highest: 20, abilityImprovement: 0 },
				con: { base: 14, highest: 20, abilityImprovement: 0 }
			}}
		>
			{story()}
		</MockStore>
	)
];

export const AllSelected = Template.bind({});
AllSelected.decorators = [
	story => (
		<MockStore
			overrideValues={{
				str: { base: 8, highest: 20, abilityImprovement: 0 },
				dex: { base: 10, highest: 20, abilityImprovement: 0 },
				con: { base: 12, highest: 20, abilityImprovement: 0 },
				int: { base: 13, highest: 20, abilityImprovement: 0 },
				cha: { base: 14, highest: 20, abilityImprovement: 0 },
				wis: { base: 15, highest: 20, abilityImprovement: 0 }
			}}
		>
			{story()}
		</MockStore>
	)
];
