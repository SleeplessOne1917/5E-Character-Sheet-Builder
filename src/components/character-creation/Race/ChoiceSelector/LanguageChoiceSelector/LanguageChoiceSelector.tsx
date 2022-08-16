import { SrdItem, SrdItemChoice } from '../../../../../types/srd';
import { useCallback, useState } from 'react';

import ChoiceSelector from '../ChoiceSelector';
import Select from '../../../../Select/Select';
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
		(index: number, selectValue: string) =>
			setSelectValues(prevState =>
				prevState.map((value, i) => (i === index ? selectValue : value))
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
			<Select
				key={i}
				value={selectValues[i]}
				onChange={value => handleChangeSelect(i, value as string)}
				options={[{ value: 'blank', label: '\u2014' }].concat(
					choice.from.options
						.filter(
							option =>
								!(
									selectValues.includes(option.item.index) ||
									languages
										.map(language => language.index)
										.includes(option.item.index)
								) || option.item.index === selectValues[i]
						)
						.map(option => ({
							value: option.item.index,
							label: option.item.name
						}))
				)}
			/>
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
