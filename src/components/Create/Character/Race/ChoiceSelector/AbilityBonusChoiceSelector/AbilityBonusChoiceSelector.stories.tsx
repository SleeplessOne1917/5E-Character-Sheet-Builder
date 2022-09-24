import { ComponentMeta, ComponentStory } from '@storybook/react';

import AbilityBonusChoiceSelector from './AbilityBonusChoiceSelector';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../../../redux/store';

export default {
	title:
		'Components/CharacterCreation/Race/ChoiceSelector/AbilityBonusChoiceSelector',
	component: AbilityBonusChoiceSelector,
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof AbilityBonusChoiceSelector>;

const Template: ComponentStory<typeof AbilityBonusChoiceSelector> = args => (
	<AbilityBonusChoiceSelector {...args} />
);

export const SameBonus = Template.bind({});
SameBonus.args = {
	choice: {
		choose: 2,
		from: {
			options: [
				{
					bonus: 1,
					ability_score: {
						index: 'dex',
						full_name: 'Dexterity'
					}
				},
				{
					bonus: 1,
					ability_score: {
						index: 'str',
						full_name: 'Strength'
					}
				},
				{
					bonus: 1,
					ability_score: {
						index: 'wis',
						full_name: 'Wisdom'
					}
				},
				{
					bonus: 1,
					ability_score: {
						index: 'int',
						full_name: 'Intelligence'
					}
				}
			]
		}
	}
};

export const DifferentBonuses = Template.bind({});
DifferentBonuses.args = {
	choice: {
		choose: 2,
		from: {
			options: [
				{
					bonus: 1,
					ability_score: {
						index: 'dex',
						full_name: 'Dexterity'
					}
				},
				{
					bonus: 2,
					ability_score: {
						index: 'str',
						full_name: 'Strength'
					}
				},
				{
					bonus: 1,
					ability_score: {
						index: 'wis',
						full_name: 'Wisdom'
					}
				},
				{
					bonus: 2,
					ability_score: {
						index: 'int',
						full_name: 'Intelligence'
					}
				}
			]
		}
	}
};
