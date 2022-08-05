import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import * as stories from './AbilityBonusChoiceSelector.stories';

const { DifferentBonuses, SameBonus } = composeStories(stories);

it.each([[DifferentBonuses], [SameBonus]])('renders correctly', Story => {
	render(<Story />);

	expect(screen.getByTestId('choice-selector')).toMatchSnapshot();
});
