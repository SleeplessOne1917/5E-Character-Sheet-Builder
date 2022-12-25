'use client';

import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useMemo,
	useState
} from 'react';
import {
	EditingClassState,
	ProficiencyChoice,
	ProficiencyOptionType,
	ProficiencySuboptionType,
	addProficiencyChoice,
	addProficiencyChoiceOption,
	addProficiencyChoiceOptionSuboption,
	removeProficiencyChoice,
	removeProficiencyChoiceOption,
	removeProficiencyChoiceOptionSuboption,
	setProficiencyChoiceChoose,
	setProficiencyChoiceOptionChoose,
	setProficiencyChoiceOptionProficiency,
	setProficiencyChoiceOptionProficiencyType,
	setProficiencyChoiceOptionSuboptionChoose,
	setProficiencyChoiceOptionSuboptionProficiency,
	setProficiencyChoiceOptionSuboptionProficiencyType,
	setProficiencyChoiceOptionSuboptionType,
	setProficiencyChoiceOptionType
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { ProficiencyType, SrdProficiencyItem } from '../../../../types/srd';

import Button from '../../../Button/Button';
import { Item } from '../../../../types/db/item';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import Option from '../../../Select/Option';
import RemoveButton from '../../../RemoveButton/RemoveButton';
import Select from '../../../Select/Select/Select';
import { getProficiencyTypeName } from '../../../../services/proficiencyTypeService';
import styles from './ProficiencyChoices.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type ProficiencyOptionsProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	proficiencies: SrdProficiencyItem[];
};

const suboptionTypeOptions: Option[] = [
	{ label: 'Proficiency', value: 'proficiency' },
	{ label: 'Proficiency Type', value: 'type' }
];

const optionTypeOptions: Option[] = [
	...suboptionTypeOptions,
	{ label: 'Choice', value: 'choice' }
];

const chooseErrorMessage = 'Choose is required';
const proficiencyErrorMessage = 'Proficiency is required';
const optionsErrorMessage = 'Must have at least 1 option';
const proficiencyTypeErrorMessage = 'Proficiency type is required';

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
							: proficiencies.find(
									({ index }) => index === option.proficiency?.id
							  )?.type ?? null
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
									proficiencies.find(
										({ index }) => index === op?.proficiency?.id
									)?.type ?? null
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
				prev.filter((_, i) => i !== index)
			);
			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.filter((_, i) => i !== index)
			);

			const newChoices = values.proficiencyChoices?.filter(
				(_, i) => i !== index
			);

			setFieldTouched(getChoiceStr(index), undefined, false);

			setFieldValue(
				'proficiencyChoices',
				(newChoices?.length ?? 0) > 0 ? newChoices : undefined,
				false
			);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			values.proficiencyChoices
		]
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

	const getSuboptionError = useCallback(
		function get<T>(
			choiceIndex: number,
			optionIndex: number,
			suboptionIndex: number
		) {
			return getOptionError<{ options: Item[] }>(choiceIndex, optionIndex)
				?.options
				? (getOptionError<{ options: Item[] }>(choiceIndex, optionIndex)!
						.options![suboptionIndex] as FormikErrors<T>)
				: undefined;
		},
		[getOptionError]
	);

	const getSuboptionTouched = useCallback(
		function get<T>(
			choiceIndex: number,
			optionIndex: number,
			suboptionIndex: number
		) {
			return getOptionTouched<{ options: Item[] }>(choiceIndex, optionIndex)
				?.options
				? (getOptionTouched<{ options: Item[] }>(choiceIndex, optionIndex)!
						.options![suboptionIndex] as FormikTouched<T>)
				: undefined;
		},
		[getOptionTouched]
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

			const oldOptions = values.proficiencyChoices![index].options;
			const field = `${getChoiceStr(index)}.options`;

			setFieldValue(
				field,
				[...oldOptions, { optionType: 'proficiency' }],
				false
			);

			if (oldOptions.length === 0) {
				setFieldError(field, undefined);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			values.proficiencyChoices,
			setFieldError
		]
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

			const newOptions = values.proficiencyChoices![choiceIndex].options.filter(
				(_, i) => i !== optionIndex
			);

			const field = `${getChoiceStr(choiceIndex)}.options`;

			setFieldValue(field, newOptions, false);

			if (newOptions.length === 0) {
				setFieldTouched(field, true, false);
				setFieldError(field, optionsErrorMessage);
			}
		},
		[
			values.proficiencyChoices,
			dispatch,
			setFieldValue,
			shouldUseReduxStore,
			setFieldTouched,
			setFieldError
		]
	);

	const getChoiceOptionsError = useCallback(
		(index: number) =>
			typeof getChoiceError(index)?.options === 'string'
				? optionsErrorMessage
				: undefined,
		[getChoiceError]
	);

	const getChoiceOptionsTouched = useCallback(
		(index: number) =>
			getChoiceTouched(index)?.options &&
			typeof getChoiceTouched(index)?.options === 'boolean',
		[getChoiceTouched]
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

	const getHandleOptionProficiencyProficiencyTypeChange = useCallback(
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

	const getOptionChooseError = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionError<{ choose: number }>(choiceIndex, optionIndex)?.choose
				? chooseErrorMessage
				: undefined,
		[getOptionError]
	);

	const getOptionChooseTouched = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionTouched<{ choose: number }>(choiceIndex, optionIndex)?.choose,
		[getOptionTouched]
	);

	const getHandleOptionChooseChange = useCallback(
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

	const getHandleOptionChooseChangeBlur = useCallback(
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

	const getOptionProficiencyTypeError = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionError<{ proficiencyType: string }>(choiceIndex, optionIndex)
				?.proficiencyType
				? proficiencyTypeErrorMessage
				: undefined,
		[getOptionError]
	);

	const getOptionProficiencyTypeTouched = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionTouched<{ proficiencyType: string }>(choiceIndex, optionIndex)
				?.proficiencyType,
		[getOptionTouched]
	);

	const getHandleOptionProficiencyTypeChange = useCallback(
		(choiceIndex: number, optionIndex: number) => (value: string | number) => {
			const newValue = value !== 'blank' ? (value as string) : undefined;

			if (shouldUseReduxStore) {
				dispatch(
					setProficiencyChoiceOptionProficiencyType({
						choiceIndex,
						optionIndex,
						proficiencyType: newValue
					})
				);
			}

			const field = `${getOptionStr(choiceIndex, optionIndex)}.proficiencyType`;
			setFieldValue(field, newValue, false);
			setFieldTouched(field, true, false);
			setFieldError(field, !newValue ? proficiencyTypeErrorMessage : undefined);
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

			const oldOptions =
				values.proficiencyChoices![choiceIndex].options![optionIndex].options ??
				[];
			const field = `${getOptionStr(choiceIndex, optionIndex)}.options`;

			setFieldValue(
				field,
				[...oldOptions, { optionType: 'proficiency' }],
				false
			);

			if (oldOptions.length === 0) {
				setFieldError(field, undefined);
			}
		},
		[
			values.proficiencyChoices,
			setFieldValue,
			dispatch,
			shouldUseReduxStore,
			setFieldError
		]
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

			const newOptions = values.proficiencyChoices![choiceIndex].options![
				optionIndex
			].options?.filter((_, i) => i !== suboptionIndex);
			const field = `${getOptionStr(choiceIndex, optionIndex)}.options`;

			setFieldValue(field, newOptions, false);

			if ((newOptions?.length ?? 0) === 0) {
				setFieldTouched(field, true, false);
				setFieldError(field, optionsErrorMessage);
			}
		},
		[
			values.proficiencyChoices,
			setFieldValue,
			dispatch,
			shouldUseReduxStore,
			setFieldTouched,
			setFieldError
		]
	);

	const getHandleSuboptionTypeChange = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			(value: string | number) => {
				const newValue = value as ProficiencySuboptionType;
				if (
					values.proficiencyChoices![choiceIndex].options[optionIndex].options![
						suboptionIndex
					].optionType !== newValue
				) {
					if (shouldUseReduxStore) {
						dispatch(
							setProficiencyChoiceOptionSuboptionType({
								choiceIndex,
								optionIndex,
								suboptionIndex,
								optionType: newValue
							})
						);
					}

					setFieldValue(
						getSuboptionStr(choiceIndex, optionIndex, suboptionIndex),
						{ optionType: newValue },
						false
					);
				}
			},
		[shouldUseReduxStore, dispatch, setFieldValue, values.proficiencyChoices]
	);

	const getOptionSuboptionsError = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			typeof getOptionError<{ options: object[] }>(choiceIndex, optionIndex)
				?.options === 'string'
				? optionsErrorMessage
				: undefined,
		[getOptionError]
	);

	const getOptionSuboptionsTouched = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionTouched<{ options: object[] }>(choiceIndex, optionIndex)
				?.options &&
			typeof getOptionTouched<{ options: object[] }>(choiceIndex, optionIndex)
				?.options === 'boolean',
		[getOptionTouched]
	);

	const getHandleOptionSuboptionProficiencyProficiencyTypeChange = useCallback(
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
						`${getSuboptionStr(
							choiceIndex,
							optionIndex,
							suboptionIndex
						)}.proficiency`,
						undefined,
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
								.some(option => option?.proficiency?.id === proficiency.index)
					)
					.map<Option>(proficiency => ({
						label: proficiency.name.replace(/Skill: /, ''),
						value: proficiency.index
					}))
					.concat(
						values.proficiencyChoices![choiceIndex].options![optionIndex]
							.options![suboptionIndex].proficiency
							? [
									{
										label: values.proficiencyChoices![choiceIndex].options![
											optionIndex
										].options![suboptionIndex]!.proficiency!.name.replace(
											/Skill: /,
											''
										),
										value:
											values.proficiencyChoices![choiceIndex].options![
												optionIndex
											].options![suboptionIndex]!.proficiency!.id
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

	const getOptionSuboptionProficiencyError = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			getSuboptionError<{ proficiency: Item }>(
				choiceIndex,
				optionIndex,
				suboptionIndex
			)
				? proficiencyErrorMessage
				: undefined,
		[getSuboptionError]
	);

	const getOptionSuboptionProficiencyTouched = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			!!getSuboptionTouched<{ proficiency: Item }>(
				choiceIndex,
				optionIndex,
				suboptionIndex
			)?.proficiency,
		[getSuboptionTouched]
	);

	const getHandleOptionSuboptionProficiencyChange = useCallback(
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

				const field = `${getSuboptionStr(
					choiceIndex,
					optionIndex,
					suboptionIndex
				)}.proficiency`;

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

	const getOptionSuboptionChooseError = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			getSuboptionError<{ choose: number }>(
				choiceIndex,
				optionIndex,
				suboptionIndex
			)?.choose
				? chooseErrorMessage
				: undefined,
		[getSuboptionError]
	);

	const getOptionSuboptionChooseTouched = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			getSuboptionTouched<{ choose: number }>(
				choiceIndex,
				optionIndex,
				suboptionIndex
			)?.choose,
		[getSuboptionTouched]
	);

	const getHandleOptionSuboptionChooseChange = useCallback(
		(
				choiceIndex: number,
				optionIndex: number,
				suboptionIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`${getSuboptionStr(choiceIndex, optionIndex, suboptionIndex)}.choose`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleOptionSuboptionChooseBlur = useCallback(
		(
				choiceIndex: number,
				optionIndex: number,
				suboptionIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setProficiencyChoiceOptionSuboptionChoose({
							choiceIndex,
							optionIndex,
							suboptionIndex,
							choose: newValue
						})
					);
				}

				const field = `${getSuboptionStr(
					choiceIndex,
					optionIndex,
					suboptionIndex
				)}.choose`;
				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? chooseErrorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);

	const getOptionSuboptionProficiencyTypeError = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			getSuboptionError<{ proficiencyType: string }>(
				choiceIndex,
				optionIndex,
				suboptionIndex
			)?.proficiencyType
				? proficiencyTypeErrorMessage
				: undefined,
		[getSuboptionError]
	);

	const getOptionSuboptionProficiencyTypeTouched = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			getSuboptionTouched<{ proficiencyType: string }>(
				choiceIndex,
				optionIndex,
				suboptionIndex
			)?.proficiencyType,
		[getSuboptionTouched]
	);

	const getHandleOptionSuboptionProficiencyTypeChange = useCallback(
		(choiceIndex: number, optionIndex: number, suboptionIndex: number) =>
			(value: string | number) => {
				const newValue = value !== 'blank' ? (value as string) : undefined;

				if (shouldUseReduxStore) {
					dispatch(
						setProficiencyChoiceOptionSuboptionProficiencyType({
							choiceIndex,
							optionIndex,
							suboptionIndex,
							proficiencyType: newValue
						})
					);
				}

				const field = `${getSuboptionStr(
					choiceIndex,
					optionIndex,
					suboptionIndex
				)}.proficiencyType`;
				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(
					field,
					!newValue ? proficiencyTypeErrorMessage : undefined
				);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);

	return (
		<section className={styles.container}>
			<h2>Proficiency Choices</h2>
			{(values.proficiencyChoices?.length ?? 0) > 0 && (
				<div className={styles['choices-container']}>
					{values.proficiencyChoices?.map(({ choose, options }, i) => (
						<div key={i} className={styles.choice}>
							<RemoveButton onClick={getHandleRemoveProficiencyChoice(i)} />
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
								<div
									className={`${styles['from-label-container']}${
										(clickedSubmit || getChoiceOptionsTouched(i)) &&
										getChoiceOptionsError(i)
											? ` ${styles.error}`
											: ''
									}`}
								>
									<div className={styles['from-label']}>From</div>
									{(clickedSubmit || getChoiceOptionsTouched(i)) &&
										getChoiceOptionsError(i) && (
											<div className={styles['error-message']}>
												{getChoiceOptionsError(i)}
											</div>
										)}
								</div>
								<div className={styles['options-container']}>
									{options?.map((option, j) => (
										<div key={j} className={styles.option}>
											<RemoveButton onClick={getHandleRemoveOption(i, j)} />
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
														onChange={getHandleOptionProficiencyProficiencyTypeChange(
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
											{option.optionType === 'type' && (
												<>
													<NumberTextInput
														id={`${getOptionStr(i, j)}.choose`}
														label="Choose"
														error={getOptionChooseError(i, j)}
														touched={
															clickedSubmit || getOptionChooseTouched(i, j)
														}
														value={option.choose}
														onChange={getHandleOptionChooseChange(i, j)}
														onBlur={getHandleOptionChooseChangeBlur(i, j)}
													/>
													<Select
														id={`${getOptionStr(i, j)}.proficiencyType`}
														label="From"
														error={getOptionProficiencyTypeError(i, j)}
														touched={
															clickedSubmit ||
															getOptionProficiencyTypeTouched(i, j)
														}
														value={option.proficiencyType ?? 'blank'}
														options={proficiencyTypeOptions}
														onChange={getHandleOptionProficiencyTypeChange(
															i,
															j
														)}
													/>
												</>
											)}
											{option.optionType === 'choice' && (
												<div className={styles['nested-choice-container']}>
													<div className={styles['choose-container']}>
														<NumberTextInput
															id={`${getOptionStr(i, j)}.choose`}
															label="Choose"
															error={getOptionChooseError(i, j)}
															touched={
																clickedSubmit || getOptionChooseTouched(i, j)
															}
															value={option.choose}
															onChange={getHandleOptionChooseChange(i, j)}
															onBlur={getHandleOptionChooseChangeBlur(i, j)}
														/>
													</div>
													<div className={styles['from-container']}>
														<div
															className={`${styles['from-label-container']}${
																(clickedSubmit ||
																	getOptionSuboptionsTouched(i, j)) &&
																getOptionSuboptionsError(i, j)
																	? ` ${styles.error}`
																	: ''
															}`}
														>
															<div className={styles['option-from-label']}>
																From
															</div>
															{(clickedSubmit ||
																getOptionSuboptionsTouched(i, j)) &&
																getOptionSuboptionsError(i, j) && (
																	<div className={styles['error-message']}>
																		{getOptionSuboptionsError(i, j)}
																	</div>
																)}
														</div>
														<div className={styles['options-container']}>
															{option.options?.map((op, k) => (
																<div key={k} className={styles['sub-option']}>
																	<RemoveButton
																		onClick={getHandleOptionRemoveSuboption(
																			i,
																			j,
																			k
																		)}
																	/>
																	<Select
																		id={`${getSuboptionStr(
																			i,
																			j,
																			k
																		)}.optionType`}
																		options={suboptionTypeOptions}
																		value={op.optionType}
																		label="Option Type"
																		onChange={getHandleSuboptionTypeChange(
																			i,
																			j,
																			k
																		)}
																	/>
																	{op.optionType === 'proficiency' && (
																		<>
																			<Select
																				id={`${getSuboptionStr(
																					i,
																					j,
																					k
																				)}.proficiencyType`}
																				label="Proficiency Type"
																				options={proficiencyTypeOptions}
																				value={
																					optionsOptionsSelectedProficiencyTypes[
																						i
																					][j][k] ?? 'blank'
																				}
																				onChange={getHandleOptionSuboptionProficiencyProficiencyTypeChange(
																					i,
																					j,
																					k
																				)}
																			/>
																			{optionsOptionsSelectedProficiencyTypes[
																				i
																			][j][k] && (
																				<Select
																					id={`${getSuboptionStr(
																						i,
																						j,
																						k
																					)}.proficiency`}
																					value={op?.proficiency?.id ?? 'blank'}
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
																					onChange={getHandleOptionSuboptionProficiencyChange(
																						i,
																						j,
																						k
																					)}
																				/>
																			)}
																		</>
																	)}
																	{op.optionType === 'type' && (
																		<>
																			<NumberTextInput
																				id={`${getSuboptionStr(
																					i,
																					j,
																					k
																				)}.choose`}
																				label="Choose"
																				value={op.choose}
																				error={getOptionSuboptionChooseError(
																					i,
																					j,
																					k
																				)}
																				touched={
																					clickedSubmit ||
																					getOptionSuboptionChooseTouched(
																						i,
																						j,
																						k
																					)
																				}
																				onChange={getHandleOptionSuboptionChooseChange(
																					i,
																					j,
																					k
																				)}
																				onBlur={getHandleOptionSuboptionChooseBlur(
																					i,
																					j,
																					k
																				)}
																			/>
																			<Select
																				id={`${getSuboptionStr(
																					i,
																					j,
																					k
																				)}.proficiencyType`}
																				label="From"
																				options={proficiencyTypeOptions}
																				value={op.proficiencyType}
																				error={getOptionSuboptionProficiencyTypeError(
																					i,
																					j,
																					k
																				)}
																				touched={
																					clickedSubmit ||
																					getOptionSuboptionProficiencyTypeTouched(
																						i,
																						j,
																						k
																					)
																				}
																				onChange={getHandleOptionSuboptionProficiencyTypeChange(
																					i,
																					j,
																					k
																				)}
																			/>
																		</>
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
