import { ComponentMeta, ComponentStory } from '@storybook/react';

import SubclassSelector from './SubclassSelector';

export default {
	title: 'Components/CharacterCreation/Class/SubclassSelector',
	component: SubclassSelector,
	args: {
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
						level: 1,
						components: ['V', 'S'],
						casting_time: 'ACTION',
						concentration: false,
						desc: [
							'As you hold your hands with thumbs touching and fingers spread, a thin sheet of flames shoots forth from your outstretched fingertips. Each creature in a 15-foot cone must make a dexterity saving throw. A creature takes 3d6 fire damage on a failed save, or half as much damage on a successful one.',
							"The fire ignites any flammable objects in the area that aren't being worn or carried."
						],
						school: {
							index: 'evocation',
							name: 'Evocation'
						},
						damage: {
							damage_type: {
								index: 'fire',
								name: 'Fire'
							}
						},
						material: null,
						range: 'Self',
						ritual: false
					}
				},
				{
					prerequisites: [
						{
							level: 1
						}
					],
					spell: {
						level: 1,
						components: ['V'],
						casting_time: 'ACTION',
						concentration: false,
						desc: [
							"You speak a one-word command to a creature you can see within range. The target must succeed on a wisdom saving throw or follow the command on its next turn. The spell has no effect if the target is undead, if it doesn't understand your language, or if your command is directly harmful to it.",
							"Some typical commands and their effects follow. You might issue a command other than one described here. If you do so, the DM determines how the target behaves. If the target can't follow your command, the spell ends.",
							'***Approach.*** The target moves toward you by the shortest and most direct route, ending its turn if it moves within 5 feet of you.',
							'***Drop.*** The target drops whatever it is holding and then ends its turn.',
							'***Flee.*** The target spends its turn moving away from you by the fastest available means.',
							'***Grovel.*** The target falls prone and then ends its turn.',
							"***Halt.*** The target doesn't move and takes no actions. A flying creature stays aloft, provided that it is able to do so. If it must move to stay aloft, it flies the minimum distance needed to remain in the air."
						],
						school: {
							index: 'enchantment',
							name: 'Enchantment'
						},
						damage: null,
						material: null,
						range: '60 feet',
						ritual: false
					}
				},
				{
					prerequisites: [
						{
							level: 3
						}
					],
					spell: {
						level: 2,
						components: ['V'],
						casting_time: 'ACTION',
						concentration: false,
						desc: [
							'You can blind or deafen a foe. Choose one creature that you can see within range to make a constitution saving throw. If it fails, the target is either blinded or deafened (your choice) for the duration. At the end of each of its turns, the target can make a constitution saving throw. On a success, the spell ends.'
						],
						school: {
							index: 'necromancy',
							name: 'Necromancy'
						},
						damage: null,
						material: null,
						range: '30 feet',
						ritual: false
					}
				},
				{
					prerequisites: [
						{
							level: 3
						}
					],
					spell: {
						level: 2,
						components: ['V', 'S'],
						casting_time: 'ACTION',
						concentration: false,
						desc: [
							'You create three rays of fire and hurl them at targets within range. You can hurl them at one target or several.',
							'Make a ranged spell attack for each ray. On a hit, the target takes 2d6 fire damage.'
						],
						school: {
							index: 'evocation',
							name: 'Evocation'
						},
						damage: {
							damage_type: {
								index: 'fire',
								name: 'Fire'
							}
						},
						material: null,
						range: '120 feet',
						ritual: false
					}
				},
				{
					prerequisites: [
						{
							level: 5
						}
					],
					spell: {
						level: 3,
						components: ['V', 'S', 'M'],
						casting_time: 'ACTION',
						concentration: false,
						desc: [
							'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 20-foot-radius sphere centered on that point must make a dexterity saving throw. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.',
							"The fire spreads around corners. It ignites flammable objects in the area that aren't being worn or carried."
						],
						school: {
							index: 'evocation',
							name: 'Evocation'
						},
						damage: {
							damage_type: {
								index: 'fire',
								name: 'Fire'
							}
						},
						material: 'A tiny ball of bat guano and sulfur.',
						range: '150 feet',
						ritual: false
					}
				},
				{
					prerequisites: [
						{
							level: 5
						}
					],
					spell: {
						level: 3,
						components: ['V', 'S', 'M'],
						casting_time: 'ACTION',
						concentration: true,
						desc: [
							'You create a 20-foot-radius sphere of yellow, nauseating gas centered on a point within range. The cloud spreads around corners, and its area is heavily obscured. The cloud lingers in the air for the duration.',
							"Each creature that is completely within the cloud at the start of its turn must make a constitution saving throw against poison. On a failed save, the creature spends its action that turn retching and reeling. Creatures that don't need to breathe or are immune to poison automatically succeed on this saving throw.",
							'A moderate wind (at least 10 miles per hour) disperses the cloud after 4 rounds. A strong wind (at least 20 miles per hour) disperses it after 1 round.'
						],
						school: {
							index: 'conjuration',
							name: 'Conjuration'
						},
						damage: null,
						material: 'A rotten egg or several skunk cabbage leaves.',
						range: '90 feet',
						ritual: false
					}
				},
				{
					prerequisites: [
						{
							level: 7
						}
					],
					spell: {
						level: 4,
						components: ['V', 'S', 'M'],
						casting_time: 'ACTION',
						concentration: false,
						desc: [
							'Thin and vaporous flame surround your body for the duration of the spell, radiating a bright light bright light in a 10-foot radius and dim light for an additional 10 feet. You can end the spell using an action to make it disappear.',
							'The flames are around you a heat shield or cold, your choice. The heat shield gives you cold damage resistance and the cold resistance to fire damage.',
							'In addition, whenever a creature within 5 feet of you hits you with a melee attack, flames spring from the shield. The attacker then suffers 2d8 points of fire damage or cold, depending on the model.'
						],
						school: {
							index: 'evocation',
							name: 'Evocation'
						},
						damage: {
							damage_type: {
								index: 'fire',
								name: 'Fire'
							}
						},
						material: 'A little phosphorus or a firefly.',
						range: 'Self',
						ritual: false
					}
				},
				{
					prerequisites: [
						{
							level: 7
						}
					],
					spell: {
						level: 4,
						components: ['V', 'S', 'M'],
						casting_time: 'ACTION',
						concentration: true,
						desc: [
							'You create a wall of fire on a solid surface within range. You can make the wall up to 60 feet long, 20 feet high, and 1 foot thick, or a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.',
							'When the wall appears, each creature within its area must make a Dexterity saving throw. On a failed save, a creature takes 5d8 fire damage, or half as much damage on a successful save.',
							'One side of the wall, selected by you when you cast this spell, deals 5d8 fire damage to each creature that ends its turn within 10 feet o f that side or inside the wall. A creature takes the same damage when it enters the wall for the first time on a turn or ends its turn there. The other side of the wall deals no damage.',
							'The other side of the wall deals no damage.'
						],
						school: {
							index: 'evocation',
							name: 'Evocation'
						},
						damage: {
							damage_type: {
								index: 'fire',
								name: 'Fire'
							}
						},
						material: 'A small piece of phosphorus.',
						range: '120 feet',
						ritual: false
					}
				},
				{
					prerequisites: [
						{
							level: 9
						}
					],
					spell: {
						level: 5,
						components: ['V', 'S', 'M'],
						casting_time: 'ACTION',
						concentration: false,
						desc: [
							'A vertical column of divine fire roars down from the heavens in a location you specify. Each creature in a 10-foot-radius, 40-foot-high cylinder centered on a point within range must make a dexterity saving throw. A creature takes 4d6 fire damage and 4d6 radiant damage on a failed save, or half as much damage on a successful one.'
						],
						school: {
							index: 'evocation',
							name: 'Evocation'
						},
						damage: {
							damage_type: {
								index: 'fire',
								name: 'Fire'
							}
						},
						material: 'Pinch of sulfur.',
						range: '60 feet',
						ritual: false
					}
				},
				{
					prerequisites: [
						{
							level: 9
						}
					],
					spell: {
						level: 5,
						components: ['V', 'S', 'M'],
						casting_time: 'DAY',
						concentration: false,
						desc: [
							'You touch a point and infuse an area around it with holy (or unholy) power. The area can have a radius up to 60 feet, and the spell fails if the radius includes an area already under the effect a hallow spell. The affected area is subject to the following effects.',
							"First, celestials, elementals, fey, fiends, and undead can't enter the area, nor can such creatures charm, frighten, or possess creatures within it. Any creature charmed, frightened, or possessed by such a creature is no longer charmed, frightened, or possessed upon entering the area. You can exclude one or more of those types of creatures from this effect.",
							"Second, you can bind an extra effect to the area. Choose the effect from the following list, or choose an effect offered by the DM. Some of these effects apply to creatures in the area; you can designate whether the effect applies to all creatures, creatures that follow a specific deity or leader, or creatures of a specific sort, such as ores or trolls. When a creature that would be affected enters the spell's area for the first time on a turn or starts its turn there, it can make a charisma saving throw. On a success, the creature ignores the extra effect until it leaves the area.",
							"***Courage.*** Affected creatures can't be frightened while in the area.",
							"***Darkness.*** Darkness fills the area. Normal light, as well as magical light created by spells of a lower level than the slot you used to cast this spell, can't illuminate the area.",
							"***Daylight.*** Bright light fills the area. Magical darkness created by spells of a lower level than the slot you used to cast this spell can't extinguish the light.",
							'***Energy Protection.*** Affected creatures in the area have resistance to one damage type of your choice, except for bludgeoning, piercing, or slashing.',
							'***Energy Vulnerability.*** Affected creatures in the area have vulnerability to one damage type of your choice, except for bludgeoning, piercing, or slashing.',
							"***Everlasting Rest.*** Dead bodies interred in the area can't be turned into undead.",
							"***Extradimensional Interference.*** Affected creatures can't move or travel using teleportation or by extradimensional or interplanar means.",
							'***Fear.*** Affected creatures are frightened while in the area.',
							'***Silence.*** No sound can emanate from within the area, and no sound can reach into it.',
							"***Tongues.*** Affected creatures can communicate with any other creature in the area, even if they don't share a common language."
						],
						school: {
							index: 'evocation',
							name: 'Evocation'
						},
						damage: null,
						material:
							'Herbs, oils, and incense worth at least 1,000 gp, which the spell consumes.',
						range: 'Touch',
						ritual: false
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
