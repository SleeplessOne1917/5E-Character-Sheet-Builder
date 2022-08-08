import { SrdSpellItem, SrdSpellItemChoice } from '../../../../../types/srd';
import { useCallback, useState } from 'react';

import ChoiceSelector from '../ChoiceSelector';
import SpellSelector from './SpellSelector/SpellSelector';
import classes from './SpellChoiceSelector.module.css';
import { useAppSelector } from '../../../../../hooks/reduxHooks';

type SpellChoiceSelectorProps = {
	traitName: string;
	choice: SrdSpellItemChoice;
	initialValues?: string[];
	onApply: (items: SrdSpellItem[]) => void;
	onReset: (items: SrdSpellItem[]) => void;
};

const SpellChoiceSelector = ({
	choice,
	traitName,
	initialValues,
	onApply,
	onReset
}: SpellChoiceSelectorProps) => {
	const getInitialSelectValues = useCallback(() => {
		const returnValues: string[] = [];

		for (let i = 0; i < choice.choose; ++i) {
			returnValues.push('blank');
		}

		return returnValues;
	}, [choice]);

	const spells = useAppSelector(state => state.editingCharacter.spells);

	const [selectValues, setSelectValues] = useState<string[]>(
		initialValues ?? getInitialSelectValues()
	);

	const handleAdd = useCallback(
		(index: string) => {
			setSelectValues(
				prevState =>
					prevState.reduce(
						(acc: { replaced: boolean; list: string[] }, cur) => {
							if (!acc.replaced && cur === 'blank') {
								return {
									replaced: true,
									list: [...acc.list, index]
								};
							} else {
								return {
									...acc,
									list: [...acc.list, cur]
								};
							}
						},
						{ replaced: false, list: [] }
					).list
			);
		},
		[setSelectValues]
	);

	const handleRemove = useCallback(
		(index: string) => {
			setSelectValues(prevState =>
				prevState.map(value => (value === index ? 'blank' : value))
			);
		},
		[setSelectValues]
	);

	const handleApply = useCallback(() => {
		onApply(
			choice.from.options
				.map(option => option.item)
				.filter(({ index }) => selectValues.includes(index))
		);
	}, [choice, onApply, selectValues]);

	const handleReset = useCallback(() => {
		onReset(
			choice.from.options
				.map(option => option.item)
				.filter(({ index }) => selectValues.includes(index))
		);
		setSelectValues(getInitialSelectValues());
	}, [choice, onReset, selectValues, setSelectValues, getInitialSelectValues]);

	const selects = [
		<div key={`${traitName}-spell-selector`} className={classes.container}>
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
							key={`${traitName}-${option.item.name}`}
							traitName={traitName}
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
			label={`${traitName}: select ${choice.choose} spell${
				choice.choose > 1 ? 's' : ''
			}`}
			selectValues={selectValues}
			selects={selects}
			onApply={handleApply}
			onReset={handleReset}
			isSelected={!!initialValues}
		/>
	);
};

export default SpellChoiceSelector;
