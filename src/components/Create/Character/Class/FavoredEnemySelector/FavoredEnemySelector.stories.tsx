import { ComponentMeta, ComponentStory } from '@storybook/react';

import FavoredEnemySelector from './FavoredEnemySelector';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../../redux/store';

export default {
	title: 'Components/CharacterCreation/Class/FavoredEnemySelector',
	component: FavoredEnemySelector,
	args: {
		values: ['ABERRATION'],
		monsters: {
			monsters: [
				'ABERRATION',
				'BEAST',
				'CELESTIAL',
				'CONSTRUCT',
				'DRAGON',
				'ELEMENTAL',
				'FEY',
				'FIEND',
				'GIANT',
				'HUMANOID',
				'MONSTROSITY',
				'OOZE',
				'PLANT',
				'UNDEAD'
			],
			humanoids: [
				'DWARF',
				'ELF',
				'GNOLL',
				'GNOME',
				'GOBLINOID',
				'HUMAN',
				'KOBOLD',
				'LIZARDFOLK',
				'MERFOLK',
				'ORC',
				'SAHUAGIN'
			]
		}
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof FavoredEnemySelector>;

const Template: ComponentStory<typeof FavoredEnemySelector> = args => (
	<FavoredEnemySelector {...args} />
);

export const Default = Template.bind({});

export const Humanoid = Template.bind({});

Humanoid.args = {
	values: ['DWARF', 'ELF']
};
