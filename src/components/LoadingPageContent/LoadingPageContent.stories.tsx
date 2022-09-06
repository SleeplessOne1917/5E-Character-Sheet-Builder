import { ComponentMeta, ComponentStory } from '@storybook/react';
import LoadingPageContent from './LoadingPageContent';

export default {
	title: 'Components/LoadingPageContent',
	component: LoadingPageContent,
	decorators: [
		Story => (
			<div style={{ height: '100vh', display: 'flex' }}>
				<Story />
			</div>
		)
	]
} as ComponentMeta<typeof LoadingPageContent>;

const Template: ComponentStory<typeof LoadingPageContent> = () => (
	<LoadingPageContent />
);

export const Default = Template.bind({});
