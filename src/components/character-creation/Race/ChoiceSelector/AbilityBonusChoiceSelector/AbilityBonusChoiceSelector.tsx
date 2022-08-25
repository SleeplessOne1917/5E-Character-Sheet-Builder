import { AbilityBonus, AbilityBonusChoice } from '../../../../../types/srd';
import { setRaceAbilityBonus } from '../../../../../redux/features/raceInfo';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../hooks/reduxHooks';
import { useCallback, useState } from 'react';

import AbilityScores from '../../../../../types/abilityScores';
import ChoiceSelector from '../ChoiceSelector';
import Select from '../../../../Select/Select';
import { getIsAllBonusesSame } from '../../../../../services/abilityBonusService';
import { updateRaceBonus } from '../../../../../redux/features/abilityScores';

type OptionSelectorProps = {
	choice: AbilityBonusChoice;
};

const AbilityBonusChoiceSelector = ({
	choice
}: OptionSelectorProps): JSX.Element => {
	const selectedAbilityScoreBonuses = useAppSelector(
		state => state.editingCharacter.raceInfo.selectedAbilityScoreBonuses
	);
	const getInitialSelectValues = useCallback(() => {
		const returnValues: string[] = [];

		for (let i = 0; i < choice.choose; ++i) {
			returnValues.push('blank');
		}

		return returnValues;
	}, [choice]);
	const allSameBonus = getIsAllBonusesSame(choice.from.options);

	const [selectValues, setSelectValues] = useState<string[]>(
		selectedAbilityScoreBonuses?.map(
			bonus => bonus?.ability_score.index ?? 'blank'
		) ?? getInitialSelectValues()
	);

	const dispatch = useAppDispatch();

	const handleChangeSelect = useCallback(
		(index: number, selectValue: string) => {
			dispatch(setRaceAbilityBonus({ index, abilityBonus: null }));

			if (selectValues[index] !== 'blank') {
				dispatch(
					updateRaceBonus({
						value: null,
						abilityIndex: selectValues[index] as AbilityScores
					})
				);
			}

			if (selectValue !== 'blank') {
				const bonus = choice.from.options.find(
					option => option.ability_score.index === selectValue
				) as AbilityBonus;
				dispatch(setRaceAbilityBonus({ index, abilityBonus: bonus }));
				dispatch(
					updateRaceBonus({
						value: bonus.bonus,
						abilityIndex: selectValue as AbilityScores
					})
				);
			}

			setSelectValues(prevState =>
				prevState.map((value, i) => (i === index ? selectValue : value))
			);
		},
		[setSelectValues, dispatch, choice, selectValues]
	);

	const handleReset = useCallback(() => {
		for (const index of choice.from.options
			.filter(option => selectValues.includes(option.ability_score.index))
			.map(bonus => bonus.ability_score.index)) {
			dispatch(updateRaceBonus({ value: null, abilityIndex: index }));
			dispatch(
				setRaceAbilityBonus({
					index: selectValues.indexOf(index),
					abilityBonus: null
				})
			);
		}
		setSelectValues(getInitialSelectValues());
	}, [setSelectValues, getInitialSelectValues, choice, selectValues, dispatch]);

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
			selects={selects}
			isSelected={!selectValues.includes('blank')}
			onReset={handleReset}
		/>
	);
};

export default AbilityBonusChoiceSelector;
