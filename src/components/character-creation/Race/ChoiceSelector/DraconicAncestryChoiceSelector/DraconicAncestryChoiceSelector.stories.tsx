import { ComponentMeta, ComponentStory } from '@storybook/react';

import DraconicAncestryChoiceSelector from './DraconicAncestryChoiceSelector';

export default {
	title: 'Components/ChoiceSelector/DraconicAncestryChoiceSelector',
	component: DraconicAncestryChoiceSelector,
	args: {
		choice: {
			choose: 2,
			from: {
				options: [
					{
						item: {
							index: 'foo',
							name: 'Draconic Ancestry (Foo)',
							trait_specific: {
								breath_weapon: {
									name: 'Acid Breath',
									desc: 'Acid breath.',
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
									name: 'Lightning Breath',
									desc: 'Lightning breath.',
									damage: [
										{
											damage_type: { index: 'lightning', name: 'Lightning' },
											damage_at_character_level: [{ damage: '2d6', level: 1 }]
										}
									],
									dc: { type: { index: 'dex', full_name: 'Dexterity' } }
								}
							}
						}
					},
					{
						item: {
							index: 'baz',
							name: 'Draconic Ancestry (Baz)',
							trait_specific: {
								breath_weapon: {
									name: 'Fire Breath',
									desc: 'Fire breath.',
									damage: [
										{
											damage_type: { index: 'fire', name: 'Fire' },
											damage_at_character_level: [{ damage: '2d6', level: 1 }]
										}
									],
									dc: { type: { index: 'con', full_name: 'Constitution' } }
								}
							}
						}
					}
				]
			}
		},
		label: 'Choose stuff'
	}
} as ComponentMeta<typeof DraconicAncestryChoiceSelector>;

const Template: ComponentStory<typeof DraconicAncestryChoiceSelector> =
	args => <DraconicAncestryChoiceSelector {...args} />;

export const Default = Template.bind({});
