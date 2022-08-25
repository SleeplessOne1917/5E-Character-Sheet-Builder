import { SrdItem, SrdItemChoice } from '../../../../../types/srd';
import {
	addLanguage,
	removeLanguage
} from '../../../../../redux/features/languages';
import {
	addRaceLanguage,
	addTraitLanguage,
	removeRaceLanguage,
	removeTraitLanguage
} from '../../../../../redux/features/raceInfo';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../hooks/reduxHooks';
import { useCallback, useEffect, useState } from 'react';

import ChoiceSelector from '../ChoiceSelector';
import Select from '../../../../Select/Select';

type OptionSelectorProps = {
	choice: SrdItemChoice;
	label: string;
	traitIndex?: string;
};

const LanguageChoiceSelector = ({
	choice,
	label,
	traitIndex
}: OptionSelectorProps): JSX.Element => {
	const dispatch = useAppDispatch();
	const selectedLanguages = useAppSelector(
		state => state.editingCharacter.raceInfo.selectedLanguages
	);
	const traitSelectedLanguages = useAppSelector(state =>
		traitIndex
			? state.editingCharacter.raceInfo.selectedTraitLanguages[traitIndex]
			: undefined
	);
	const languages = useAppSelector(state => state.editingCharacter.languages);
	const getInitialSelectValues = useCallback(() => {
		const returnValues: string[] = [];

		for (let i = 0; i < choice.choose; ++i) {
			returnValues.push('blank');
		}

		return returnValues;
	}, [choice]);

	const [selectValues, setSelectValues] = useState<string[]>(
		selectedLanguages?.map(({ index }) => index) ?? getInitialSelectValues()
	);

	useEffect(() => {
		if (
			(!traitIndex && (!selectedLanguages || selectedLanguages.length === 0)) ||
			(traitIndex &&
				(!traitSelectedLanguages || traitSelectedLanguages.length === 0))
		) {
			setSelectValues(getInitialSelectValues());
		}
	}, [
		setSelectValues,
		getInitialSelectValues,
		traitIndex,
		selectedLanguages,
		traitSelectedLanguages
	]);

	const handleChangeSelect = useCallback(
		(index: number, selectValue: string) => {
			const language =
				selectValue !== 'blank'
					? (choice.from.options
							.map(option => option.item)
							.find(option => option.index === selectValue) as SrdItem)
					: undefined;

			if (selectValues[index] !== 'blank') {
				dispatch(removeLanguage(selectValues[index]));
			}

			if (language) {
				dispatch(addLanguage(language));
			}

			if (!traitIndex) {
				if (selectValues[index] !== 'blank') {
					dispatch(removeRaceLanguage(selectValues[index]));
				}

				if (language) {
					dispatch(addRaceLanguage(language));
				}
			} else {
				if (selectValues[index] !== 'blank') {
					dispatch(
						removeTraitLanguage({
							index: traitIndex,
							language: selectValues[index]
						})
					);
				}

				if (language) {
					dispatch(addTraitLanguage({ index: traitIndex, language }));
				}
			}

			setSelectValues(prevState =>
				prevState.map((value, i) => (i === index ? selectValue : value))
			);
		},
		[setSelectValues, dispatch, choice, traitIndex, selectValues]
	);

	const handleReset = useCallback(() => {
		for (const { index } of choice.from.options
			.filter(option => selectValues.includes(option.item.index))
			.map(option => option.item)) {
			dispatch(removeLanguage(index));
			if (!traitIndex) {
				dispatch(removeRaceLanguage(index));
			} else {
				dispatch(removeTraitLanguage({ index: traitIndex, language: index }));
			}
		}

		setSelectValues(getInitialSelectValues());
	}, [
		setSelectValues,
		getInitialSelectValues,
		choice,
		selectValues,
		traitIndex,
		dispatch
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
			selects={selects}
			isSelected={!selectValues.includes('blank')}
			onReset={handleReset}
		/>
	);
};

export default LanguageChoiceSelector;
