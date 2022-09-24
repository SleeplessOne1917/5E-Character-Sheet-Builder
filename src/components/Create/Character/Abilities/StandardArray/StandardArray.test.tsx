import '@testing-library/jest-dom';

import * as stories from './StandardArray.stories';

import { render, screen } from '@testing-library/react';

import { composeStories } from '@storybook/testing-react';
import userEvent from '@testing-library/user-event';

const { HalfSelected, NoneSelected } = composeStories(stories);

const getSelectOptions = (select: HTMLDivElement) => {
	const options = [] as HTMLLIElement[];
	/* eslint-disable testing-library/no-node-access */
	for (let i = 0; i < (select.querySelector('ul')?.children.length ?? 0); ++i) {
		options.push(select.querySelector('ul')?.children.item(i) as HTMLLIElement);
	}
	/* eslint-enable testing-library/no-node-access */

	return options.map(option => option.textContent);
};

it('renders correctly', () => {
	render(<HalfSelected />);

	expect(screen.getByRole('region')).toMatchSnapshot();
});

it('only renders total score when score is selected', async () => {
	render(<NoneSelected />);

	expect(screen.queryByText(/Total: \d/i)).not.toBeInTheDocument();
	const originalNumberOfEmdashTotals =
		screen.getAllByText(/Total: \u2014/).length;
	expect(originalNumberOfEmdashTotals).toBeGreaterThan(0);

	await userEvent.selectOptions(screen.getByTestId('str-list'), '8');

	expect(screen.getByText(/Total: \d/i)).toBeInTheDocument();
	expect(screen.getAllByText(/Total: \u2014/).length).toBe(
		originalNumberOfEmdashTotals - 1
	);
});

it('removes selected options from the options of other dropdowns', async () => {
	render(<NoneSelected />);

	const selected = [];
	await userEvent.selectOptions(screen.getByTestId('str-list'), '8');
	selected.push('8');

	const secondSelect = screen.getByLabelText(/Dexterity/i) as HTMLDivElement;
	for (const s of selected) {
		expect(getSelectOptions(secondSelect)).not.toContain(s);
	}
	await userEvent.selectOptions(screen.getByTestId('dex-list'), '10');
	selected.push('10');

	const thirdSelect = screen.getByLabelText(/Constitution/i) as HTMLDivElement;
	for (const s of selected) {
		expect(getSelectOptions(thirdSelect)).not.toContain(s);
	}
	await userEvent.selectOptions(screen.getByTestId('con-list'), '12');
	selected.push('12');

	const fourthSelect = screen.getByLabelText(/Intelligence/i) as HTMLDivElement;
	for (const s of selected) {
		expect(getSelectOptions(fourthSelect)).not.toContain(s);
	}
	await userEvent.selectOptions(screen.getByTestId('int-list'), '13');
	selected.push('13');

	const fifthSelect = screen.getByLabelText(/Wisdom/i) as HTMLDivElement;
	for (const s of selected) {
		expect(getSelectOptions(fifthSelect)).not.toContain(s);
	}
	await userEvent.selectOptions(screen.getByTestId('wis-list'), '14');
	selected.push('14');

	const sixthSelect = screen.getByLabelText(/Charisma/i) as HTMLDivElement;
	for (const s of selected) {
		expect(getSelectOptions(sixthSelect)).not.toContain(s);
	}
});
