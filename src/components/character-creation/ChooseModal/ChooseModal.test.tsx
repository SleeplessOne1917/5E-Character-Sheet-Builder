import '@testing-library/jest-dom';

import * as stories from './ChooseModal.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId(/choose-modal/i)).toMatchSnapshot();
});

it('has display none when show is false', () => {
	render(<Default show={false} />);

	expect(screen.getByTestId(/choose-modal/i)).toHaveStyle('display: none');
});

it('has display flex when show is true', () => {
	render(<Default />);

	expect(screen.getByTestId(/choose-modal/i)).toHaveStyle('display: flex');
});

it('calls onChoose when choose button is clicked', async () => {
	const onChooseMock = jest.fn();
	const oncloseMock = jest.fn();

	render(<Default onChoose={onChooseMock} onClose={oncloseMock} />);

	await userEvent.click(screen.getByText(/choose/i));

	expect(onChooseMock).toHaveBeenCalled();
});

it('calls onClose when cancel button is clicked', async () => {
	const onCloseMock = jest.fn();
	const onChooseMock = jest.fn();

	render(<Default onChoose={onChooseMock} onClose={onCloseMock} />);

	await userEvent.click(screen.getByText(/cancel/i));

	expect(onCloseMock).toHaveBeenCalled();
});
