import { render, screen } from '@testing-library/react';
import * as stories from './FavoredTerrainSelector.stories';
import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('favored-terrain-selector')).toMatchSnapshot();
});
