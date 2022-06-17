import '@testing-library/jest-dom';

import * as stories from './ManualScores.stories';

import { render, screen } from '@testing-library/react';

import ManualScores from './ManualScores';
import { Provider } from 'react-redux';
import { composeStories } from '@storybook/testing-react';
import { getTestStore } from '../../../../redux/store';
import { mockAbilities } from '../MockAbilitiesStore';
import userEvent from '@testing-library/user-event';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByRole('region')).toMatchSnapshot();
});

describe('text boxes', () => {
	it('should not allow non number input', async () => {
		render(<Default />);

		const inputs = screen.getAllByRole('textbox');
		for (const input of inputs) {
			await userEvent.clear(input);
			await userEvent.type(input, 'abc');
			await userEvent.click(screen.getAllByText(/Total/i).at(0) as HTMLElement);

			expect((input as HTMLInputElement).value).toBe('');
		}
	});

	it('should not allow input lower than 3', async () => {
		render(<Default />);

		const inputs = screen.getAllByRole('textbox');
		for (const input of inputs) {
			await userEvent.clear(input);
			await userEvent.type(input, '2');
			await userEvent.click(screen.getAllByText(/Total/i).at(0) as HTMLElement);

			expect((input as HTMLInputElement).value).toBe('3');
		}
	});

	it('should not allow input higher than 18', async () => {
		render(<Default />);

		const inputs = screen.getAllByRole('textbox');
		for (const input of inputs) {
			await userEvent.clear(input);
			await userEvent.type(input, '19');
			await userEvent.click(screen.getAllByText(/Total/i).at(0) as HTMLElement);

			expect((input as HTMLInputElement).value).toBe('18');
		}
	});
});

it('only shows total when base score is set', async () => {
	render(
		<Provider store={getTestStore()}>
			<ManualScores abilities={mockAbilities} />
		</Provider>
	);

	expect(screen.queryByText(/Total: \d/i)).not.toBeInTheDocument();

	const input = screen.getAllByRole('textbox').at(0) as HTMLInputElement;
	await userEvent.type(input, '14');
	await userEvent.click(screen.getAllByText(/Total/i).at(0) as HTMLElement);

	expect(screen.getByText(/Total: \d/i)).toBeInTheDocument();
});
