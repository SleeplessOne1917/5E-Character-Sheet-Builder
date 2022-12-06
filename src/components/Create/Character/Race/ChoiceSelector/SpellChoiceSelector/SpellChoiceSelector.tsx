'use client';

import {
	SrdItem,
	SrdSpellItem,
	SrdSpellItemChoice
} from '../../../../../../types/srd';
import {
	addSpell,
	removeSpell
} from '../../../../../../redux/features/spellcasting';
import {
	addTraitSpell,
	removeTraitSpell
} from '../../../../../../redux/features/raceInfo';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';

import ChoiceSelector from '../ChoiceSelector';
import { Spell } from '../../../../../../types/characterSheetBuilderAPI';
import SpellSelector from '../../../../../Spells/SpellSelector/SpellSelector';
import classes from './SpellChoiceSelector.module.css';
import { mapSpellItem } from '../../../../../../services/spellsService';

type SpellChoiceSelectorProps = {
	trait: SrdItem;
	choice: SrdSpellItemChoice;
};

const SpellChoiceSelector = ({ choice, trait }: SpellChoiceSelectorProps) => {
	const selectedSpells = useAppSelector(
		state => state.editingCharacter.raceInfo.selectedTraitSpells[trait.index]
	);
	const dispatch = useAppDispatch();

	const getInitialSelectValues = useCallback((): string[] => {
		const returnValues: string[] = [];

		for (let i = 0; i < choice.choose; ++i) {
			if (selectedSpells && i < selectedSpells.length) {
				returnValues.push(selectedSpells[i].id);
			} else {
				returnValues.push('blank');
			}
		}

		return returnValues;
	}, [choice, selectedSpells]);

	const spells = useAppSelector(
		state => state.editingCharacter.spellcasting.spells
	);

	const [selectValues, setSelectValues] = useState<string[]>(
		getInitialSelectValues()
	);

	useEffect(() => {
		setSelectValues(getInitialSelectValues());
	}, [setSelectValues, getInitialSelectValues]);

	const handleAdd = useCallback(
		(value: string) => {
			const spell = mapSpellItem(
				choice.from.options
					.map(option => option.item)
					.find(option => option.index === value) as SrdSpellItem
			);

			dispatch(addSpell(spell));
			dispatch(addTraitSpell({ index: trait.index, spell: spell as Spell }));
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
		<div
			key={`${trait.index}-spell-selector`}
			className={`${classes.container}${
				!selectValues.includes('blank') ? ` ${classes.selected}` : ''
			}`}
		>
			<div className={classes.label}>
				{selectValues.filter(value => value !== 'blank').length}/{choice.choose}{' '}
				spells selected
			</div>
			<div className={classes['spell-selector-container']}>
				{choice.from.options
					.filter(
						({ item: { index } }) =>
							!spells.map(({ id }) => id).includes(index) ||
							selectValues.includes(index)
					)
					.map(option => (
						<SpellSelector
							key={`${trait.index}-${option.item.index}`}
							item={trait}
							spell={mapSpellItem(option.item)}
							onAdd={() => handleAdd(option.item.index)}
							onRemove={() => handleRemove(option.item.index)}
							selectValues={selectValues}
							parentSelected={!selectValues.includes('blank')}
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
