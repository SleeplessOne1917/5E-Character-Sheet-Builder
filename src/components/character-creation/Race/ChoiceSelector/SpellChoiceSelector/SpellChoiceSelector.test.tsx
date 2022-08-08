import { render, screen } from '@testing-library/react';
import * as stories from './SpellChoiceSelector.stories';
import { composeStories } from '@storybook/testing-react';

const { Default } = composeStories(stories);

window.matchMedia = jest.fn().mockImplementation(() => ({
	matches: true,
	addEventListener: jest.fn(),
	removeEventListener: jest.fn()
}));

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('choice-selector')).toMatchSnapshot();
});
