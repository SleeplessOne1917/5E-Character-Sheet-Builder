import { ComponentMeta, ComponentStory } from '@storybook/react';

import CreateCharacterSpellsSelector from './CreateCharacterSpellsSelector';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../redux/store';

export default {
	title: 'Components/Spells/CreateCharacterSpellsSelector',
	component: CreateCharacterSpellsSelector,
	args: {
		choose: 5,
		spells: [
			{
				id: 'true-strike',
				name: 'True Strike',
				level: 0,
				school: {
					name: 'Divination',
					id: 'divination'
				}
			},
			{
				id: 'light',
				name: 'Light',
				level: 0,
				school: {
					name: 'Evocation',
					id: 'evocation'
				}
			},
			{
				id: 'mending',
				name: 'Mending',
				level: 0,
				school: {
					name: 'Transmutation',
					id: 'transmutation'
				}
			},
			{
				id: 'message',
				name: 'Message',
				level: 0,
				school: {
					name: 'Transmutation',
					id: 'transmutation'
				}
			},
			{
				id: 'vicious-mockery',
				name: 'Vicious Mockery',
				level: 0,
				school: {
					name: 'Enchantment',
					id: 'enchantment'
				}
			},
			{
				id: 'minor-illusion',
				name: 'Minor Illusion',
				level: 0,
				school: {
					name: 'Illusion',
					id: 'illusion'
				}
			},
			{
				id: 'dancing-lights',
				name: 'Dancing Lights',
				level: 0,
				school: {
					name: 'Evocation',
					id: 'evocation'
				}
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
} as ComponentMeta<typeof CreateCharacterSpellsSelector>;

const Template: ComponentStory<typeof CreateCharacterSpellsSelector> = args => (
	<CreateCharacterSpellsSelector {...args} />
);

export const Default = Template.bind({});
