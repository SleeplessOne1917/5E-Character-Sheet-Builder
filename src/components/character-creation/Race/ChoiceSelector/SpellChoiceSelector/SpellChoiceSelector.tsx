import { useCallback, useState } from 'react';
import { SrdSpellItemChoice } from '../../../../../types/srd';
import ChoiceSelector from '../ChoiceSelector';
import classes from './SpellChoiceSelector.module.css';
import SpellSelector from './SpellSelector/SpellSelector';

type SpellChoiceSelectorProps = {
	traitName: string;
	choice: SrdSpellItemChoice;
	initialValues?: string[];
};

const SpellChoiceSelector = ({
	choice,
	traitName,
	initialValues
}: SpellChoiceSelectorProps) => {
	const getInitialSelectValues = useCallback(() => {
		const returnValues: string[] = [];

		for (let i = 0; i < choice.choose; ++i) {
			returnValues.push('blank');
		}

		return returnValues;
	}, [choice]);

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

	const selects = [
		<div key={`${traitName}-spell-selector`} className={classes.container}>
			<div className={classes.label}>
				{selectValues.filter(value => value !== 'blank').length}/{choice.choose}{' '}
				spells selected
			</div>
			<div className={classes['spell-selector-container']}>
				{choice.from.options.map(option => (
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
		/>
	);
};

export default SpellChoiceSelector;
