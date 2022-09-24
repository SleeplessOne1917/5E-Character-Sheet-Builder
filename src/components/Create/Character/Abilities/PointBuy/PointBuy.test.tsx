import '@testing-library/jest-dom';

import * as stories from './PointBuy.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { Default, NoMorePoints, SomePointsSpent } = composeStories(stories);

it('renders correctly', () => {
	render(<SomePointsSpent />);

	expect(screen.getByRole('region')).toMatchSnapshot();
});

it('has no minus buttons when no points spent', () => {
	render(<Default />);

	expect(screen.getAllByLabelText(/plus 1/i).length).toBeGreaterThan(0);
	expect(screen.queryByLabelText(/minus 1/i)).not.toBeInTheDocument();
});

it('has no plus buttons when all points are spent', () => {
	render(<NoMorePoints />);

	expect(screen.getAllByLabelText(/minus 1/i).length).toBeGreaterThan(0);
	expect(screen.queryByLabelText(/plus 1/i)).not.toBeInTheDocument();
});

it('subtracts the expected number of points on increment and shows/hides expected buttons', async () => {
	render(<Default />);

	const plusButton = screen.getAllByLabelText(/plus 1/i).at(0) as HTMLElement;
	const pointsRemaining = screen.getByText(/^\d+\/\d+$/);

	// Score = 8
	expect(pointsRemaining).toHaveTextContent('27/27');

	await userEvent.click(plusButton);
	// Score = 9
	expect(pointsRemaining).toHaveTextContent('26/27');

	await userEvent.click(plusButton);
	// Score = 10
	expect(pointsRemaining).toHaveTextContent('25/27');

	await userEvent.click(plusButton);
	// Score = 11
	expect(pointsRemaining).toHaveTextContent('24/27');

	await userEvent.click(plusButton);
	// Score = 12
	expect(pointsRemaining).toHaveTextContent('23/27');

	await userEvent.click(plusButton);
	// Score = 13
	expect(pointsRemaining).toHaveTextContent('22/27');

	await userEvent.click(plusButton);
	// Score = 14
	expect(pointsRemaining).toHaveTextContent('20/27');

	await userEvent.click(plusButton);
	// Score = 15
	expect(pointsRemaining).toHaveTextContent('18/27');

	expect(plusButton).not.toBeInTheDocument();
	expect(screen.getByLabelText(/minus 1/i)).toBeInTheDocument();
});
