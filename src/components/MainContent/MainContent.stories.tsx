import { ComponentMeta, ComponentStory } from '@storybook/react';

import MainContent from './MainContent';

export default {
	title: 'Components/MainContent',
	component: MainContent
} as ComponentMeta<typeof MainContent>;

export const Content: ComponentStory<typeof MainContent> = () => (
	<MainContent>Content</MainContent>
);
Content.decorators = [
	story => (
		<div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
			{story()}
		</div>
	)
];
