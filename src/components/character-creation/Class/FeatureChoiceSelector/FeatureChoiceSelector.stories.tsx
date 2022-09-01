import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../redux/store';

import FeatureChoiceSelector from './FeatureChoiceSelector';

export default {
	title: 'Components/CharacterCreation/Class/FeatureChoiceSelector',
	component: FeatureChoiceSelector,
	args: {
		choose: 1,
		feature: {
			index: 'fighting-style',
			name: 'Fighting Style'
		},
		subfeatures: [
			{
				index: 'fighter-fighting-style-archery',
				name: 'Fighting Style: Archery',
				desc: [
					'You gain a +2 bonus to attack rolls you make with ranged weapons.'
				],
				prerequisites: []
			},
			{
				index: 'fighter-fighting-style-defense',
				name: 'Fighting Style: Defense',
				desc: ['While you are wearing armor, you gain a +1 bonus to AC.'],
				prerequisites: []
			},
			{
				index: 'fighter-fighting-style-dueling',
				name: 'Fighting Style: Dueling',
				desc: [
					'When you are wielding a melee weapon in one hand and no other weapons, you gain a +2 bonus to damage rolls with that weapon.'
				],
				prerequisites: []
			},
			{
				index: 'fighter-fighting-style-great-weapon-fighting',
				name: 'Fighting Style: Great Weapon Fighting',
				desc: [
					'When you roll a 1 or 2 on a damage die for an attack you make with a melee weapon that you are wielding with two hands, you can reroll the die and must use the new roll, even if the new roll is a 1 or a 2. The weapon must have the two-handed or versatile property for you to gain this benefit.'
				],
				prerequisites: []
			},
			{
				index: 'fighter-fighting-style-protection',
				name: 'Fighting Style: Protection',
				desc: [
					'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.'
				],
				prerequisites: []
			},
			{
				index: 'fighter-fighting-style-two-weapon-fighting',
				name: 'Fighting Style: Two-Weapon Fighting',
				desc: [
					'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.'
				],
				prerequisites: []
			}
		]
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof FeatureChoiceSelector>;

const Template: ComponentStory<typeof FeatureChoiceSelector> = args => (
	<FeatureChoiceSelector {...args} />
);

export const Default = Template.bind({});
