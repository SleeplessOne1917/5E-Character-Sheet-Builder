import { ComponentMeta, ComponentStory } from '@storybook/react';

import Home from './Home';

const HomeSb = {
	title: 'Views/Home',
	component: Home
} as ComponentMeta<typeof Home>;

export default HomeSb;

export const HomeView: ComponentStory<typeof Home> = () => <Home />;
