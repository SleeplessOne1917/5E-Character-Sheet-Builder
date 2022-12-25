'use client';

import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useMemo,
	useState
} from 'react';
import {
	Choose,
	EditingClassState,
	ProficiencyChoice,
	ProficiencyOptionType,
	addProficiencyChoice,
	addProficiencyChoiceOption,
	addProficiencyChoiceOptionSuboption,
	removeProficiencyChoice,
	removeProficiencyChoiceOption,
	removeProficiencyChoiceOptionSuboption,
	setProficiencyChoice,
	setProficiencyChoiceChoose,
	setProficiencyChoiceOptionChoose,
	setProficiencyChoiceOptionProficiency,
	setProficiencyChoiceOptionSuboptionProficiency,
	setProficiencyChoiceOptionType
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { ProficiencyType, SrdProficiencyItem } from '../../../../types/srd';

import Button from '../../../Button/Button';
import { Item } from '../../../../types/db/item';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { getProficiencyTypeName } from '../../../../services/proficiencyTypeService';
import styles from './ProficiencyChoices.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type ProficiencyOptionsProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	proficiencies: SrdProficiencyItem[];
};

const optionTypeOptions: Option[] = [
	{ label: 'Proficiency', value: 'proficiency' },
	{ label: 'Choice', value: 'choice' }
];

const chooseErrorMessage = 'Choose is required';
const proficiencyErrorMessage = 'Proficiency is required';

const getChoiceStr = (index: number) => `proficiencyChoices.${index}`;
const getOptionStr = (choiceIndex: number, optionIndex: number) =>
	`${getChoiceStr(choiceIndex)}.options.${optionIndex}`;
const getSuboptionStr = (
	choiceIndex: number,
	optionIndex: number,
	suboptionIndex: number
) => `${getOptionStr(choiceIndex, optionIndex)}.options.${suboptionIndex}`;

const ProficiencyChoices = ({
	clickedSubmit,
	shouldUseReduxStore,
	proficiencies
}: ProficiencyOptionsProps) => {
	const {
		values,
		errors,
		touched,
		setFieldValue,
		setFieldTouched,
		setFieldError
	} = useFormikContext<EditingClassState>();

	const [optionsSelectedProficiencyTypes, setOptionsSelectedProficiencyTypes] =
		useState(
			values.proficiencyChoices?.map(
				({ options }) =>
					options?.map(option =>
						option.choose || option.options
							? null
							: proficiencies.find(({ index }) => index === option.id)?.type ??
							  null
					) ?? []
			) ?? []
		);
	const [
		optionsOptionsSelectedProficiencyTypes,
		setOptionsOptionsSelectedProficiencyTypes
	] = useState(
		values.proficiencyChoices?.map(
			({ options }) =>
				options?.map(option =>
					option.proficiency?.id || option.proficiency?.name
						? []
						: option.options?.map(
								op =>
									proficiencies.find(({ index }) => index === op?.id)?.type ??
									null
						  ) ?? []
				) ?? []
		) ?? []
	);

	const dispatch = useAppDispatch();

	const proficiencyTypeOptions = useMemo(
		() =>
			proficiencies.reduce<Option[]>(
				(acc, { type }) =>
					!acc.some(({ value }) => value === type)
						? [...acc, { value: type, label: getProficiencyTypeName(type) }]
						: acc,
				[{ label: '\u2014', value: 'blank' }]
			),
		[proficiencies]
	);

	const handleAddProficiencyChoice = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addProficiencyChoice());
		}

		setOptionsSelectedProficiencyTypes(prev => [...prev, []]);
		setOptionsOptionsSelectedProficiencyTypes(prev => [...prev, []]);

		setFieldValue(
			'proficiencyChoices',
			[...(values.proficiencyChoices ?? []), { options: [] }],
			false
		);
	}, [setFieldValue, dispatch, values.proficiencyChoices, shouldUseReduxStore]);

	const getHandleRemoveProficiencyChoice = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeProficiencyChoice(index));
			}

			setOptionsSelectedProficiencyTypes(prev =>
				prev.filter((pts, i) => i !== index)
			);
			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.filter((pts, i) => i !== index)
			);

			const newChoices = values.proficiencyChoices?.filter(
				(val, i) => i !== index
			);

			setFieldValue(
				'proficiencyChoices',
				(newChoices?.length ?? 0) > 0 ? newChoices : undefined,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.proficiencyChoices]
	);

	const getChoiceError = useCallback(
		(index: number) =>
			errors.proficiencyChoices
				? (
						errors.proficiencyChoices as unknown as FormikErrors<
							ProficiencyChoice[]
						>
				  )[index]
				: undefined,
		[errors.proficiencyChoices]
	);

	const getChoiceTouched = useCallback(
		(index: number) =>
			touched.proficiencyChoices
				? (
						touched.proficiencyChoices as unknown as FormikTouched<
							ProficiencyChoice[]
						>
				  )[index]
				: undefined,
		[touched.proficiencyChoices]
	);

	const getOptionError = useCallback(
		function get<T>(choiceIndex: number, optionIndex: number) {
			return getChoiceError(choiceIndex)?.options
				? (getChoiceError(choiceIndex)!.options![
						optionIndex
				  ] as FormikErrors<T>)
				: undefined;
		},
		[getChoiceError]
	);

	const getOptionTouched = useCallback(
		function get<T>(choiceIndex: number, optionIndex: number) {
			return getChoiceTouched(choiceIndex)?.options
				? (getChoiceTouched(choiceIndex)!.options![
						optionIndex
				  ] as FormikTouched<T>)
				: undefined;
		},
		[getChoiceTouched]
	);

	const getChooseError = useCallback(
		(index: number) =>
			getChoiceError(index)?.choose ? chooseErrorMessage : undefined,
		[getChoiceError]
	);

	const getChooseTouched = useCallback(
		(index: number) => getChoiceTouched(index)?.choose,
		[getChoiceTouched]
	);

	const getHandleChooseChange = useCallback(
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`${getChoiceStr(index)}.choose`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleChooseBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(setProficiencyChoiceChoose({ index, choose: newValue }));
				}

				const field = `${getChoiceStr(index)}.choose`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? chooseErrorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldError,
			setFieldTouched
		]
	);

	const getHandleAddOption = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addProficiencyChoiceOption(index));
			}

			setOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeList, i) =>
					i === index ? [...proficiencyTypeList, null] : proficiencyTypeList
				)
			);

			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeListList, i) =>
					i === index
						? [...proficiencyTypeListList, []]
						: proficiencyTypeListList
				)
			);

			setFieldValue(
				`${getChoiceStr(index)}.options`,
				[
					...(values.proficiencyChoices![index].options ?? []),
					{ optionType: 'proficiency' }
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.proficiencyChoices]
	);

	const getHandleRemoveOption = useCallback(
		(choiceIndex: number, optionIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeProficiencyChoiceOption({ choiceIndex, optionIndex }));
			}

			setOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeList, i) =>
					i === choiceIndex
						? proficiencyTypeList.filter((_, j) => j !== optionIndex)
						: proficiencyTypeList
				)
			);

			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeListList, i) =>
					i === choiceIndex
						? proficiencyTypeListList.filter((_, j) => j !== optionIndex)
						: proficiencyTypeListList
				)
			);

			setFieldValue(
				`${getChoiceStr(choiceIndex)}.options`,
				values.proficiencyChoices![choiceIndex].options?.filter(
					(_, i) => i !== optionIndex
				)
			);
		},
		[values.proficiencyChoices, dispatch, setFieldValue, shouldUseReduxStore]
	);

	const getHandleOptionTypeChange = useCallback(
		(choiceIndex: number, optionIndex: number) => (value: string | number) => {
			const newValue = value as ProficiencyOptionType;

			if (
				newValue !==
				values.proficiencyChoices![choiceIndex].options[optionIndex].optionType
			) {
				if (shouldUseReduxStore) {
					dispatch(
						setProficiencyChoiceOptionType({
							choiceIndex,
							optionIndex,
							optionType: newValue
						})
					);
				}

				setFieldValue(
					getOptionStr(choiceIndex, optionIndex),
					{ optionType: newValue },
					false
				);
			}
		},
		[shouldUseReduxStore, setFieldValue, values.proficiencyChoices, dispatch]
	);

	const getHandleOptionProficiencyTypeChange = useCallback(
		(choiceIndex: number, optionIndex: number) => (value: string | number) => {
			const newValue = value !== 'blank' ? (value as ProficiencyType) : null;

			if (
				newValue !== optionsSelectedProficiencyTypes[choiceIndex][optionIndex]
			) {
				if (shouldUseReduxStore) {
					dispatch(
						setProficiencyChoiceOptionProficiency({ choiceIndex, optionIndex })
					);
				}

				setOptionsSelectedProficiencyTypes(prev =>
					prev.map((proficiencyTypes, i) =>
						i === choiceIndex
							? proficiencyTypes.map((proficiencyType, j) =>
									j === optionIndex ? newValue : proficiencyType
							  )
							: proficiencyTypes
					)
				);

				setFieldValue(
					`${getOptionStr(choiceIndex, optionIndex)}.proficiency`,
					undefined,
					false
				);
			}
		},
		[
			dispatch,
			optionsSelectedProficiencyTypes,
			setFieldValue,
			shouldUseReduxStore
		]
	);

	const getOptionProficiencyOptions = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			[{ label: '\u2014', value: 'blank' } as Option].concat(
				proficiencies
					.filter(
						proficiency =>
							proficiency.type ===
								optionsSelectedProficiencyTypes[choiceIndex][optionIndex] &&
							!values.proficiencies.some(
								prof => prof.id === proficiency.index
							) &&
							!values.proficiencyChoices
								?.flatMap(pc => pc.options)
								.some(option => option?.id === proficiency.index) &&
							!values.proficiencyChoices
								?.flatMap(pc => pc.options)
								.flatMap(option => option?.options)
								.some(option => option?.id === proficiency.index)
					)
					.map<Option>(proficiency => ({
						label: proficiency.name.replace(/Skill: /, ''),
						value: proficiency.index
					}))
					.concat(
						values.proficiencyChoices![choiceIndex].options![optionIndex].name
							? [
									{
										label: values.proficiencyChoices![choiceIndex].options![
											optionIndex
										].name?.replace(/Skill: /, ''),
										value:
											values.proficiencyChoices![choiceIndex].options![
												optionIndex
											].id
									} as Option
							  ]
							: []
					)
			),
		[
			proficiencies,
			optionsSelectedProficiencyTypes,
			values.proficiencyChoices,
			values.proficiencies
		]
	);

	const getOptionProficiencyError = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionError<{ proficiency: Item }>(choiceIndex, optionIndex)
				?.proficiency
				? proficiencyErrorMessage
				: undefined,
		[getOptionError]
	);

	const getOptionsProficiencyTouched = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			!!getOptionTouched<{ proficiency: Item }>(choiceIndex, optionIndex)
				?.proficiency,
		[getOptionTouched]
	);

	const getHandleOptionsProficiencyChange = useCallback(
		(choiceIndex: number, optionIndex: number) => (value: string | number) => {
			const foundProficiency = proficiencies.find(
				({ index }) => index === value
			);
			const newProficiencyItem: Item | undefined = foundProficiency
				? ({ id: foundProficiency.index, name: foundProficiency.name } as Item)
				: undefined;

			if (shouldUseReduxStore) {
				dispatch(
					setProficiencyChoiceOptionProficiency({
						choiceIndex,
						optionIndex,
						proficiency: newProficiencyItem
					})
				);
			}

			const field = `${getOptionStr(choiceIndex, optionIndex)}.proficiency`;

			setFieldValue(field, newProficiencyItem, false);
			setFieldTouched(field, true, false);
			setFieldError(
				field,
				!newProficiencyItem ? proficiencyErrorMessage : undefined
			);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			proficiencies,
			setFieldError,
			setFieldTouched
		]
	);

	const getOptionsChooseError = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionError<{ choose: number }>(choiceIndex, optionIndex)?.choose
				? chooseErrorMessage
				: undefined,
		[getOptionError]
	);

	const getOptionsChooseTouched = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionTouched<{ choose: number }>(choiceIndex, optionIndex)?.choose,
		[getOptionTouched]
	);

	const getHandleOptionsChooseChange = useCallback(
		(
				choiceIndex: number,
				optionIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`${getOptionStr(choiceIndex, optionIndex)}.choose`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleOptionsChooseChangeBlur = useCallback(
		(
				choiceIndex: number,
				optionIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setProficiencyChoiceOptionChoose({
							choiceIndex,
							optionIndex,
							choose: newValue
						})
					);
				}

				const field = `${getOptionStr(choiceIndex, optionIndex)}.choose`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? chooseErrorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError
		]
	);

	const getHandleOptionAddSuboption = useCallback(
		(choiceIndex: number, optionIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(
					addProficiencyChoiceOptionSuboption({ choiceIndex, optionIndex })
				);
			}

			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeListList, i) =>
					i === choiceIndex
						? proficiencyTypeListList.map((proficiencyTypeList, j) =>
								j === optionIndex
									? [...proficiencyTypeList, null]
									: proficiencyTypeList
						  )
						: proficiencyTypeListList
				)
			);

			setFieldValue(
				`${getOptionStr(choiceIndex, optionIndex)}.options`,
				[
					...(values.proficiencyChoices![choiceIndex].options![optionIndex]
						.options ?? []),
					null
				],
				false
			);
		},
		[values.proficiencyChoices, setFieldValue, dispatch, shouldUseReduxStore]
	);

	const getHandleOptionRemoveSuboption = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(
					removeProficiencyChoiceOptionSuboption({
						choiceIndex,
						optionIndex,
						suboptionIndex
					})
				);
			}

			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeListList, i) =>
					i === choiceIndex
						? proficiencyTypeListList.map((proficiencyTypeList, j) =>
								j === optionIndex
									? proficiencyTypeList.filter((_, k) => k !== suboptionIndex)
									: proficiencyTypeList
						  )
						: proficiencyTypeListList
				)
			);

			setFieldValue(
				`${getOptionStr(choiceIndex, optionIndex)}.options`,
				values.proficiencyChoices![choiceIndex].options![
					optionIndex
				].options?.filter((_, i) => i !== suboptionIndex),
				false
			);
		},
		[values.proficiencyChoices, setFieldValue, dispatch, shouldUseReduxStore]
	);

	const getHandleOptionSuboptionProficiencyTypeChange = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			(value: string | number) => {
				const newValue = value !== 'blank' ? (value as ProficiencyType) : null;

				if (
					optionsOptionsSelectedProficiencyTypes[choiceIndex][optionIndex][
						suboptionIndex
					] !== newValue
				) {
					if (shouldUseReduxStore) {
						dispatch(
							setProficiencyChoiceOptionSuboptionProficiency({
								choiceIndex,
								optionIndex,
								suboptionIndex
							})
						);
					}

					setOptionsOptionsSelectedProficiencyTypes(prev =>
						prev.map((proficiencyTypeListList, i) =>
							i === choiceIndex
								? proficiencyTypeListList.map((proficiencyTypeList, j) =>
										j === optionIndex
											? proficiencyTypeList.map((pt, k) =>
													k === suboptionIndex ? newValue : pt
											  )
											: proficiencyTypeList
								  )
								: proficiencyTypeListList
						)
					);

					setFieldValue(
						`${getSuboptionStr(choiceIndex, optionIndex, suboptionIndex)}`,
						null,
						false
					);
				}
			},
		[
			dispatch,
			optionsOptionsSelectedProficiencyTypes,
			shouldUseReduxStore,
			setFieldValue
		]
	);

	const getOptionSuboptionsProficiencyOptions = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			[{ label: '\u2014', value: 'blank' } as Option].concat(
				proficiencies
					.filter(
						proficiency =>
							proficiency.type ===
								optionsOptionsSelectedProficiencyTypes[choiceIndex][
									optionIndex
								][suboptionIndex] &&
							!values.proficiencies.some(
								prof => prof.id === proficiency.index
							) &&
							!values.proficiencyChoices
								?.flatMap(pc => pc.options)
								.some(
									option => option?.proficiency?.id === proficiency.index
								) &&
							!values.proficiencyChoices
								?.flatMap(pc => pc.options)
								.flatMap(option => option?.options)
								.some(option => option?.id === proficiency.index)
					)
					.map<Option>(proficiency => ({
						label: proficiency.name.replace(/Skill: /, ''),
						value: proficiency.index
					}))
					.concat(
						values.proficiencyChoices![choiceIndex].options![optionIndex]
							.options![suboptionIndex]
							? [
									{
										label: values.proficiencyChoices![choiceIndex].options![
											optionIndex
										].options![suboptionIndex]!.name.replace(/Skill: /, ''),
										value:
											values.proficiencyChoices![choiceIndex].options![
												optionIndex
											].options![suboptionIndex]!.id
									} as Option
							  ]
							: []
					)
			),
		[
			proficiencies,
			optionsOptionsSelectedProficiencyTypes,
			values.proficiencies,
			values.proficiencyChoices
		]
	);

	const getOptionSuboptionProficiencyTouched = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			getOptionTouched<{ options: Item[] }>(choiceIndex, optionIndex)?.options
				? !!getOptionTouched<{ options: Item[] }>(choiceIndex, optionIndex)!
						.options![suboptionIndex]
				: undefined,
		[getOptionTouched]
	);

	const getOptionSuboptionProficiencyError = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			getOptionError<{ options: Item[] }>(choiceIndex, optionIndex)?.options
				? getOptionError<{ options: Item[] }>(choiceIndex, optionIndex)!
						.options![suboptionIndex]
					? proficiencyErrorMessage
					: undefined
				: undefined,
		[getOptionError]
	);

	const getHandleOptionsOptionsProficiencyChange = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			(value: string | number) => {
				const foundProficiency = proficiencies.find(
					({ index }) => index === value
				);
				const newProficiency: Item | undefined = foundProficiency
					? { id: foundProficiency.index, name: foundProficiency.name }
					: undefined;

				if (shouldUseReduxStore) {
					dispatch(
						setProficiencyChoiceOptionSuboptionProficiency({
							choiceIndex,
							optionIndex,
							suboptionIndex,
							proficiency: newProficiency
						})
					);
				}

				const field = getSuboptionStr(choiceIndex, optionIndex, suboptionIndex);

				setFieldValue(field, newProficiency, false);
				setFieldTouched(field, true, false);
				setFieldError(
					field,
					!foundProficiency ? proficiencyErrorMessage : undefined
				);
			},
		[
			dispatch,
			shouldUseReduxStore,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			proficiencies
		]
	);

	return (
		<section className={styles.container}>
			<h2>Proficiency Choices</h2>
			{(values.proficiencyChoices?.length ?? 0) > 0 && (
				<div className={styles['choices-container']}>
					{values.proficiencyChoices?.map(({ choose, options }, i) => (
						<div key={i} className={styles.choice}>
							<Button
								size="small"
								style={{
									position: 'absolute',
									top: 0,
									right: 0,
									display: 'flex',
									alignItems: 'center',
									marginRight: '-0.1rem',
									marginTop: '-0.1rem',
									borderTopRightRadius: '1rem'
								}}
								onClick={getHandleRemoveProficiencyChoice(i)}
							>
								<XMarkIcon className={styles['close-button-icon']} /> Remove
							</Button>
							<div className={styles['choose-container']}>
								<NumberTextInput
									id={`${getChoiceStr(i)}.choose`}
									label="Choose"
									error={getChooseError(i)}
									touched={clickedSubmit || getChooseTouched(i)}
									value={choose}
									onChange={getHandleChooseChange(i)}
									onBlur={getHandleChooseBlur(i)}
								/>
							</div>
							<div className={styles['from-container']}>
								<div className={styles['from-label']}>From</div>
								<div className={styles['options-container']}>
									{options?.map((option, j) => (
										<div key={j} className={styles.option}>
											<Button
												size="small"
												style={{
													position: 'absolute',
													top: 0,
													right: 0,
													display: 'flex',
													alignItems: 'center',
													marginRight: '-0.1rem',
													marginTop: '-0.1rem',
													borderTopRightRadius: '1rem'
												}}
												onClick={getHandleRemoveOption(i, j)}
											>
												<XMarkIcon className={styles['close-button-icon']} />{' '}
												Remove
											</Button>
											<Select
												options={optionTypeOptions}
												id={`${getOptionStr(i, j)}.optionType`}
												label="Option Type"
												value={option.optionType}
												onChange={getHandleOptionTypeChange(i, j)}
											/>
											{option.optionType === 'proficiency' && (
												<>
													<Select
														id={`${getOptionStr(i, j)}.proficiencyType`}
														options={proficiencyTypeOptions}
														label="Proficiency Type"
														value={
															optionsSelectedProficiencyTypes[i][j] ?? 'blank'
														}
														onChange={getHandleOptionProficiencyTypeChange(
															i,
															j
														)}
													/>
													{optionsSelectedProficiencyTypes[i][j] && (
														<Select
															id={`${getOptionStr(i, j)}.proficiency`}
															options={getOptionProficiencyOptions(i, j)}
															label="Proficiency"
															error={getOptionProficiencyError(i, j)}
															touched={
																clickedSubmit ||
																getOptionsProficiencyTouched(i, j)
															}
															value={option.proficiency?.id ?? 'blank'}
															onChange={getHandleOptionsProficiencyChange(i, j)}
														/>
													)}
												</>
											)}
											{option.optionType === 'choice' && (
												<div className={styles['nested-choice-container']}>
													<div className={styles['choose-container']}>
														<NumberTextInput
															id={`${getOptionStr(i, j)}.choose`}
															label="Choose"
															error={getOptionsChooseError(i, j)}
															touched={
																clickedSubmit || getOptionsChooseTouched(i, j)
															}
															value={option.choose}
															onChange={getHandleOptionsChooseChange(i, j)}
															onBlur={getHandleOptionsChooseChangeBlur(i, j)}
														/>
													</div>
													<div className={styles['from-container']}>
														<div className={styles['option-from-label']}>
															From
														</div>
														<div className={styles['options-container']}>
															{option.options?.map((op, k) => (
																<div key={k} className={styles['sub-option']}>
																	<Button
																		size="small"
																		style={{
																			position: 'absolute',
																			top: 0,
																			right: 0,
																			display: 'flex',
																			alignItems: 'center',
																			marginRight: '-0.1rem',
																			marginTop: '-0.1rem',
																			borderTopRightRadius: '1rem'
																		}}
																		onClick={getHandleOptionRemoveSuboption(
																			i,
																			j,
																			k
																		)}
																	>
																		<XMarkIcon
																			className={styles['close-button-icon']}
																		/>{' '}
																		Remove
																	</Button>
																	<Select
																		id={`${getSuboptionStr(
																			i,
																			j,
																			k
																		)}.proficiencyType`}
																		label="Proficiency Type"
																		options={proficiencyTypeOptions}
																		value={
																			optionsOptionsSelectedProficiencyTypes[i][
																				j
																			][k] ?? 'blank'
																		}
																		onChange={getHandleOptionSuboptionProficiencyTypeChange(
																			i,
																			j,
																			k
																		)}
																	/>
																	{optionsOptionsSelectedProficiencyTypes[i][j][
																		k
																	] && (
																		<Select
																			id={`${getSuboptionStr(
																				i,
																				j,
																				k
																			)}.proficiency`}
																			value={op?.id ?? 'blank'}
																			options={getOptionSuboptionsProficiencyOptions(
																				i,
																				j,
																				k
																			)}
																			label="Proficiency"
																			touched={
																				clickedSubmit ||
																				getOptionSuboptionProficiencyTouched(
																					i,
																					j,
																					k
																				)
																			}
																			error={getOptionSuboptionProficiencyError(
																				i,
																				j,
																				k
																			)}
																			onChange={getHandleOptionsOptionsProficiencyChange(
																				i,
																				j,
																				k
																			)}
																		/>
																	)}
																</div>
															))}
														</div>
														{(option.options?.length ?? 0) < 5 && (
															<Button
																positive
																size="small"
																onClick={getHandleOptionAddSuboption(i, j)}
															>
																Add Option
															</Button>
														)}
													</div>
												</div>
											)}
										</div>
									))}
								</div>
								{(options?.length ?? 0) < 5 && (
									<Button positive size="small" onClick={getHandleAddOption(i)}>
										Add Option
									</Button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
			{(values.proficiencyChoices?.length ?? 0) < 5 && (
				<Button positive onClick={handleAddProficiencyChoice}>
					Add Proficiciency Choice
				</Button>
			)}
		</section>
	);
};

export default ProficiencyChoices;
