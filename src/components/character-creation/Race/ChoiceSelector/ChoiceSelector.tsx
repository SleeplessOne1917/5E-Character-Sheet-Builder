import { ChangeEvent, useCallback, useState } from 'react';

import Button from '../../../Button/Button';
import { SrdItem } from '../../../../types/srd';
import classes from './ChoiceSelector.module.css';

type OptionSelectorProps = {
	choice: {
		choose: number;
		from: {
			options: { item: SrdItem }[];
		};
	};
	onClear: () => void;
	onApply: (items: SrdItem[]) => void;
	label: string;
	initialValues?: string[];
};

const ChoiceSelector = ({
	choice,
	onClear,
	onApply,
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
		setSelectValues(initialValues ?? getInitialSelectValues());
	}, [setSelectValues, getInitialSelectValues, initialValues]);

	const handleClear = useCallback(() => {
		setSelectValues(getInitialSelectValues());
		onClear();
	}, [setSelectValues, getInitialSelectValues, onClear]);

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
							!selectValues.includes(option.item.index) ||
							option.item.index === selectValues[i]
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
		<div className={classes.selector} data-testid="choice-selector">
			<div className={classes.label}>{label}</div>
			<div className={classes['select-div']}>{selects}</div>
			<div className={classes['button-div']}>
				<Button size="small" onClick={handleClear}>
					Clear
				</Button>
				<Button size="small" onClick={handleReset}>
					Reset
				</Button>
				<Button
					size="small"
					positive
					onClick={handleApply}
					disabled={selectValues.includes('blank')}
				>
					Apply
				</Button>
			</div>
		</div>
	);
};

export default ChoiceSelector;
