'use client';

import {
	SrdProficiencyItem,
	SrdProficiencyItemChoice
} from '../../../../../../types/srd';
import {
	addProficiency,
	removeProficiency
} from '../../../../../../redux/features/proficiencies';
import {
	addTraitProficiency,
	removeTraitProficiency
} from '../../../../../../redux/features/raceInfo';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';

import ChoiceSelector from '../ChoiceSelector';
import Select from '../../../../../Select/Select/Select';

type OptionSelectorProps = {
	choice: SrdProficiencyItemChoice;
	traitIndex: string;
	label: string;
};

const ProficiencyChoiceSelector = ({
	choice,
	traitIndex,
	label
}: OptionSelectorProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const selectedProficiencies = useAppSelector(
		state =>
			state.editingCharacter.raceInfo.selectedTraitProficiencies[traitIndex]
	);

	const getInitialSelectValues = useCallback(() => {
		const returnValues: string[] = [];

		for (let i = 0; i < choice.choose; ++i) {
			returnValues.push('blank');
		}

		return returnValues;
	}, [choice]);

	const [selectValues, setSelectValues] = useState<string[]>(
		selectedProficiencies?.map(({ index }) => index) ?? getInitialSelectValues()
	);

	const proficiencies = useAppSelector(
		state => state.editingCharacter.proficiencies
	);

	useEffect(() => {
		if (!selectedProficiencies || selectedProficiencies.length === 0) {
			setSelectValues(getInitialSelectValues());
		}
	}, [setSelectValues, getInitialSelectValues, selectedProficiencies]);

	const handleChangeSelect = useCallback(
		(index: number, selectValue: string) => {
			if (selectValues[index] !== 'blank') {
				dispatch(
					removeTraitProficiency({
						index: traitIndex,
						proficiency: selectValues[index]
					})
				);
				dispatch(removeProficiency(selectValues[index]));
			}

			if (selectValue !== 'blank') {
				const proficiency = (
					choice.from.options.map(option => option.item) as SrdProficiencyItem[]
				).find(prof => prof.index === selectValue) as SrdProficiencyItem;

				dispatch(addTraitProficiency({ index: traitIndex, proficiency }));
				dispatch(addProficiency(proficiency));
			}

			setSelectValues(prev =>
				prev.map((value, i) => (i === index ? selectValue : value))
			);
		},
		[dispatch, selectValues, traitIndex, choice.from.options, setSelectValues]
	);

	const handleReset = useCallback(() => {
		for (const { index } of choice.from.options
			.filter(option => option.item && selectValues.includes(option.item.index))
			.map(option => option.item) as SrdProficiencyItem[]) {
			dispatch(
				removeTraitProficiency({ index: traitIndex, proficiency: index })
			);
			dispatch(removeProficiency(index));
		}

		setSelectValues(getInitialSelectValues());
	}, [
		choice,
		selectValues,
		dispatch,
		traitIndex,
		setSelectValues,
		getInitialSelectValues
	]);

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
								option.item &&
								(!(
									selectValues.includes(option.item.index) ||
									proficiencies
										.map(proficiency => proficiency.index)
										.includes(option.item.index)
								) ||
									option.item.index === selectValues[i])
						)
						.map(option => ({
							value: option.item?.index as string,
							label: option.item?.name.replace(/Skill: /g, '') as string
						}))
				)}
			/>
		);
	}

	return (
		<ChoiceSelector
			label={label}
			selects={selects}
			isSelected={!selectValues.includes('blank')}
			onReset={handleReset}
		/>
	);
};

export default ProficiencyChoiceSelector;
