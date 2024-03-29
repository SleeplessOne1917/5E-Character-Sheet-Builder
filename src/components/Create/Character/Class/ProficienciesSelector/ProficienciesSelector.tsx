'use client';

import {
	ProficiencyType,
	SrdProficiencyItem,
	SrdProficiencyItemChoice
} from '../../../../../types/srd';
import {
	addProficiency,
	removeProficiency
} from '../../../../../redux/features/proficiencies';
import {
	useAppDispatch,
	useAppSelector
} from '../../../../../hooks/reduxHooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Option from '../../../../Select/Option';
import Select from '../../../../Select/Select/Select';
import classes from './ProficienciesSelector.module.css';
import { getProficiencyTypeName } from '../../../../../services/proficiencyTypeService';
import { setClassProficiencies } from '../../../../../redux/features/classInfo';

type ProficienciesSelectorProps = {
	choice: SrdProficiencyItemChoice;
	proficienciesIndex: number;
};

const ProficienciesSelector = ({
	choice,
	proficienciesIndex
}: ProficienciesSelectorProps) => {
	const classProficienciesList = useAppSelector(
		state => state.editingCharacter.classInfo.proficiencies
	);
	const allProficiencies = useAppSelector(
		state => state.editingCharacter.proficiencies
	);

	const dispatch = useAppDispatch();

	const hasSelectedProficiencies = useMemo(
		() =>
			classProficienciesList.length > proficienciesIndex &&
			classProficienciesList[proficienciesIndex].length > 0,
		[classProficienciesList, proficienciesIndex]
	);

	const hasNestedChoices = useMemo(
		() => choice.from.options.some(option => option.choice),
		[choice.from.options]
	);

	const defaultType = useMemo(() => {
		let type = 'blank';

		if (
			hasNestedChoices &&
			hasSelectedProficiencies &&
			classProficienciesList[proficienciesIndex].some(prof => prof)
		) {
			type = classProficienciesList[proficienciesIndex].filter(prof => prof)[0]
				?.type as string;
		}

		return type;
	}, [
		hasSelectedProficiencies,
		proficienciesIndex,
		classProficienciesList,
		hasNestedChoices
	]);

	const [selectedType, setSelectedType] = useState(defaultType);

	const types = useMemo(() => {
		const types: Option[] = [];

		if (hasNestedChoices) {
			for (const option of choice.from.options) {
				const type = option.choice?.from.options[0].item
					?.type as ProficiencyType;

				types.push({ value: type, label: getProficiencyTypeName(type) });
			}
		}

		return types;
	}, [choice.from.options, hasNestedChoices]);

	const values = useMemo(() => {
		if (hasSelectedProficiencies) {
			return classProficienciesList[proficienciesIndex].map(
				prof => prof?.index ?? null
			);
		}

		let choose: number;
		if (selectedType !== 'blank') {
			choose = choice.from.options.find(option =>
				option.choice?.from.options.some(o => o.item?.type === selectedType)
			)?.choice?.choose as number;
		} else {
			choose = choice.choose;
		}

		const values: (string | null)[] = [];

		for (let i = 0; i < choose; ++i) {
			values.push(null);
		}

		return values;
	}, [
		choice.choose,
		classProficienciesList,
		choice.from.options,
		proficienciesIndex,
		selectedType,
		hasSelectedProficiencies
	]);

	useEffect(() => {
		if (!classProficienciesList[proficienciesIndex]) {
			dispatch(
				setClassProficiencies({
					index: proficienciesIndex,
					proficiencies: values as null[]
				})
			);
		}
	}, [dispatch, proficienciesIndex, values, classProficienciesList]);

	const typeString = useMemo(() => {
		if (selectedType !== 'blank') {
			return types.find(({ value }) => value === selectedType)?.label as string;
		} else if (types.length > 0) {
			return 'Proficiencies';
		} else {
			return getProficiencyTypeName(
				choice.from.options[0].item?.type as ProficiencyType
			);
		}
	}, [choice.from.options, selectedType, types]);

	const proficiencies = useMemo(() => {
		let proficiencies: SrdProficiencyItem[] = [];

		if (selectedType !== 'blank') {
			proficiencies = choice.from.options
				.find(option =>
					option.choice?.from.options.some(o => o.item?.type === selectedType)
				)
				?.choice?.from.options.map(({ item }) => item) as SrdProficiencyItem[];
		} else if (types.length === 0) {
			proficiencies = choice.from.options.map(
				({ item }) => item as SrdProficiencyItem
			);
		}

		return proficiencies;
	}, [choice.from.options, selectedType, types]);

	const handleChange = useCallback(
		(index: number, value: SrdProficiencyItem | null) => {
			if (value) {
				dispatch(addProficiency(value));
			} else if (values[index]) {
				dispatch(removeProficiency(values[index] as string));
			}

			dispatch(
				setClassProficiencies({
					index: proficienciesIndex,
					proficiencies: [
						...classProficienciesList[proficienciesIndex].slice(0, index),
						value,
						...classProficienciesList[proficienciesIndex].slice(index + 1)
					]
				})
			);
		},
		[dispatch, classProficienciesList, proficienciesIndex, values]
	);

	const selectors = useMemo(
		() =>
			values.map((value, index) => (
				<div
					className={`${classes['proficiency-container']}${
						value ? ` ${classes.selected}` : ''
					}`}
					key={index}
				>
					<Select
						id="select-proficiency"
						labelFontSize="1.3rem"
						label={`Select ${
							typeString.endsWith('s') ? typeString.slice(0, -1) : typeString
						}`}
						value={value ? value : 'blank'}
						options={[{ value: 'blank', label: '\u2014' } as Option].concat(
							proficiencies
								.filter(
									prof =>
										prof.index === value ||
										!(
											allProficiencies.some(p => p.index === prof.index) ||
											values.includes(prof.index)
										)
								)
								.map(prof => ({
									value: prof.index,
									label: prof.name.replace(/.*:\s+/, '')
								}))
						)}
						onChange={value =>
							handleChange(
								index,
								value !== 'blank'
									? (proficiencies.find(
											prof => prof.index === (value as string)
									  ) as SrdProficiencyItem)
									: null
							)
						}
					/>
				</div>
			)),
		[allProficiencies, handleChange, proficiencies, typeString, values]
	);

	const handleSelectType = useCallback(
		(type: ProficiencyType | 'blank') => {
			setSelectedType(type);
			dispatch(
				setClassProficiencies({
					index: proficienciesIndex,
					proficiencies: []
				})
			);
		},
		[setSelectedType, dispatch, proficienciesIndex]
	);

	return (
		<div data-testid="proficiencies-selector" className={classes.container}>
			<h3 className={classes.heading}>{typeString}</h3>
			<div className={classes['selected-text']}>
				{values.filter(skill => skill).length}/{values.length} {typeString}{' '}
				Selected
			</div>
			{types.length > 0 ? (
				<>
					<div className={classes['types-container']}>
						<div
							className={`${classes['proficiency-container']}${
								selectedType !== 'blank' ? ` ${classes.selected}` : ''
							}`}
						>
							<label id="select-proficiency-type" className={classes.label}>
								Select Proficiency Type
							</label>
							<Select
								options={[{ value: 'blank', label: '\u2014' } as Option].concat(
									types
								)}
								value={selectedType}
								onChange={value =>
									handleSelectType(value as ProficiencyType | 'blank')
								}
							/>
						</div>
					</div>
					{selectedType !== 'blank' && (
						<div className={classes['proficiencies-container']}>
							{selectors}
						</div>
					)}
				</>
			) : (
				<div className={classes['proficiencies-container']}>{selectors}</div>
			)}
		</div>
	);
};

export default ProficienciesSelector;
