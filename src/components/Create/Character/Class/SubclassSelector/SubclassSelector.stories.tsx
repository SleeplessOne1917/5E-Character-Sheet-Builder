import { ComponentMeta, ComponentStory } from '@storybook/react';

import SubclassSelector from './SubclassSelector';

export default {
	title: 'Components/Create/Character/Class/SubclassSelector',
	component: SubclassSelector,
	args: {
		klassName: 'Warlock',
		subclass: {
			index: 'fiend',
			name: 'Fiend',
			subclass_flavor: 'Otherworldly Patron',
			desc: [
				"You have made a pact with a fiend from the lower planes of existence, a being whose aims are evil, even if you strive against those aims. Such beings desire the corruption or destruction of all things, ultimately including you. Fiends powerful enough to forge a pact include demon lords such as Demogorgon, Orcus, Fraz'Urb-luu, and Baphomet; archdevils such as Asmodeus, Dispater, Mephistopheles, and Belial; pit fiends and balors that are especially mighty; and ultroloths and other lords of the yugoloths."
			],
			subclass_levels: [
				{
					level: 1,
					features: [
						{
							name: "Dark One's Blessing",
							index: 'dark-ones-blessing',
							desc: [
								'Starting at 1st level, when you reduce a hostile creature to 0 hit points, you gain temporary hit points equal to your Charisma modifier + your warlock level (minimum of 1).'
							]
						}
					]
				},
				{
					level: 6,
					features: [
						{
							name: "Dark One's Own Luck",
							index: 'dark-ones-own-luck',
							desc: [
								"Starting at 6th level, you can call on your patron to alter fate in your favor. When you make an ability check or a saving throw, you can use this feature to add a d10 to your roll. You can do so after seeing the initial roll but before any of the roll's effects occur.",
								"Once you use this feature, you can't use it again until you finish a short or long rest."
							]
						}
					]
				},
				{
					level: 10,
					features: [
						{
							name: 'Fiendish Resilience',
							index: 'fiendish-resilience',
							desc: [
								'Starting at 10th level, you can choose one damage type when you finish a short or long rest. You gain resistance to that damage type until you choose a different one with this feature. Damage from magical weapons or silver weapons ignores this resistance.'
							]
						}
					]
				},
				{
					level: 14,
					features: [
						{
							name: 'Hurl Through Hell',
							index: 'hurl-through-hell',
							desc: [
								'Starting at 14th level, when you hit a creature with an attack, you can use this feature to instantly transport the target through the lower planes. The creature disappears and hurtles through a nightmare landscape.',
								'At the end of your next turn, the target returns to the space it previously occupied, or the nearest unoccupied space. If the target is not a fiend, it takes 10d10 psychic damage as it reels from its horrific experience.',
								"Once you use this feature, you can't use it again until you finish a long rest."
							]
						}
					]
				}
			],
			spells: [
				{
					prerequisites: [
						{
							level: 1
						}
					],
					spell: {
						index: 'oo',
						name: 'Foo',
						level: 1,
						school: {
							index: 'evocation',
							name: 'Evocation'
						}
					}
				},
				{
					prerequisites: [
						{
							level: 1
						}
					],
					spell: {
						index: 'bar',
						name: 'Bar',
						level: 1,
						school: {
							index: 'enchantment',
							name: 'Enchantment'
						}
					}
				},
				{
					prerequisites: [
						{
							level: 3
						}
					],
					spell: {
						index: 'bad-touch',
						name: 'Bad Touch',
						level: 2,
						school: {
							index: 'necromancy',
							name: 'Necromancy'
						}
					}
				},
				{
					prerequisites: [
						{
							level: 3
						}
					],
					spell: {
						index: 'flare',
						name: 'Flare',
						level: 2,
						school: {
							index: 'evocation',
							name: 'Evocation'
						}
					}
				},
				{
					prerequisites: [
						{
							level: 5
						}
					],
					spell: {
						index: 'heals',
						name: 'Heals',
						level: 3,
						school: {
							index: 'evocation',
							name: 'Evocation'
						}
					}
				},
				{
					prerequisites: [
						{
							level: 5
						}
					],
					spell: {
						index: 'summon-joe',
						name: 'Summon Joe',
						level: 3,
						school: {
							index: 'conjuration',
							name: 'Conjuration'
						}
					}
				},
				{
					prerequisites: [
						{
							level: 7
						}
					],
					spell: {
						index: 'hyper-beam',
						name: 'Hyper Beam',
						level: 4,
						school: {
							index: 'evocation',
							name: 'Evocation'
						}
					}
				},
				{
					prerequisites: [
						{
							level: 7
						}
					],
					spell: {
						index: 'blast',
						name: 'Blast',
						level: 4,
						school: {
							index: 'evocation',
							name: 'Evocation'
						}
					}
				},
				{
					prerequisites: [
						{
							level: 9
						}
					],
					spell: {
						index: 'mass-heal',
						name: 'Mass  Heal',
						level: 5,
						school: {
							index: 'evocation',
							name: 'Evocation'
						}
					}
				},
				{
					prerequisites: [
						{
							level: 9
						}
					],
					spell: {
						index: 'mega-blast',
						name: 'Mega Blast',
						level: 5,
						school: {
							index: 'evocation',
							name: 'Evocation'
						}
					}
				}
			]
		}
	}
} as ComponentMeta<typeof SubclassSelector>;

const Template: ComponentStory<typeof SubclassSelector> = args => (
	<SubclassSelector {...args} />
);

export const Default = Template.bind({});

export const Selected = Template.bind({});

Selected.args = {
	selected: true
};
