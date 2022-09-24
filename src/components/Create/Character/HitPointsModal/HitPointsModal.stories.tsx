import { ComponentMeta, ComponentStory } from '@storybook/react';
import HitPointsModal from './HitPointsModal';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../redux/store';
import getMockEditingCharacter from '../../../../mock/editingCharacterMock';

export default {
	title: 'Components/CharacterCreation/HitPointsModal',
	component: HitPointsModal,
	args: {
		show: true
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof HitPointsModal>;

const Template: ComponentStory<typeof HitPointsModal> = args => (
	<HitPointsModal {...args} />
);

export const NoClassSelected = Template.bind({});

export const ClassSelected = Template.bind({});
ClassSelected.decorators = [
	Story => (
		<Provider
			store={getTestStore({
				editingCharacter: getMockEditingCharacter({
					hp: {
						levelHPBonuses: [1, 8, 6, 3, 5]
					},
					abilityScores: {
						con: {
							base: 14,
							raceBonus: 2
						}
					},
					classInfo: {
						level: 6,
						class: {
							hit_die: 8
						}
					}
				})
			})}
		>
			<Story />
		</Provider>
	)
];
