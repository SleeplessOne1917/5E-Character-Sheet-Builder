import '@testing-library/jest-dom';

import * as stories from './AbilityCalculation.stories';

import { render, screen } from '@testing-library/react';

import AbilityCalculation from './AbilityCalculation';
import { Provider } from 'react-redux';
import { composeStories } from '@storybook/testing-react';
import { getTestStore } from '../../../../redux/store';
import userEvent from '@testing-library/user-event';

const { AllBonusesAndOverrideButNoBase, Everything, OnlyBaseScore } =
	composeStories(stories);

it('renders correctly', () => {
	render(<Everything />);

	expect(screen.getByTestId('ability-calculation')).toMatchSnapshot();
});

it('displays total score and modifier when base score is set', () => {
	render(<OnlyBaseScore />);

	expect(screen.getByTestId('total-score')).not.toHaveTextContent('\u2014');
	expect(screen.getByTestId('modifier')).not.toHaveTextContent('\u2014');
});

it('does not display total score when base score is not set', () => {
	render(<AllBonusesAndOverrideButNoBase />);

	expect(screen.getByTestId('total-score')).toHaveTextContent('\u2014');
	expect(screen.getByTestId('modifier')).toHaveTextContent('\u2014');
	expect(screen.getByTestId('base-score')).toHaveTextContent('\u2014');
});

it('uses default values when bonuses not passed in', () => {
	render(<OnlyBaseScore />);

	expect(screen.getByTestId('racial-bonus')).toHaveTextContent('+0');
	expect(screen.getByTestId('ability-improvements')).toHaveTextContent('+0');
	expect(screen.getByTestId('misc-bonus')).toHaveTextContent('+0');
});

describe('other bonus', () => {
	it('does not allow input lower than -10', async () => {
		render(
			<Provider store={getTestStore()}>
				<AbilityCalculation index="str" name="Strength" />
			</Provider>
		);
		const otherBonusInput = screen.getByLabelText(
			/Other Bonus/i
		) as HTMLInputElement;
		await userEvent.type(otherBonusInput, '-11');
		await userEvent.click(screen.getByText(/Other Bonus/i));

		expect(otherBonusInput.value).toBe('-10');
	});

	it('does not allow input greater than 10', async () => {
		render(
			<Provider store={getTestStore()}>
				<AbilityCalculation index="dex" name="Dexterity" />
			</Provider>
		);
		const otherBonusInput = screen.getByLabelText(
			/Other Bonus/i
		) as HTMLInputElement;
		await userEvent.type(otherBonusInput, '11');
		await userEvent.click(screen.getByText(/Other Bonus/i));

		expect(otherBonusInput.value).toBe('10');
	});
});

describe('override', () => {
	it('does not allow input lower than 3', async () => {
		render(
			<Provider store={getTestStore()}>
				<AbilityCalculation index="con" name="Constitution" />
			</Provider>
		);
		const overrideBonusInput = screen.getByLabelText(
			/Override Score/i
		) as HTMLInputElement;
		await userEvent.type(overrideBonusInput, '2');
		await userEvent.click(screen.getByText(/Override Score/i));

		expect(overrideBonusInput.value).toBe('3');
	});

	it('does not allow input greater than 30', async () => {
		render(
			<Provider store={getTestStore()}>
				<AbilityCalculation index="con" name="Constitution" />
			</Provider>
		);
		const overrideBonusInput = screen.getByLabelText(
			/Override Score/i
		) as HTMLInputElement;
		await userEvent.type(overrideBonusInput, '31');
		await userEvent.click(screen.getByText(/Override Score/i));

		expect(overrideBonusInput.value).toBe('30');
	});
});
