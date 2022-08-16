import '@testing-library/jest-dom';

import * as stories from './Abilities.stories';

import { render, screen } from '@testing-library/react';

import Abilities from './Abilities';
import AbilityScores from '../../../../types/abilityScores';
import { Provider } from 'react-redux';
import { composeStories } from '@storybook/testing-react';
import { getAbilityScoresTest } from '../../../../hooks/useGetAbilityScore';
import { getTestStore } from '../../../../redux/store';
import { mockAbilities } from '../../../../components/character-creation/Abilities/MockAbilitiesStore';
import userEvent from '@testing-library/user-event';

const { Default } = composeStories(stories);

it('renders correctly', () => {
	render(<Default />);

	expect(screen.getByTestId('abilities')).toMatchSnapshot();
});

describe('hides and shows roll groups', () => {
	it('on click', async () => {
		render(<Default />);

		expect(screen.getByTestId('roll-groups')).toHaveClass('open');

		await userEvent.click(screen.getByText(/Dice Roll Groups/i));

		expect(screen.getByTestId('roll-groups')).not.toHaveClass('open');

		await userEvent.click(screen.getByText(/Dice Roll Groups/i));

		expect(screen.getByTestId('roll-groups')).toHaveClass('open');
	});

	it('on enter press', async () => {
		render(<Default />);

		expect(screen.getByTestId('roll-groups')).toHaveClass('open');

		await userEvent.tab();
		await userEvent.tab();
		await userEvent.keyboard('{Enter}');

		expect(screen.getByTestId('roll-groups')).not.toHaveClass('open');

		await userEvent.keyboard('{Enter}');

		expect(screen.getByTestId('roll-groups')).toHaveClass('open');
	});

	it('on space press', async () => {
		render(<Default />);

		expect(screen.getByTestId('roll-groups')).toHaveClass('open');

		await userEvent.tab();
		await userEvent.tab();
		await userEvent.keyboard(' ');

		expect(screen.getByTestId('roll-groups')).not.toHaveClass('open');

		await userEvent.keyboard(' ');

		expect(screen.getByTestId('roll-groups')).toHaveClass('open');
	});
});

it('add group adds group', async () => {
	render(<Default />);

	await userEvent.click(screen.getByText(/Add Group/i));

	expect(screen.getAllByTestId('roll-group').length).toBeGreaterThan(1);
});

it('has expected default ability score values on generation method switch', async () => {
	const store = getTestStore();
	render(
		<Provider store={store}>
			<Abilities abilities={mockAbilities} />
		</Provider>
	);

	for (const key of Object.keys(
		store.getState().editingCharacter.abilityScores
	)) {
		expect(
			getAbilityScoresTest(
				store.getState().editingCharacter.abilityScores,
				key as AbilityScores
			).base
		).toBeUndefined();
	}

	await userEvent.selectOptions(
		screen.getByTestId('generation-method-list'),
		'Manual'
	);

	for (const key of Object.keys(
		store.getState().editingCharacter.abilityScores
	)) {
		expect(
			getAbilityScoresTest(
				store.getState().editingCharacter.abilityScores,
				key as AbilityScores
			).base
		).toBeNull();
	}

	await userEvent.selectOptions(
		screen.getByTestId('generation-method-list'),
		'Roll'
	);

	for (const key of Object.keys(
		store.getState().editingCharacter.abilityScores
	)) {
		expect(
			getAbilityScoresTest(
				store.getState().editingCharacter.abilityScores,
				key as AbilityScores
			).base
		).toBeNull();
	}

	await userEvent.selectOptions(
		screen.getByTestId('generation-method-list'),
		'Point Buy'
	);

	for (const key of Object.keys(
		store.getState().editingCharacter.abilityScores
	)) {
		expect(
			getAbilityScoresTest(
				store.getState().editingCharacter.abilityScores,
				key as AbilityScores
			).base
		).toBe(8);
	}

	await userEvent.selectOptions(
		screen.getByTestId('generation-method-list'),
		'Standard Array'
	);

	for (const key of Object.keys(
		store.getState().editingCharacter.abilityScores
	)) {
		expect(
			getAbilityScoresTest(
				store.getState().editingCharacter.abilityScores,
				key as AbilityScores
			).base
		).toBeNull();
	}
});
