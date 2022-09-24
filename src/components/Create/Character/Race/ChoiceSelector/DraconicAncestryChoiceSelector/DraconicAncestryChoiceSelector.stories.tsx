import { ComponentMeta, ComponentStory } from '@storybook/react';

import DraconicAncestryChoiceSelector from './DraconicAncestryChoiceSelector';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../../../redux/store';

export default {
	title:
		'Components/CharacterCreation/Race/ChoiceSelector/DraconicAncestryChoiceSelector',
	component: DraconicAncestryChoiceSelector,
	args: {
		choice: {
			choose: 1,
			from: {
				options: [
					{
						item: {
							index: 'foo',
							name: 'Draconic Ancestry (Foo)',
							trait_specific: {
								breath_weapon: {
									area_of_effect: {
										size: 30,
										type: 'LINE'
									},
									damage: [
										{
											damage_type: { index: 'acid', name: 'Acid' },
											damage_at_character_level: [{ damage: '2d6', level: 1 }]
										}
									],
									dc: { type: { index: 'str', full_name: 'Strength' } }
								}
							}
						}
					},
					{
						item: {
							index: 'bar',
							name: 'Draconic Ancestry (Bar)',
							trait_specific: {
								breath_weapon: {
									area_of_effect: {
										size: 15,
										type: 'CONE'
									},
									damage: [
										{
											damage_type: { index: 'cold', name: 'COLD' },
											damage_at_character_level: [{ damage: '2d6', level: 1 }]
										}
									],
									dc: { type: { index: 'dex', full_name: 'Dexterity' } }
								}
							}
						}
					}
				]
			}
		}
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof DraconicAncestryChoiceSelector>;

const Template: ComponentStory<typeof DraconicAncestryChoiceSelector> =
	args => <DraconicAncestryChoiceSelector {...args} />;

export const Default = Template.bind({});
