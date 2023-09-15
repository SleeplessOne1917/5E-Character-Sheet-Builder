import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from './ExpertiseSelector.stories';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('expertise-selector')).toMatchSnapshot();
});
