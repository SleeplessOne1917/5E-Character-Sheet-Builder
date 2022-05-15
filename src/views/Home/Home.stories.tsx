import { ComponentMeta, ComponentStory } from '@storybook/react';

import Home from './Home';

export default {
	title: 'Views/Home',
	component: Home
} as ComponentMeta<typeof Home>;

export const HomeView: ComponentStory<typeof Home> = () => <Home />;
