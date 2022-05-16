import '@testing-library/jest-dom';

import * as stories from './AbilityCalculation.stories';

import { act, render, screen } from '@testing-library/react';

import AbilityCalculation from './AbilityCalculation';
import { Provider } from 'react-redux';
import { composeStories } from '@storybook/testing-react';
import { getStore } from '../../../../redux/store';
import userEvent from '@testing-library/user-event';

const { AllBonusesAndOverrideButNoBase, Everything, OnlyBaseScore } =
	composeStories(stories);

const getCalculationNumberDiv = (text: string) => {
	const componentChildren = screen.getByText(new RegExp(text)).parentElement
		?.childNodes;
	return componentChildren?.item(componentChildren.length - 1) as HTMLElement;
};

it('renders correctly', () => {
	const container = render(<Everything />).container;

	expect(container.firstChild).toMatchSnapshot();
});

it('displays total score and modifier when base score is set', () => {
	render(<OnlyBaseScore />);

	expect(getCalculationNumberDiv('Total Score')).not.toHaveTextContent(
		'\u2014'
	);
	expect(getCalculationNumberDiv('Modifier')).not.toHaveTextContent('\u2014');
});

it('does not display total score when base score is not set', () => {
	render(<AllBonusesAndOverrideButNoBase />);

	expect(getCalculationNumberDiv('Total Score')).toHaveTextContent('\u2014');
	expect(getCalculationNumberDiv('Modifier')).toHaveTextContent('\u2014');
	expect(getCalculationNumberDiv('Base Score')).toHaveTextContent('\u2014');
});

it('uses default values when bonuses not passed in', () => {
	render(<OnlyBaseScore />);

	expect(getCalculationNumberDiv('Racial Bonus')).toHaveTextContent('+0');
	expect(getCalculationNumberDiv('Ability Improvements')).toHaveTextContent(
		'+0'
	);
	expect(getCalculationNumberDiv('Misc Bonus')).toHaveTextContent('+0');
});

describe('other bonus', () => {
	it('does not allow input lower than -10', async () => {
		render(
			<Provider store={getStore()}>
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
			<Provider store={getStore()}>
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
			<Provider store={getStore()}>
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
			<Provider store={getStore()}>
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
