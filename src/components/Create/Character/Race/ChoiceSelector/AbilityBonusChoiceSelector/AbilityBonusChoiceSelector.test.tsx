import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/react';
import * as stories from './AbilityBonusChoiceSelector.stories';

const { DifferentBonuses, SameBonus } = composeStories(stories);

window.matchMedia = jest.fn().mockImplementation(() => ({
	matches: true,
	addEventListener: jest.fn(),
	removeEventListener: jest.fn()
}));

it.each([[DifferentBonuses], [SameBonus]])('renders correctly', Story => {
	render(<Story />);

	expect(screen.getByTestId('choice-selector')).toMatchSnapshot();
});
