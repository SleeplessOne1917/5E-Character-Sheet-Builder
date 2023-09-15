import { render, screen } from '@testing-library/react';
import * as stories from './SpellSelector.stories';
import { composeStories } from '@storybook/react';

const { Default } = composeStories(stories);

window.matchMedia = jest.fn().mockImplementation(() => ({
	matches: true,
	addEventListener: jest.fn(),
	removeEventListener: jest.fn()
}));

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('spell-selector')).toMatchSnapshot();
});
