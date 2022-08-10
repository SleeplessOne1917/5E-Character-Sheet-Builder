import ChooseModal from './ChooseModal';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
	title: 'Components/ChooseModal',
	component: ChooseModal,
	args: {
		show: true,
		iconId: 'dragonborn',
		title: 'Dragonborn',
		descriptors: [
			{
				title: 'Breath Weapon',
				description: [
					'You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation.',
					'When you use your breath weapon, each creature in the area of the exhalation must make a saving throw, the type of which is determined by your draconic ancestry. The DC for this saving throw equals 8 + your Constitution modifier + your proficiency bonus. A creature takes 2d6 damage on a failed save, and half as much damage on a successful one. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level.',
					'After you use your breath weapon, you cannot use it again until you complete a short or long rest.'
				]
			},
			{
				title: 'Damage Resistance',
				description:
					'You have resistance to the damage type associated with your draconic ancestry.'
			},
			{
				title: 'Draconic Ancestry',
				description:
					'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type, as shown in the table.'
			}
		]
	},
	argTypes: {
		onChoose: { type: 'function' },
		onClose: { type: 'function' }
	}
} as ComponentMeta<typeof ChooseModal>;

const Template: ComponentStory<typeof ChooseModal> = args => (
	<ChooseModal {...args} />
);

export const Default = Template.bind({});

export const DisabledChoose = Template.bind({});

DisabledChoose.args = {
	disableChoose: true
};

export const Error = Template.bind({});

Error.args = {
	error: true
};

export const Loading = Template.bind({});

Loading.args = {
	loading: true
};
