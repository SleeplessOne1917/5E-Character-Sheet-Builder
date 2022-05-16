import { ComponentMeta, ComponentStory } from '@storybook/react';

import SectionBar from './SectionBar';

export default {
	title: 'Components/SectionBar',
	component: SectionBar
} as ComponentMeta<typeof SectionBar>;

export const Default: ComponentStory<typeof SectionBar> = () => <SectionBar />;
Default.parameters = {
	nextRouter: {
		pathname: '/create/race',
		asPath: '/create/race'
	}
};
