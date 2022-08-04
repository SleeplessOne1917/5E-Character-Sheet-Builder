import * as stories from './RollDisplay.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { ButtonShowing, RollNoAbilitySelected, RollWithAbilitySelected } =
	composeStories(stories);

describe('renders correctly', () => {
	it('when button is showing', () => {
		render(<ButtonShowing />);

		expect(screen.getByTestId(/roll-display/i)).toMatchSnapshot();
	});

	it('when roll is showing', () => {
		render(<RollNoAbilitySelected />);

		expect(screen.getByTestId(/roll-display/i)).toMatchSnapshot();
	});

	it('when roll is showing and ability is selected', () => {
		render(<RollWithAbilitySelected />);

		expect(screen.getByTestId(/roll-display/i)).toMatchSnapshot();
	});
});
