import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../../redux/store';
import ProficienciesSelector from './ProficienciesSelector';

export default {
	title: 'Components/CharacterCreation/Class/ProficienciesSelector',
	component: ProficienciesSelector,
	args: {
		proficienciesIndex: 0
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof ProficienciesSelector>;

const Template: ComponentStory<typeof ProficienciesSelector> = args => (
	<ProficienciesSelector {...args} />
);

export const Default = Template.bind({});
Default.args = {
	choice: {
		choose: 2,
		from: {
			options: [
				{
					item: {
						index: 'skills-acrobatics',
						name: 'Skill: Acrobatics',
						type: 'SKILLS'
					}
				},
				{
					item: {
						index: 'skills-athletics',
						name: 'Skill: Athletics',
						type: 'SKILLS'
					}
				},
				{
					item: {
						index: 'skills-history',
						name: 'Skill: History',
						type: 'SKILLS'
					}
				},
				{
					item: {
						index: 'skills-insight',
						name: 'Skill: Insight',
						type: 'SKILLS'
					}
				},
				{
					item: {
						index: 'skills-religion',
						name: 'Skill: Religion',
						type: 'SKILLS'
					}
				},
				{
					item: {
						index: 'skills-stealth',
						name: 'Skill: Stealth',
						type: 'SKILLS'
					}
				}
			]
		}
	}
};

export const WithTypes = Template.bind({});
WithTypes.args = {
	choice: {
		choose: 1,
		from: {
			options: [
				{
					choice: {
						choose: 1,
						from: {
							options: [
								{
									item: {
										index: 'alchemists-supplies',
										name: "Alchemist's Supplies",
										type: 'ARTISANS_TOOLS'
									}
								},
								{
									item: {
										index: 'brewers-supplies',
										name: "Brewer's Supplies",
										type: 'ARTISANS_TOOLS'
									}
								},
								{
									item: {
										index: 'calligraphers-supplies',
										name: "Calligrapher's Supplies",
										type: 'ARTISANS_TOOLS'
									}
								},
								{
									item: {
										index: 'carpenters-tools',
										name: "Carpenter's Tools",
										type: 'ARTISANS_TOOLS'
									}
								},
								{
									item: {
										index: 'cartographers-tools',
										name: "Cartographer's Tools",
										type: 'ARTISANS_TOOLS'
									}
								},
								{
									item: {
										index: 'cobblers-tools',
										name: "Cobbler's Tools",
										type: 'ARTISANS_TOOLS'
									}
								}
							]
						}
					}
				},
				{
					choice: {
						choose: 1,
						from: {
							options: [
								{
									item: {
										index: 'bagpipes',
										name: 'Bagpipes',
										type: 'MUSICAL_INSTRUMENTS'
									}
								},
								{
									item: {
										index: 'drum',
										name: 'Drum',
										type: 'MUSICAL_INSTRUMENTS'
									}
								},
								{
									item: {
										index: 'dulcimer',
										name: 'Dulcimer',
										type: 'MUSICAL_INSTRUMENTS'
									}
								},
								{
									item: {
										index: 'flute',
										name: 'Flute',
										type: 'MUSICAL_INSTRUMENTS'
									}
								},
								{
									item: {
										index: 'lute',
										name: 'Lute',
										type: 'MUSICAL_INSTRUMENTS'
									}
								},
								{
									item: {
										index: 'lyre',
										name: 'Lyre',
										type: 'MUSICAL_INSTRUMENTS'
									}
								}
							]
						}
					}
				}
			]
		}
	}
};
