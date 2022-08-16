import { AbilityBonus, AbilityBonusChoice } from '../../../../../types/srd';
import { useCallback, useState } from 'react';

import ChoiceSelector from '../ChoiceSelector';
import Select from '../../../../Select/Select';
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
		(index: number, selectValue: string) =>
			setSelectValues(prevState =>
				prevState.map((value, i) => (i === index ? selectValue : value))
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
			<Select
				value={selectValues[i]}
				onChange={value => handleChangeSelect(i, value as string)}
				key={i}
				options={[{ value: 'blank', label: '\u2014' }].concat(
					choice.from.options
						.filter(
							option =>
								!selectValues.includes(option.ability_score.index) ||
								option.ability_score.index === selectValues[i]
						)
						.map(option => ({
							value: option.ability_score.index,
							label: `${allSameBonus.isSame ? '' : `+${option.bonus} `}
				${option.ability_score.full_name}`
						}))
				)}
			/>
		);
	}

	const label = `Add${
		allSameBonus.isSame ? ` +${allSameBonus.value}` : ''
	} to ${choice.choose} ability score${choice.choose > 1 ? 's' : ''}`;

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

export default AbilityBonusChoiceSelector;
