import { ComponentMeta, ComponentStory } from '@storybook/react';

import GeneralInfoBar from './GeneralInfoBar';
import MainContent from '../../MainContent/MainContent';
import { Provider } from 'react-redux';
import { getTestStore } from '../../../redux/store';

export default {
	title: 'Components/CharacterCreation/GeneralInfoBar',
	component: GeneralInfoBar,
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<MainContent>
					<Story />
				</MainContent>
			</Provider>
		)
	]
} as ComponentMeta<typeof GeneralInfoBar>;

const Template: ComponentStory<typeof GeneralInfoBar> = () => (
	<GeneralInfoBar />
);

export const Default = Template.bind({});
