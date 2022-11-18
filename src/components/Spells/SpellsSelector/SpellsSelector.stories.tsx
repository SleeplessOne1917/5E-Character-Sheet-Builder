import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import SpellsSelector from './SpellsSelector';
import { getTestStore } from '../../../redux/store';

export default {
	title: 'Components/Spells/SpellsSelector',
	component: SpellsSelector,
	args: {
		choose: 5,
		spells: [
			{
				id: 'true-strike',
				name: 'True Strike',
				level: 0,
				components: ['S'],
				castingTime: '1 action',
				concentration: true,
				description:
					"You extend your hand and point a finger at a target in range. Your magic grants you a brief insight into the target's defenses. On your next turn, you gain advantage on your first attack roll against the target, provided that this spell hasn't ended.",
				school: {
					name: 'Divination',
					id: 'divination'
				},
				range: '30 feet',
				ritual: false,
				duration: '1 hour',
				classes: [{ id: 'wizard', name: 'Wizard' }]
			},
			{
				id: 'light',
				name: 'Light',
				level: 0,
				components: ['V', 'M'],
				castingTime: '1 action',
				concentration: false,
				description:
					'You touch one object that is no larger than 10 feet in any dimension. Until the spell ends, the object sheds bright light in a 20-foot radius and dim light for an additional 20 feet. The light can be colored as you like. Completely covering the object with something opaque blocks the light. The spell ends if you cast it again or dismiss it as an action.\n\nIf you target an object held or worn by a hostile creature, that creature must succeed on a dexterity saving throw to avoid the spell.',
				school: {
					name: 'Evocation',
					id: 'evocation'
				},
				material: 'A firefly or phosphorescent moss.',
				range: 'Touch',
				ritual: false,
				duration: '1 hour',
				classes: [{ id: 'wizard', name: 'Wizard' }]
			},
			{
				id: 'mending',
				name: 'Mending',
				level: 0,
				components: ['V', 'S', 'M'],
				castingTime: '1 minute',
				concentration: false,
				description:
					"This spell repairs a single break or tear in an object you touch, such as a broken key, a torn cloak, or a leaking wineskin. As long as the break or tear is no longer than 1 foot in any dimension, you mend it, leaving no trace of the former damage.\n\nThis spell can physically repair a magic item or construct, but the spell can't restore magic to such an object.",
				school: {
					name: 'Transmutation',
					id: 'transmutation'
				},
				material: 'Two lodestones.',
				range: 'Touch',
				ritual: false,
				duration: '1 hour',
				classes: [{ id: 'wizard', name: 'Wizard' }]
			},
			{
				id: 'message',
				name: 'Message',
				level: 0,
				components: ['V', 'S', 'M'],
				castingTime: '1 action',
				concentration: false,
				description:
					"You point your finger toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.\n\nYou can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence, 1 foot of stone, 1 inch of common metal, a thin sheet of lead, or 3 feet of wood blocks the spell. The spell doesn't have to follow a straight line and can travel freely around corners or through openings.",
				school: {
					name: 'Transmutation',
					id: 'transmutation'
				},
				material: 'A short piece of copper wire.',
				range: '120 feet',
				ritual: false,
				duration: '1 hour',
				classes: [{ id: 'wizard', name: 'Wizard' }]
			},
			{
				id: 'vicious-mockery',
				name: 'Vicious Mockery',
				level: 0,
				components: ['V'],
				castingTime: '1 action',
				concentration: false,
				description:
					"You unleash a string of insults laced with subtle enchantments at a creature you can see within range. If the target can hear you (though it need not understand you), it must succeed on a wisdom saving throw or take 1d4 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.\n\nThis spell's damage increases by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4).",
				school: {
					name: 'Enchantment',
					id: 'enchantment'
				},
				damageType: {
					name: 'Psychic',
					id: 'psychic'
				},
				range: '60 feet',
				ritual: false,
				duration: '1 hour',
				classes: [{ id: 'wizard', name: 'Wizard' }]
			},
			{
				id: 'minor-illusion',
				name: 'Minor Illusion',
				level: 0,
				components: ['S', 'M'],
				castingTime: '1 action',
				concentration: false,
				description:
					"You create a sound or an image of an object within range that lasts for the duration. The illusion also ends if you dismiss it as an action or cast this spell again.\n\nIf you create a sound, its volume can range from a whisper to a scream. It can be your voice, someone else's voice, a lion's roar, a beating of drums, or any other sound you choose. The sound continues unabated throughout the duration, or you can make discrete sounds at different times before the spell ends.\n\nIf you create an image of an object--such as a chair, muddy footprints, or a small chest--it must be no larger than a 5-foot cube. The image can't create sound, light, smell, or any other sensory effect. Physical interaction with the image reveals it to be an illusion, because things can pass through it.\n\nIf a creature uses its action to examine the sound or image, the creature can determine that it is an illusion with a successful Intelligence (Investigation) check against your spell save DC. If a creature discerns the illusion for what it is, the illusion becomes faint to the creature.",
				school: {
					name: 'Illusion',
					id: 'illusion'
				},
				material: 'A bit of fleece.',
				range: '30 feet',
				ritual: false,
				duration: '1 hour',
				classes: [{ id: 'wizard', name: 'Wizard' }]
			},
			{
				id: 'dancing-lights',
				name: 'Dancing Lights',
				level: 0,
				components: ['V', 'S', 'M'],
				castingTime: '1 action',
				concentration: true,
				description:
					"You create up to four torch-sized lights within range, making them appear as torches, lanterns, or glowing orbs that hover in the air for the duration. You can also combine the four lights into one glowing vaguely humanoid form of Medium size. Whichever form you choose, each light sheds dim light in a 10-foot radius.\n\nAs a bonus action on your turn, you can move the lights up to 60 feet to a new spot within range. A light must be within 20 feet of another light created by this spell, and a light winks out if it exceeds the spell's range.",
				school: {
					name: 'Evocation',
					id: 'evocation'
				},
				material: 'A bit of phosphorus or wychwood, or a glowworm.',
				range: '120 feet',
				ritual: false,
				duration: '1 hour',
				classes: [{ id: 'wizard', name: 'Wizard' }]
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
} as ComponentMeta<typeof SpellsSelector>;

const Template: ComponentStory<typeof SpellsSelector> = args => (
	<SpellsSelector {...args} />
);

export const Default = Template.bind({});
