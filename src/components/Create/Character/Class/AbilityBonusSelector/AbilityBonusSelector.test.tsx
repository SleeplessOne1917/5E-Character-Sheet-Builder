import * as stories from './AbilityBonusSelector.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';

const { NoneSelected, OneSelected, SameSelected, TwoSelected } =
	composeStories(stories);

describe('renders correctly', () => {
	it('none selected', () => {
		render(<NoneSelected />);

		expect(screen.getByTestId('ability-bonus-selector')).toMatchSnapshot();
	});

	it('one selected', () => {
		render(<OneSelected />);

		expect(screen.getByTestId('ability-bonus-selector')).toMatchSnapshot();
	});

	it('two selected', () => {
		render(<TwoSelected />);

		expect(screen.getByTestId('ability-bonus-selector')).toMatchSnapshot();
	});

	it('same selected', () => {
		render(<SameSelected />);

		expect(screen.getByTestId('ability-bonus-selector')).toMatchSnapshot();
	});
});
