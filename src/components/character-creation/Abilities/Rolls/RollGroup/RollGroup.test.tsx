import '@testing-library/jest-dom';

import * as stories from './RollGroup.stories';

import RollGroup, { sumRolls } from './RollGroup';
import { render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import { composeStories } from '@storybook/testing-react';
import { getStore } from '../../../../../redux/store';
import { mockAbilities } from '../../MockAbilitiesStore';
import userEvent from '@testing-library/user-event';

const {
	AllHaveAbilities,
	AllHaveRolls,
	Default,
	HalfHaveAbilities,
	HalfHaveRolls
} = composeStories(stories);

const getSelectOptions = (select: HTMLSelectElement) => {
	const options = [] as HTMLOptionElement[];
	for (let i = 0; i < select.options.length; ++i) {
		options.push(select.options.item(i) as HTMLOptionElement);
	}

	return options.map(option => option.text);
};

const clickAllRollButtons = async () => {
	for (const button of screen.getAllByText(/Roll/i)) {
		await userEvent.click(button);
	}
};

describe('renders correctly', () => {
	it('when all buttons', () => {
		render(<Default />);

		expect(screen.getByTestId(/roll-group/i)).toMatchSnapshot();
	});

	it('when all scores', () => {
		render(<AllHaveRolls />);

		expect(screen.getByTestId(/roll-group/i)).toMatchSnapshot();
	});

	it('when all score with abilities assigned', () => {
		render(<AllHaveAbilities />);

		expect(screen.getByTestId(/roll-group/i)).toMatchSnapshot();
	});
});

describe('reset group', () => {
	it('is disabled when there are no rolls', () => {
		render(<Default />);

		expect(screen.getByText(/Reset Group/i)).toBeDisabled();
	});

	it('is enabled when there are rolls', () => {
		render(<HalfHaveRolls />);

		expect(screen.getByText(/Reset Group/i)).toBeEnabled();
	});

	it('resets groups', async () => {
		render(
			<Provider store={getStore()}>
				<RollGroup group={0} abilities={mockAbilities} />
			</Provider>
		);

		await clickAllRollButtons();
		await userEvent.click(screen.getByText(/Reset Group/i));

		expect(screen.getAllByText(/Roll/i)).toHaveLength(6);
		expect(screen.queryByLabelText(/Select ability/i)).not.toBeInTheDocument();
	});
});

describe('apply ability scores', () => {
	it('is disabled when no ability scores are selected', () => {
		render(<AllHaveRolls />);

		expect(screen.getByText(/Apply Ability Scores/i)).toBeDisabled();
	});

	it('is enabled when ability scores are selected', () => {
		render(<HalfHaveAbilities />);

		expect(screen.getByText(/Apply Ability Scores/i)).toBeEnabled();
	});

	it('applies ability scores', async () => {
		const store = getStore();
		render(
			<Provider store={store}>
				<RollGroup group={0} abilities={mockAbilities} />
			</Provider>
		);

		await clickAllRollButtons();
		const dropdowns = screen.getAllByLabelText(/Select ability/i);
		await userEvent.selectOptions(dropdowns.at(0) as HTMLElement, 'CON');
		await userEvent.selectOptions(dropdowns.at(1) as HTMLElement, 'STR');
		await userEvent.selectOptions(dropdowns.at(2) as HTMLElement, 'DEX');
		await userEvent.selectOptions(dropdowns.at(3) as HTMLElement, 'INT');
		await userEvent.selectOptions(dropdowns.at(4) as HTMLElement, 'WIS');
		await userEvent.selectOptions(dropdowns.at(5) as HTMLElement, 'CHA');
		await userEvent.click(screen.getByText(/Apply Ability Scores/i));

		expect(store.getState().editingCharacter.abilityScores.con.base).toBe(
			sumRolls(store.getState().rollGroups[0][0].rolls as number[])
		);
		expect(store.getState().editingCharacter.abilityScores.str.base).toBe(
			sumRolls(store.getState().rollGroups[0][1].rolls as number[])
		);
		expect(store.getState().editingCharacter.abilityScores.dex.base).toBe(
			sumRolls(store.getState().rollGroups[0][2].rolls as number[])
		);
		expect(store.getState().editingCharacter.abilityScores.int.base).toBe(
			sumRolls(store.getState().rollGroups[0][3].rolls as number[])
		);
		expect(store.getState().editingCharacter.abilityScores.wis.base).toBe(
			sumRolls(store.getState().rollGroups[0][4].rolls as number[])
		);
		expect(store.getState().editingCharacter.abilityScores.cha.base).toBe(
			sumRolls(store.getState().rollGroups[0][5].rolls as number[])
		);
	});
});

describe('delete group', () => {
	it('is not rendered when no onDeleteGroup prop is passed in', () => {
		render(
			<Provider store={getStore()}>
				<RollGroup group={0} abilities={mockAbilities} />
			</Provider>
		);

		expect(screen.queryByText(/Delete Group/i)).not.toBeInTheDocument();
	});

	it('is rendered when onDeleteGroup prop is passed in', () => {
		render(
			<Provider store={getStore()}>
				<RollGroup
					group={0}
					abilities={mockAbilities}
					onDeleteGroup={() => {}}
				/>
			</Provider>
		);

		expect(screen.getByText(/Delete Group/i)).toBeInTheDocument();
	});

	it('is called when button is clicked', async () => {
		const mockOnDeleteGroup = jest.fn();

		render(
			<Provider store={getStore()}>
				<RollGroup
					group={0}
					abilities={mockAbilities}
					onDeleteGroup={mockOnDeleteGroup}
				/>
			</Provider>
		);

		await userEvent.click(screen.getByText(/Delete Group/i));

		expect(mockOnDeleteGroup).toHaveBeenCalled();
	});
});

describe('rolls', () => {
	it('are ordered', async () => {
		const store = getStore();

		render(
			<Provider store={store}>
				<RollGroup group={0} abilities={mockAbilities} />
			</Provider>
		);

		await clickAllRollButtons();

		for (const { rolls } of store.getState().rollGroups[0]) {
			for (let i = 0; i < (rolls?.length as number) - 1; ++i) {
				expect((rolls as number[])[i]).toBeGreaterThanOrEqual(
					(rolls as number[])[i + 1]
				);
			}
		}
	});

	it('are between 1 and 6', async () => {
		const store = getStore();

		render(
			<Provider store={store}>
				<RollGroup group={0} abilities={mockAbilities} />
			</Provider>
		);

		await clickAllRollButtons();

		for (const roll of store
			.getState()
			.rollGroups[0].reduce(
				(prev: number[], { rolls }) => prev.concat(rolls as number[]),
				[] as number[]
			)) {
			expect(roll).toBeGreaterThanOrEqual(1);
			expect(roll).toBeLessThanOrEqual(6);
		}
	});
});

it('removes selected options from options of other dropdowns', async () => {
	render(
		<Provider store={getStore()}>
			<RollGroup group={0} abilities={mockAbilities} />
		</Provider>
	);

	await clickAllRollButtons();

	const dropdowns = screen.getAllByLabelText(/Select ability/i);
	const selected = [];

	await userEvent.selectOptions(dropdowns.at(0) as HTMLElement, 'CON');
	selected.push('CON');

	const secondDropdown = dropdowns.at(1) as HTMLSelectElement;
	for (const s of selected) {
		expect(getSelectOptions(secondDropdown)).not.toContain(s);
	}
	await userEvent.selectOptions(secondDropdown, 'STR');
	selected.push('STR');

	const thirdDropdown = dropdowns.at(2) as HTMLSelectElement;
	for (const s of selected) {
		expect(getSelectOptions(thirdDropdown)).not.toContain(s);
	}
	await userEvent.selectOptions(thirdDropdown, 'DEX');
	selected.push('DEX');

	const fourthDropdown = dropdowns.at(3) as HTMLSelectElement;
	for (const s of selected) {
		expect(getSelectOptions(fourthDropdown)).not.toContain(s);
	}
	await userEvent.selectOptions(fourthDropdown, 'INT');
	selected.push('INT');

	const fifthDropDown = dropdowns.at(4) as HTMLSelectElement;
	for (const s of selected) {
		expect(getSelectOptions(fifthDropDown)).not.toContain(s);
	}
	await userEvent.selectOptions(fifthDropDown, 'CHA');
	selected.push('CHA');

	const sixthDropdown = dropdowns.at(5) as HTMLSelectElement;
	for (const s of selected) {
		expect(getSelectOptions(sixthDropdown)).not.toContain(s);
	}
});
