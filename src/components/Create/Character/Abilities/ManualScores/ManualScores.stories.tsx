import { ComponentMeta, ComponentStory } from '@storybook/react';
import ManualScores, { ManualScoresProps } from './ManualScores';
import MockStore, { mockAbilities } from '../MockAbilitiesStore';

export default {
	title: 'Components/CharacterCreation/Abilities/ManualScores',
	component: ManualScores,
	args: {
		abilities: mockAbilities
	}
} as ComponentMeta<typeof ManualScores>;

export const Default: ComponentStory<typeof ManualScores> = (
	args: ManualScoresProps
) => <ManualScores {...args} />;
Default.decorators = [story => <MockStore>{story()}</MockStore>];
