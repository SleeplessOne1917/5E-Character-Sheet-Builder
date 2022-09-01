import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../redux/store';
import CreateIndex from './CreateIndex';

export default {
	title: 'Views/CreateIndex',
	component: CreateIndex,
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof CreateIndex>;

const Template: ComponentStory<typeof CreateIndex> = () => <CreateIndex />;

export const Default = Template.bind({});
