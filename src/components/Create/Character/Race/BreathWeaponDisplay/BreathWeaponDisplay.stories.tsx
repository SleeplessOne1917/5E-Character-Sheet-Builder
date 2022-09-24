import { ComponentMeta, ComponentStory } from '@storybook/react';
import BreathWeaponDisplay from './BreathWeaponDisplay';

export default {
	title: 'Components/Create/Character/Race/BreathWeaponDisplay',
	component: BreathWeaponDisplay,
	args: {
		breathWeapon: {
			damage: [
				{
					damage_type: {
						index: 'fire',
						name: 'Fire'
					},
					damage_at_character_level: [{ damage: '2d6', level: 1 }]
				}
			],
			dc: {
				type: {
					index: 'dex',
					full_name: 'Dexterity'
				}
			},
			area_of_effect: {
				size: 15,
				type: 'CONE'
			}
		}
	}
} as ComponentMeta<typeof BreathWeaponDisplay>;

const Template: ComponentStory<typeof BreathWeaponDisplay> = args => (
	<BreathWeaponDisplay {...args} />
);

export const Default = Template.bind({});
