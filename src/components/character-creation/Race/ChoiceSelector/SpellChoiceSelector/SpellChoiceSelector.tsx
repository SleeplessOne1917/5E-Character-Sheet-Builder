import {
	SrdItem,
	SrdSpellItem,
	SrdSpellItemChoice
} from '../../../../../types/srd';
import { useCallback, useEffect, useState } from 'react';

import ChoiceSelector from '../ChoiceSelector';
import SpellSelector from './SpellSelector/SpellSelector';
import classes from './SpellChoiceSelector.module.css';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../hooks/reduxHooks';
import { addSpell, removeSpell } from '../../../../../redux/features/spells';
import {
	addTraitSpell,
	removeTraitSpell
} from '../../../../../redux/features/raceInfo';

type SpellChoiceSelectorProps = {
	trait: SrdItem;
	choice: SrdSpellItemChoice;
};

const SpellChoiceSelector = ({ choice, trait }: SpellChoiceSelectorProps) => {
	const selectedSpells = useAppSelector(
		state => state.editingCharacter.raceInfo.selectedTraitSpells[trait.index]
	);
	const dispatch = useAppDispatch();

	const getInitialSelectValues = useCallback(() => {
		const returnValues: string[] = [];

		for (let i = 0; i < choice.choose; ++i) {
			if (selectedSpells && i < selectedSpells.length) {
				returnValues.push(selectedSpells[i].index);
			} else {
				returnValues.push('blank');
			}
		}

		return returnValues;
	}, [choice, selectedSpells]);

	const spells = useAppSelector(state => state.editingCharacter.spells);

	const [selectValues, setSelectValues] = useState<string[]>(
		getInitialSelectValues()
	);

	useEffect(() => {
		setSelectValues(getInitialSelectValues());
	}, [setSelectValues, getInitialSelectValues]);

	const handleAdd = useCallback(
		(value: string) => {
			const spell = choice.from.options
				.map(option => option.item)
				.find(option => option.index === value) as SrdSpellItem;

			dispatch(addSpell(spell));
			dispatch(addTraitSpell({ index: trait.index, spell }));
		},
		[choice, dispatch, trait.index]
	);

	const handleRemove = useCallback(
		(index: string) => {
			dispatch(removeSpell(index));
			dispatch(removeTraitSpell({ index: trait.index, spell: index }));
		},
		[dispatch, trait.index]
	);

	const handleReset = useCallback(() => {
		for (const { index } of choice.from.options
			.map(option => option.item)
			.filter(({ index }) => selectValues.includes(index))) {
			dispatch(removeSpell(index));
			dispatch(removeTraitSpell({ index: trait.index, spell: index }));
		}
	}, [choice, selectValues, dispatch, trait.index]);

	const selects = [
		<div key={`${trait.index}-spell-selector`} className={classes.container}>
			<div className={classes.label}>
				{selectValues.filter(value => value !== 'blank').length}/{choice.choose}{' '}
				spells selected
			</div>
			<div className={classes['spell-selector-container']}>
				{choice.from.options
					.filter(
						({ item: { index } }) =>
							!spells.map(({ index }) => index).includes(index) ||
							selectValues.includes(index)
					)
					.map(option => (
						<SpellSelector
							key={`${trait.index}-${option.item.index}`}
							trait={trait}
							spell={option.item}
							onAdd={() => handleAdd(option.item.index)}
							onRemove={() => handleRemove(option.item.index)}
							selectValues={selectValues}
						/>
					))}
			</div>
		</div>
	];

	return (
		<ChoiceSelector
			label={`${trait.name}: select ${choice.choose} spell${
				choice.choose > 1 ? 's' : ''
			}`}
			selects={selects}
			onReset={handleReset}
			isSelected={!selectValues.includes('blank')}
		/>
	);
};

export default SpellChoiceSelector;
