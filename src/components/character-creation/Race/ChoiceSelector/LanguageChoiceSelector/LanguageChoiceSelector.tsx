import { ChangeEvent, useCallback, useState } from 'react';
import { SrdItem, SrdItemChoice } from '../../../../../types/srd';

import ChoiceSelector from '../ChoiceSelector';
import classes from '../ChoiceSelector.module.css';
import { useAppSelector } from '../../../../../hooks/reduxHooks';

type OptionSelectorProps = {
	choice: SrdItemChoice;
	onReset?: (items: SrdItem[]) => void;
	onApply?: (items: SrdItem[]) => void;
	label: string;
	initialValues?: string[];
};

const LanguageChoiceSelector = ({
	choice,
	onReset = () => {},
	onApply = () => {},
	label,
	initialValues
}: OptionSelectorProps): JSX.Element => {
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

	const languages = useAppSelector(state => state.editingCharacter.languages);

	const handleChangeSelect = useCallback(
		(index: number, event: ChangeEvent<HTMLSelectElement>) =>
			setSelectValues(prevState =>
				prevState.map((value, i) => (i === index ? event.target.value : value))
			),
		[setSelectValues]
	);

	const handleApply = useCallback(
		() =>
			onApply(
				choice.from.options
					.filter(option => selectValues.includes(option.item.index))
					.map(option => option.item)
			),
		[onApply, choice, selectValues]
	);

	const handleReset = useCallback(() => {
		setSelectValues(getInitialSelectValues());
		onReset(
			choice.from.options
				.filter(option => selectValues.includes(option.item.index))
				.map(option => option.item)
		);
	}, [setSelectValues, getInitialSelectValues, onReset, choice, selectValues]);

	const selects: JSX.Element[] = [];

	for (let i = 0; i < choice.choose; ++i) {
		selects.push(
			<select
				value={selectValues[i]}
				aria-label="Select choice"
				onChange={event => handleChangeSelect(i, event)}
				className={classes.select}
				key={i}
			>
				<option value="blank">&mdash;</option>
				{choice.from.options
					.filter(
						option =>
							!(
								selectValues.includes(option.item.index) ||
								languages
									.map(language => language.index)
									.includes(option.item.index)
							) || option.item.index === selectValues[i]
					)
					.map(option => (
						<option value={option.item.index} key={option.item.index}>
							{option.item.name}
						</option>
					))}
			</select>
		);
	}

	return (
		<ChoiceSelector
			label={label}
			selectValues={selectValues}
			selects={selects}
			isSelected={!!initialValues}
			onApply={handleApply}
			onReset={handleReset}
		/>
	);
};

export default LanguageChoiceSelector;
