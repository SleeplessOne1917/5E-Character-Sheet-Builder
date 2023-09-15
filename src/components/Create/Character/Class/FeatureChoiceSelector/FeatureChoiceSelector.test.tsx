import { render, screen } from '@testing-library/react';
import * as stories from './FeatureChoiceSelector.stories';
import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('feature-choice-selector')).toMatchSnapshot();
});

it('disables other selects when all choices are made', async () => {
	render(<Default />);

	const button = screen.getAllByRole('button').at(0) as HTMLElement;

	await userEvent.click(button);

	const selectButtons = screen.getAllByText(/^Select$/i);

	for (const b of selectButtons) {
		expect(b).toBeDisabled();
	}

	expect(screen.getByText(/^Deselect$/i)).toBeInTheDocument();
});
