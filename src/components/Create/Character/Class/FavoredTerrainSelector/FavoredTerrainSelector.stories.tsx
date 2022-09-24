import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../../../redux/store';
import FavoredTerrainSelector from './FavoredTerrainSelector';

export default {
	title: 'Components/Create/Character/Class/FavoredTerrainSelector',
	component: FavoredTerrainSelector,
	args: {
		value: 'desert'
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof FavoredTerrainSelector>;

const Template: ComponentStory<typeof FavoredTerrainSelector> = args => (
	<FavoredTerrainSelector {...args} />
);

export const Default = Template.bind({});
