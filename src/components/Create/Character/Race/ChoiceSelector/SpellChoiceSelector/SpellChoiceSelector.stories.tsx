import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Provider } from 'react-redux';
import SpellChoiceSelector from './SpellChoiceSelector';
import { getTestStore } from '../../../../../../redux/store';

export default {
	title: 'Components/Create/Character/Race/ChoiceSelector/SpellChoiceSelector',
	component: SpellChoiceSelector,
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	],
	args: {
		trait: {
			name: 'High Elf Cantrip',
			index: 'high-elf-cantrip'
		},
		choice: {
			choose: 1,
			from: {
				options: [
					{
						item: {
							index: 'light',
							name: 'Light',
							level: 0,
							school: {
								name: 'Evocation',
								index: 'evocation'
							}
						}
					},
					{
						item: {
							index: 'mage-hand',
							name: 'Mage Hand',
							level: 0,
							school: {
								name: 'Conjuration',
								index: 'conjuration'
							}
						}
					},
					{
						item: {
							index: 'mending',
							name: 'Mending',
							level: 0,
							school: {
								name: 'Transmutation',
								index: 'transmutation'
							}
						}
					},
					{
						item: {
							index: 'message',
							name: 'Message',
							level: 0,
							school: {
								name: 'Transmutation',
								index: 'transmutation'
							}
						}
					},
					{
						item: {
							index: 'minor-illusion',
							name: 'Minor Illusion',
							level: 0,
							school: {
								name: 'Illusion',
								index: 'illusion'
							}
						}
					},
					{
						item: {
							index: 'acid-splash',
							name: 'Acid Splash',
							level: 0,
							school: {
								name: 'Conjuration',
								index: 'conjuration'
							}
						}
					},
					{
						item: {
							index: 'prestidigitation',
							name: 'Prestidigitation',
							level: 0,
							school: {
								name: 'Transmutation',
								index: 'transmutation'
							}
						}
					},
					{
						item: {
							index: 'ray-of-frost',
							name: 'Ray of Frost',
							level: 0,
							school: {
								name: 'Evocation',
								index: 'evocation'
							}
						}
					},
					{
						item: {
							index: 'shocking-grasp',
							name: 'Shocking Grasp',
							level: 0,
							school: {
								name: 'Evocation',
								index: 'evocation'
							}
						}
					},
					{
						item: {
							index: 'true-strike',
							name: 'True Strike',
							level: 0,
							school: {
								name: 'Divination',
								index: 'divination'
							}
						}
					},
					{
						item: {
							index: 'chill-touch',
							name: 'Chill Touch',
							level: 0,
							school: {
								name: 'Necromancy',
								index: 'necromancy'
							}
						}
					},
					{
						item: {
							index: 'dancing-lights',
							name: 'Dancing Lights',
							level: 0,
							school: {
								name: 'Evocation',
								index: 'evocation'
							}
						}
					},
					{
						item: {
							index: 'fire-bolt',
							name: 'Fire Bolt',
							level: 0,
							school: {
								name: 'Evocation',
								index: 'evocation'
							}
						}
					},
					{
						item: {
							index: 'poison-spray',
							name: 'Poison Spray',
							level: 0,
							school: {
								name: 'Conjuration',
								index: 'conjuration'
							}
						}
					}
				]
			}
		}
	}
} as ComponentMeta<typeof SpellChoiceSelector>;

const Template: ComponentStory<typeof SpellChoiceSelector> = args => (
	<SpellChoiceSelector {...args} />
);

export const Default = Template.bind({});
