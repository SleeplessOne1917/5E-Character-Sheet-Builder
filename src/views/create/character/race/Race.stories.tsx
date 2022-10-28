import { ComponentMeta, ComponentStory } from '@storybook/react';
import Race, { mockRaces, mockSubraces } from './Race';

import { graphql } from 'msw';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../redux/store';

export default {
	title: 'Views/Create/Character/Race',
	component: Race,
	args: {
		races: mockRaces,
		subraces: mockSubraces
	},
	decorators: [Story => <Provider store={getTestStore()}>{<Story />}</Provider>]
} as ComponentMeta<typeof Race>;

const Template: ComponentStory<typeof Race> = args => <Race {...args} />;

export const Default = Template.bind({});

Default.parameters = {
	msw: {
		handlers: [
			graphql.query('GetRace', (req, res, ctx) =>
				res(
					ctx.data({
						race: {
							ability_bonuses: [
								{
									ability_score: {
										index: 'con',
										full_name: 'Constitution'
									},
									bonus: 2
								}
							],
							ability_bonus_options: null,
							age: "Dwarves mature at the same rate as humans, but they're considered young until they reach the age of 50. On average, they live about 350 years.",
							alignment:
								'Most dwarves are lawful, believing firmly in the benefits of a well-ordered society. They tend toward good as well, with a strong sense of fair play and a belief that everyone deserves to share in the benefits of a just order.',
							index: 'dwarf',
							language_desc:
								'You can speak, read, and write Common and Dwarvish. Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak.',
							languages: [
								{
									index: 'common',
									name: 'Common'
								},
								{
									index: 'dwarvish',
									name: 'Dwarvish'
								}
							],
							language_options: null,
							name: 'Dwarf',
							size: 'MEDIUM',
							size_description:
								'Dwarves stand between 4 and 5 feet tall and average about 150 pounds. Your size is Medium.',
							speed: 25,
							traits: [
								{
									name: 'Darkvision',
									index: 'darkvision',
									desc: [
										'You have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You cannot discern color in darkness, only shades of gray.'
									],
									proficiencies: [],
									proficiency_choices: null,
									trait_specific: null
								},
								{
									name: 'Dwarven Combat Training',
									index: 'dwarven-combat-training',
									desc: [
										'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.'
									],
									proficiencies: [
										{
											index: 'battleaxes',
											name: 'Battleaxes',
											type: 'WEAPONS'
										},
										{
											index: 'handaxes',
											name: 'Handaxes',
											type: 'WEAPONS'
										},
										{
											index: 'light-hammers',
											name: 'Light hammers',
											type: 'WEAPONS'
										},
										{
											index: 'warhammers',
											name: 'Warhammers',
											type: 'WEAPONS'
										}
									],
									proficiency_choices: null,
									trait_specific: null
								},
								{
									name: 'Dwarven Resilience',
									index: 'dwarven-resilience',
									desc: [
										'You have advantage on saving throws against poison, and you have resistance against poison damage.'
									],
									proficiencies: [],
									proficiency_choices: null,
									trait_specific: null
								},
								{
									name: 'Stonecunning',
									index: 'stonecunning',
									desc: [
										'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.'
									],
									proficiencies: [],
									proficiency_choices: null,
									trait_specific: null
								},
								{
									name: 'Tool Proficiency',
									index: 'tool-proficiency',
									desc: [
										"You gain proficiency with the artisan's tools of your choice: smith's tools, brewer's supplies, or mason's tools."
									],
									proficiencies: [],
									proficiency_choices: {
										choose: 1,
										from: {
											options: [
												{
													item: {
														name: "Smith's Tools",
														index: 'smiths-tools',
														type: 'ARTISANS_TOOLS'
													}
												},
												{
													item: {
														name: "Brewer's Supplies",
														index: 'brewers-supplies',
														type: 'ARTISANS_TOOLS'
													}
												},
												{
													item: {
														name: "Mason's Tools",
														index: 'masons-tools',
														type: 'ARTISANS_TOOLS'
													}
												}
											]
										}
									},
									trait_specific: null
								}
							]
						}
					})
				)
			),
			graphql.query('GetSubrace', (req, res, ctx) =>
				res(
					ctx.data({
						subrace: {
							desc: 'As a hill dwarf, you have keen senses, deep intuition, and remarkable resilience.',
							index: 'hill-dwarf',
							name: 'Hill Dwarf',
							ability_bonuses: [
								{
									bonus: 1,
									ability_score: {
										index: 'wis',
										full_name: 'Wisdom'
									}
								}
							],
							racial_traits: [
								{
									name: 'Dwarven Toughness',
									index: 'dwarven-toughness',
									desc: [
										'Your hit point maximum increases by 1, and it increases by 1 every time you gain a level.'
									],
									proficiencies: [],
									proficiency_choices: null,
									language_options: null,
									trait_specific: null
								}
							]
						}
					})
				)
			)
		]
	}
};
