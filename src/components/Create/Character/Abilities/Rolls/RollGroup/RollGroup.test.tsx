import '@testing-library/jest-dom';

import * as stories from './RollGroup.stories';

import RollGroup, { sumRolls } from './RollGroup';
import { render, screen } from '@testing-library/react';

import { Provider } from 'react-redux';
import { composeStories } from '@storybook/testing-react';
import { getTestStore } from '../../../../../../redux/store';
import { mockAbilities } from '../../MockAbilitiesStore';
import userEvent from '@testing-library/user-event';

const {
	AllHaveAbilities,
	AllHaveRolls,
	Default,
	HalfHaveAbilities,
	HalfHaveRolls
} = composeStories(stories);

const getSelectOptions = (select: HTMLDivElement) => {
	const options = [] as HTMLLIElement[];
	/* eslint-disable testing-library/no-node-access */
	for (let i = 0; i < (select.querySelector('ul')?.children.length ?? 0); ++i) {
		options.push(select.querySelector('ul')?.children.item(i) as HTMLLIElement);
	}
	/* eslint-enable testing-library/no-node-access */

	return options.map(option => option.textContent);
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
			<Provider store={getTestStore()}>
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
		const store = getTestStore();
		render(
			<Provider store={store}>
				<RollGroup group={0} abilities={mockAbilities} />
			</Provider>
		);

		await clickAllRollButtons();
		await userEvent.click(screen.getByTestId('roll-0'));
		await userEvent.click(screen.getByTestId('roll-0-data-con'));
		await userEvent.click(screen.getByTestId('roll-1'));
		await userEvent.click(screen.getByTestId('roll-1-data-str'));
		await userEvent.click(screen.getByTestId('roll-2'));
		await userEvent.click(screen.getByTestId('roll-2-data-dex'));
		await userEvent.click(screen.getByTestId('roll-3'));
		await userEvent.click(screen.getByTestId('roll-3-data-int'));
		await userEvent.click(screen.getByTestId('roll-4'));
		await userEvent.click(screen.getByTestId('roll-4-data-wis'));
		await userEvent.click(screen.getByTestId('roll-5'));
		await userEvent.click(screen.getByTestId('roll-5-data-cha'));
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
			<Provider store={getTestStore()}>
				<RollGroup group={0} abilities={mockAbilities} />
			</Provider>
		);

		expect(screen.queryByText(/Delete Group/i)).not.toBeInTheDocument();
	});

	it('is rendered when onDeleteGroup prop is passed in', () => {
		const onDeleteGroup = jest.fn();
		render(
			<Provider store={getTestStore()}>
				<RollGroup
					group={0}
					abilities={mockAbilities}
					onDeleteGroup={onDeleteGroup}
				/>
			</Provider>
		);

		expect(screen.getByText(/Delete Group/i)).toBeInTheDocument();
	});

	it('is called when button is clicked', async () => {
		const mockOnDeleteGroup = jest.fn();

		render(
			<Provider store={getTestStore()}>
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
		const store = getTestStore();

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
		const store = getTestStore();

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
		<Provider store={getTestStore()}>
			<RollGroup group={0} abilities={mockAbilities} />
		</Provider>
	);

	await clickAllRollButtons();

	const selected = [];

	await userEvent.click(screen.getByTestId('roll-0'));
	await userEvent.click(screen.getByTestId('roll-0-data-con'));
	selected.push('CON');

	for (const s of selected) {
		expect(getSelectOptions(screen.getByTestId('roll-1'))).not.toContain(s);
	}
	await userEvent.click(screen.getByTestId('roll-1'));
	await userEvent.click(screen.getByTestId('roll-1-data-str'));
	selected.push('STR');

	for (const s of selected) {
		expect(getSelectOptions(screen.getByTestId('roll-2'))).not.toContain(s);
	}
	await userEvent.click(screen.getByTestId('roll-2'));
	await userEvent.click(screen.getByTestId('roll-2-data-dex'));
	selected.push('DEX');

	for (const s of selected) {
		expect(getSelectOptions(screen.getByTestId('roll-3'))).not.toContain(s);
	}
	await userEvent.click(screen.getByTestId('roll-3'));
	await userEvent.click(screen.getByTestId('roll-3-data-int'));
	selected.push('INT');

	for (const s of selected) {
		expect(getSelectOptions(screen.getByTestId('roll-4'))).not.toContain(s);
	}
	await userEvent.click(screen.getByTestId('roll-4'));
	await userEvent.click(screen.getByTestId('roll-4-data-cha'));
	selected.push('CHA');

	for (const s of selected) {
		expect(getSelectOptions(screen.getByTestId('roll-5'))).not.toContain(s);
	}
});
