import { ChangeEvent, useCallback, useState } from 'react';

import Button from '../../../../Button/Button';
import { AbilityBonus, AbilityBonusChoice } from '../../../../../types/srd';
import classes from '../ChoiceSelector.module.css';
import { getIsAllBonusesSame } from '../../../../../services/abilityBonusService';

type OptionSelectorProps = {
	choice: AbilityBonusChoice;
	onReset?: (items: AbilityBonus[]) => void;
	onApply?: (items: AbilityBonus[]) => void;
	initialValues?: string[];
};

const AbilityBonusChoiceSelector = ({
	choice,
	onReset = () => {},
	onApply = () => {},
	initialValues
}: OptionSelectorProps): JSX.Element => {
	const getInitialSelectValues = useCallback(() => {
		const returnValues: string[] = [];

		for (let i = 0; i < choice.choose; ++i) {
			returnValues.push('blank');
		}

		return returnValues;
	}, [choice]);
	const allSameBonus = getIsAllBonusesSame(choice.from.options);

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
				choice.from.options.filter(option =>
					selectValues.includes(option.ability_score.index)
				)
			),
		[onApply, choice, selectValues]
	);

	const handleReset = useCallback(() => {
		setSelectValues(getInitialSelectValues());
		onReset(
			choice.from.options.filter(option =>
				selectValues.includes(option.ability_score.index)
			)
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
							!selectValues.includes(option.ability_score.index) ||
							option.ability_score.index === selectValues[i]
					)
					.map(option => (
						<option
							value={option.ability_score.index}
							key={option.ability_score.index}
						>
							{allSameBonus.isSame ? '' : `+${option.bonus} `}
							{option.ability_score.full_name}
						</option>
					))}
			</select>
		);
	}

	const label = `Add${
		allSameBonus.isSame ? ` +${allSameBonus.value}` : ''
	} to ${choice.choose} ability score${choice.choose > 1 ? 's' : ''}`;

	return (
		<div
			className={`${classes.selector}${
				initialValues ? ` ${classes.selected}` : ''
			}`}
			data-testid="choice-selector"
		>
			<div className={classes.label}>{label}</div>
			<div className={classes['select-div']}>{selects}</div>
			<div className={classes['button-div']}>
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
			{initialValues && (
				<svg className={classes['dice-icon']}>
					<use xlinkHref="/Icons.svg#logo" />
				</svg>
			)}
		</div>
	);
};

export default AbilityBonusChoiceSelector;
