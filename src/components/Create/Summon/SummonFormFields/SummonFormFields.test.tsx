import { render, screen } from '@testing-library/react';
import * as stories from './SummonFormFields.stories';
import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('summon-form-fields')).toMatchSnapshot();
});

it('handles add button correctly', async () => {
	render(<Default />);

	for (let i = 0; i < 5; ++i) {
		await userEvent.click(screen.getByText(/add summon/i));

		expect(screen.getAllByTestId('summon')).toHaveLength(i + 1);
	}

	expect(screen.queryByText(/add summon/i)).not.toBeInTheDocument();
});

it('handles remove correctly', async () => {
	render(<Default />);

	await userEvent.click(screen.getByText(/add summon/i));
	await userEvent.click(screen.getByText(/add summon/i));
	await userEvent.click(screen.getByText(/add summon/i));

	await userEvent.click(
		screen.getAllByText(/remove summon/i).at(0) as HTMLElement
	);

	expect(screen.getAllByTestId('summon')).toHaveLength(2);
});
