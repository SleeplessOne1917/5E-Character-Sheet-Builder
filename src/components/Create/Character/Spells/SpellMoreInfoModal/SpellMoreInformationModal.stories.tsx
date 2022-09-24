import { ComponentMeta, ComponentStory } from '@storybook/react';
import SpellMoreInformationModal from './SpellMoreInformationModal';

export default {
	title: 'Components/Create/Character/Spells/SpellMoreInformationModal',
	component: SpellMoreInformationModal,
	args: {
		show: true,
		spell: {
			casting_time: '1 action',
			components: ['V', 'S', 'M'],
			concentration: true,
			desc: [
				"You project a phantasmal image of a creature's worst fears. Each creature in a 30-foot cone must succeed on a wisdom saving throw or drop whatever it is holding and become frightened for the duration.",
				"While frightened by this spell, a creature must take the Dash action and move away from you by the safest available route on each of its turns, unless there is nowhere to move. If the creature ends its turn in a location where it doesn't have line of sight to you, the creature can make a wisdom saving throw. On a successful save, the spell ends for that creature."
			],
			index: 'fear',
			level: 3,
			material: 'A white feather or the heart of a hen.',
			name: 'Fear',
			range: 'Self',
			school: {
				index: 'illusion',
				name: 'Illusion'
			}
		}
	}
} as ComponentMeta<typeof SpellMoreInformationModal>;

const Template: ComponentStory<typeof SpellMoreInformationModal> = args => (
	<SpellMoreInformationModal {...args} />
);

export const Default = Template.bind({});
