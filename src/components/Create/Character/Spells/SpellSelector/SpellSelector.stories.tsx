import { ComponentMeta, ComponentStory } from '@storybook/react';

import SpellSelector from './SpellSelector';

export default {
	title: 'Components/Create/Character/Spells/SpellSelector',
	component: SpellSelector,
	args: {
		item: {
			name: 'High Elf Cantrip',
			index: 'high-elf-cantrip'
		},
		spell: {
			id: 'ray-of-frost',
			name: 'Ray of Frost',
			level: 0,
			components: ['V', 'S'],
			castingTime: 'ACTION',
			concentration: false,
			description:
				"A frigid beam of blue-white light streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, it takes 1d8 cold damage, and its speed is reduced by 10 feet until the start of your next turn.\n\nThe spell's damage increases by 1d8 when you reach 5th level (2d8), 11th level (3d8), and 17th level (4d8).",
			school: {
				name: 'Evocation',
				id: 'evocation'
			},
			damageType: {
				name: 'Cold',
				id: 'cold'
			},
			range: '60 feet',
			ritual: false,
			duration: '1 hour',
			classes: [{ id: 'sorcerer', name: 'Sorcerer' }]
		},
		selectValues: ['blank']
	}
} as ComponentMeta<typeof SpellSelector>;

const Template: ComponentStory<typeof SpellSelector> = args => (
	<SpellSelector {...args} />
);

export const Default = Template.bind({});
