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
	addProficiencyChoice,
	removeProficiencyChoice,
	setProficiencies,
	setProficiencyChoice
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { ProficiencyType, SrdProficiencyItem } from '../../../../types/srd';

import Button from '../../../Button/Button';
import { Item } from '../../../../types/db/item';
import MultiSelect from '../../../Select/MultiSelect/MultiSelect';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { getProficiencyTypeName } from '../../../../services/proficiencyTypeService';
import styles from './ProficienciesAndProficiencyChoices.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type ProficienciesAndProficiencyOptionsProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	proficiencies: SrdProficiencyItem[];
};

type OptionType = 'item' | 'choose';

const optionTypeOptions: Option[] = [
	{ label: 'Proficiency', value: 'item' },
	{ label: 'Choice', value: 'choice' }
];

const optionProficiencyErrorMessage = 'Option proficiency is required';

type ProficiencyGroup = {
	type: ProficiencyType;
	proficiencies: SrdProficiencyItem[];
};

const ProficienciesAndProficiencyChoices = ({
	clickedSubmit,
	shouldUseReduxStore,
	proficiencies
}: ProficienciesAndProficiencyOptionsProps) => {
	const {
		values,
		errors,
		touched,
		setFieldValue,
		setFieldTouched,
		setFieldError
	} = useFormikContext<EditingClassState>();
	const [selectedProficienciesType, setSelectedProficienciesType] =
		useState<string | null>(null);
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
					option.id || option.name
						? []
						: option.options?.map(
								op =>
									proficiencies.find(({ index }) => index === op.id)?.type ??
									null
						  ) ?? []
				) ?? []
		) ?? []
	);

	const dispatch = useAppDispatch();

	const [optionTypes, setOptionTypes] = useState(
		values.proficiencyChoices?.map(
			({ options }) =>
				options?.map<OptionType>(option =>
					option.choose || option.options ? 'choose' : 'item'
				) ?? []
		) ?? []
	);

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

	const proficienciesValues = useMemo(
		() => values.proficiencies.map(proficiency => proficiency.id),
		[values]
	);

	const proficienciesError = useMemo(
		() =>
			typeof errors.proficiencies === 'string' || !errors.proficiencies
				? errors.proficiencies
				: typeof errors.proficiencies[0] === 'string'
				? errors.proficiencies[0]
				: errors.proficiencies[0].name,
		[errors]
	);

	const proficienciesOptions = useMemo(
		() =>
			proficiencies
				.filter(
					proficiency =>
						proficiency.type === selectedProficienciesType &&
						!values.proficiencyChoices
							?.flatMap(choice => choice.options)
							.some(option => option?.id === proficiency.index) &&
						!values.proficiencyChoices
							?.flatMap(choice => choice.options)
							.flatMap(option => option?.options)
							.some(option => option?.id === proficiency.index)
				)
				.map<Option>(proficiency => ({
					label: proficiency.name.replace(/Skill: /, ''),
					value: proficiency.index
				})),
		[proficiencies, selectedProficienciesType, values.proficiencyChoices]
	);

	const proficiencyGroups = useMemo(
		() =>
			values.proficiencies.reduce<ProficiencyGroup[]>((acc, cur) => {
				const proficiency = proficiencies.find(prof => prof.index === cur.id)!;

				if (
					acc.length > 0 &&
					acc.some(group => group.type === proficiency.type)
				) {
					return acc.map(group =>
						group.type === proficiency.type
							? {
									...group,
									proficiencies: [...group.proficiencies, proficiency]
							  }
							: group
					);
				} else {
					return [
						...acc,
						{
							type: proficiency.type,
							proficiencies: [proficiency]
						} as ProficiencyGroup
					];
				}
			}, []),
		[values.proficiencies, proficiencies]
	);

	const handleChangeProficienciesType = useCallback(
		(value: string | number) => {
			const newValue = value !== 'blank' ? (value as string) : null;
			setSelectedProficienciesType(newValue);
		},
		[]
	);

	const handleProficienciesChange = useCallback(
		(values: (string | number)[]) => {
			const newValues = proficiencies
				.filter(proficiency => values.includes(proficiency.index))
				.map<Item>(proficiency => ({
					id: proficiency.index,
					name: proficiency.name
				}));

			if (shouldUseReduxStore) {
				dispatch(setProficiencies(newValues));
			}

			setFieldValue('proficiencies', newValues, false);
			setFieldTouched('proficiencies', true, false);
			setFieldError(
				'proficiencies',
				newValues.length === 0 ? 'Must have at least 1 proficiency' : undefined
			);
		},
		[
			proficiencies,
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);

	const handleAddProficiencyChoice = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addProficiencyChoice());
		}

		setOptionTypes(prev => [...prev, []]);
		setOptionsSelectedProficiencyTypes(prev => [...prev, []]);
		setOptionsOptionsSelectedProficiencyTypes(prev => [...prev, []]);

		setFieldValue(
			'proficiencyChoices',
			[...(values.proficiencyChoices ?? []), {}],
			false
		);
	}, [setFieldValue, dispatch, values.proficiencyChoices, shouldUseReduxStore]);

	const getHandleRemoveProficiencyChoice = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeProficiencyChoice(index));
			}

			setOptionTypes(prev => prev.filter((ots, i) => i !== index));
			setOptionsSelectedProficiencyTypes(prev =>
				prev.filter((pts, i) => i !== index)
			);
			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.filter((pts, i) => i !== index)
			);

			setFieldValue(
				'proficiencyChoices',
				values.proficiencyChoices?.filter((val, i) => i !== index),
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.proficiencyChoices]
	);

	const getChooseError = useCallback(
		(index: number) =>
			errors.proficiencyChoices
				? (
						errors.proficiencyChoices as unknown as FormikErrors<
							ProficiencyChoice[]
						>
				  )[index]?.choose
				: undefined,
		[errors.proficiencyChoices]
	);

	const getChooseTouched = useCallback(
		(index: number) =>
			touched.proficiencyChoices
				? (
						touched.proficiencyChoices as unknown as FormikTouched<
							ProficiencyChoice[]
						>
				  )[index]?.choose
				: undefined,
		[touched.proficiencyChoices]
	);

	const getHandleChooseChange = useCallback(
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`proficiencyChoices.${index}.choose`,
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
					const proficiencyChoice: ProficiencyChoice = {
						...values.proficiencyChoices![index],
						choose: newValue
					};
					dispatch(
						setProficiencyChoice({
							index,
							proficiencyChoice
						})
					);
				}

				setFieldValue(`proficiencyChoices.${index}.choose`, newValue, false);
				setFieldTouched(`proficiencyChoices.${index}.choose`, true, false);
				setFieldError(
					`proficiencyChoices.${index}.choose`,
					!newValue ? 'Must have number of proficiencies to choose' : undefined
				);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldError,
			setFieldTouched,
			values.proficiencyChoices
		]
	);

	const getHandleAddOption = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				const proficiencyChoice: ProficiencyChoice = {
					...values.proficiencyChoices![index],
					options: [...(values.proficiencyChoices![index].options ?? []), {}]
				};

				dispatch(setProficiencyChoice({ index, proficiencyChoice }));
			}

			setOptionTypes(prev =>
				prev.map((ots, i) => (i === index ? [...ots, 'item'] : ots))
			);

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
				`proficiencyChoices.${index}.options`,
				[...(values.proficiencyChoices![index].options ?? []), {}],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.proficiencyChoices]
	);

	const getHandleRemoveOption = useCallback(
		(i: number, j: number) => () => {
			if (shouldUseReduxStore) {
				const proficiencyChoice: ProficiencyChoice = {
					...values.proficiencyChoices![i],
					options: values.proficiencyChoices![i].options?.filter(
						(option, k) => k !== j
					)
				};

				dispatch(setProficiencyChoice({ index: i, proficiencyChoice }));
			}

			setOptionTypes(prev =>
				prev.map((ots, k) => (k === i ? ots.filter((ot, l) => l !== j) : ots))
			);

			setOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeList, k) =>
					k === i
						? proficiencyTypeList.filter((pt, l) => l !== j)
						: proficiencyTypeList
				)
			);

			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeListList, k) =>
					k === i
						? proficiencyTypeListList.filter((ptl, l) => l !== j)
						: proficiencyTypeListList
				)
			);

			setFieldValue(
				`proficiencyChoices.${i}.options`,
				values.proficiencyChoices![i].options?.filter((option, k) => k !== j)
			);
		},
		[values.proficiencyChoices, dispatch, setFieldValue, shouldUseReduxStore]
	);

	const getHandleOptionTypeChange = useCallback(
		(i: number, j: number) => (value: string | number) => {
			const newOption = { ...values.proficiencyChoices![i].options![j] };
			if ((value as OptionType) === 'item') {
				delete newOption.choose;
				delete newOption.options;
			} else {
				delete newOption.id;
				delete newOption.name;
			}

			if (shouldUseReduxStore) {
				const proficiencyChoice: ProficiencyChoice = {
					...values.proficiencyChoices![i],
					options: values.proficiencyChoices![i].options?.map((option, k) =>
						k === j ? newOption : option
					)
				};

				dispatch(setProficiencyChoice({ index: i, proficiencyChoice }));
			}

			setFieldValue(`proficiencyChoices.${i}.options.${j}`, newOption, false);

			setOptionTypes(prev =>
				prev.map((optionTypeList, k) =>
					k === i
						? optionTypeList.map((optionType, l) =>
								l === j ? (value as OptionType) : optionType
						  )
						: optionTypeList
				)
			);
		},
		[shouldUseReduxStore, setFieldValue, values.proficiencyChoices, dispatch]
	);

	const getHandleOptionProficiencyTypeChange = useCallback(
		(i: number, j: number) => (value: string | number) => {
			const newValue = value !== 'blank' ? (value as ProficiencyType) : null;

			if (newValue !== optionsSelectedProficiencyTypes[i][j]) {
				if (shouldUseReduxStore) {
					const proficiencyChoice: ProficiencyChoice = {
						...values.proficiencyChoices![i],
						options: values.proficiencyChoices![i].options?.map((option, k) =>
							k === j ? {} : option
						)
					};

					dispatch(setProficiencyChoice({ index: i, proficiencyChoice }));
				}

				setFieldValue(`proficiencyChoices.${i}.options.${j}`, {}, false);
			}

			setOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypes, k) =>
					k === i
						? proficiencyTypes.map((proficiencyType, l) =>
								l === j ? newValue : proficiencyType
						  )
						: proficiencyTypes
				)
			);
		},
		[
			dispatch,
			optionsSelectedProficiencyTypes,
			setFieldValue,
			shouldUseReduxStore,
			values.proficiencyChoices
		]
	);

	const getOptionsProficiencyOptions = useCallback(
		(i: number, j: number) =>
			[{ label: '\u2014', value: 'blank' } as Option].concat(
				proficiencies
					.filter(
						proficiency =>
							proficiency.type === optionsSelectedProficiencyTypes[i][j] &&
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
						values.proficiencyChoices![i].options![j].name
							? [
									{
										label: values.proficiencyChoices![i].options![
											j
										].name?.replace(/Skill: /, ''),
										value: values.proficiencyChoices![i].options![j].id
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

	const getOptionsProficiencyError = useCallback(
		(i: number, j: number) =>
			errors.proficiencyChoices
				? (
						errors.proficiencyChoices as unknown as FormikErrors<
							ProficiencyChoice[]
						>
				  )[i]?.options
					? (
							(
								errors.proficiencyChoices as unknown as FormikErrors<
									ProficiencyChoice[]
								>
							)[i]?.options as unknown as FormikErrors<Item[]>
					  )[j]?.name
						? optionProficiencyErrorMessage
						: undefined
					: undefined
				: undefined,
		[errors.proficiencyChoices]
	);

	const getOptionsProficiencyTouched = useCallback(
		(i: number, j: number) =>
			touched.proficiencyChoices
				? (
						touched.proficiencyChoices as unknown as FormikTouched<
							ProficiencyChoice[]
						>
				  )[i]?.options
					? (
							(
								touched.proficiencyChoices as unknown as FormikTouched<
									ProficiencyChoice[]
								>
							)[i]?.options as unknown as FormikTouched<Item[]>
					  )[j]?.name
					: undefined
				: undefined,
		[touched.proficiencyChoices]
	);

	const getHandleOptionsProficiencyChange = useCallback(
		(i: number, j: number) => (value: string | number) => {
			const foundProficiency = proficiencies.find(
				({ index }) => index === value
			);
			const newProficiencyItem: Partial<Item> = foundProficiency
				? ({ id: foundProficiency.index, name: foundProficiency.name } as Item)
				: {};

			if (shouldUseReduxStore) {
				const proficiencyChoice: ProficiencyChoice = {
					...values.proficiencyChoices![i],
					options: values.proficiencyChoices![i].options?.map((option, k) =>
						k === j ? newProficiencyItem : option
					)
				};
				dispatch(setProficiencyChoice({ index: i, proficiencyChoice }));
			}

			setFieldValue(
				`proficiencyChoices.${i}.options.${j}`,
				newProficiencyItem,
				false
			);
			setFieldTouched(`proficiencyChoices.${i}.options.${j}.name`, true, false);
			setFieldError(
				`proficiencyChoices.${i}.options.${j}.name`,
				!foundProficiency ? optionProficiencyErrorMessage : undefined
			);
		},
		[
			values.proficiencyChoices,
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			proficiencies,
			setFieldError,
			setFieldTouched
		]
	);

	const getOptionsChooseError = useCallback(
		(i: number, j: number) =>
			errors.proficiencyChoices
				? (
						errors.proficiencyChoices as unknown as FormikErrors<
							ProficiencyChoice[]
						>
				  )[i]?.options
					? (
							(
								errors.proficiencyChoices as unknown as FormikErrors<
									ProficiencyChoice[]
								>
							)[i]?.options as unknown as FormikErrors<Choose[]>
					  )[j]?.choose
					: undefined
				: undefined,
		[errors.proficiencyChoices]
	);

	const getOptionsChooseTouched = useCallback(
		(i: number, j: number) =>
			touched.proficiencyChoices
				? (
						touched.proficiencyChoices as unknown as FormikTouched<
							ProficiencyChoice[]
						>
				  )[i]?.options
					? (
							(
								touched.proficiencyChoices as unknown as FormikTouched<
									ProficiencyChoice[]
								>
							)[i]?.options as unknown as FormikTouched<Choose[]>
					  )[j]?.choose
					: undefined
				: undefined,
		[touched.proficiencyChoices]
	);

	const getHandleOptionsChooseChange = useCallback(
		(i: number, j: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`proficiencyChoices.${i}.options.${j}.choose`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleOptionsChooseChangeBlur = useCallback(
		(i: number, j: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					const proficiencyChoice: ProficiencyChoice = {
						...values.proficiencyChoices![i],
						options: values.proficiencyChoices![i].options?.map((option, k) =>
							k === j ? { ...(option as Choose), choose: newValue } : option
						)
					};

					dispatch(setProficiencyChoice({ index: i, proficiencyChoice }));
				}

				setFieldValue(
					`proficiencyChoices.${i}.options.${j}.choose`,
					newValue,
					false
				);
				setFieldTouched(
					`proficiencyChoices.${i}.options.${j}.choose`,
					true,
					false
				);
				setFieldError(
					`proficiencyChoices.${i}.options.${j}.choose`,
					!newValue ? 'Option choose is required' : undefined
				);
			},
		[
			values.proficiencyChoices,
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError
		]
	);

	const getHandleOptionsAddOption = useCallback(
		(i: number, j: number) => () => {
			if (shouldUseReduxStore) {
				const proficiencyChoice: ProficiencyChoice = {
					...values.proficiencyChoices![i],
					options: values.proficiencyChoices![i].options?.map((option, k) =>
						k === j
							? {
									...(option as Choose),
									options: [...(option.options ?? []), {}]
							  }
							: option
					)
				};

				dispatch(setProficiencyChoice({ index: i, proficiencyChoice }));
			}

			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeListList, l) =>
					l === i
						? proficiencyTypeListList.map((proficiencyTypeList, m) =>
								m === j ? [...proficiencyTypeList, null] : proficiencyTypeList
						  )
						: proficiencyTypeListList
				)
			);

			setFieldValue(
				`proficiencyChoices.${i}.options.${j}.options`,
				[...(values.proficiencyChoices![i].options![j].options ?? []), {}],
				false
			);
		},
		[values.proficiencyChoices, setFieldValue, dispatch, shouldUseReduxStore]
	);

	const getHandleOptionsRemoveOption = useCallback(
		(i: number, j: number, k: number) => () => {
			if (shouldUseReduxStore) {
				const proficiencyChoice: ProficiencyChoice = {
					...values.proficiencyChoices![i],
					options: values.proficiencyChoices![i].options?.map((option, l) =>
						l === j
							? {
									...(option as Choose),
									options: option.options?.filter((op, m) => m !== k)
							  }
							: option
					)
				};

				dispatch(setProficiencyChoice({ index: i, proficiencyChoice }));
			}

			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeListList, l) =>
					l === i
						? proficiencyTypeListList.map((proficiencyTypeList, m) =>
								m === j
									? proficiencyTypeList.filter((pt, n) => n !== k)
									: proficiencyTypeList
						  )
						: proficiencyTypeListList
				)
			);

			setFieldValue(
				`proficiencyChoices.${i}.options.${j}.options`,
				values.proficiencyChoices![i].options![j].options?.filter(
					(op, l) => l !== k
				),
				false
			);
		},
		[values.proficiencyChoices, setFieldValue, dispatch, shouldUseReduxStore]
	);

	const getHandleOptionsOptionsProficiencyTypeChange = useCallback(
		(i: number, j: number, k: number) => (value: string | number) => {
			const newValue = value !== 'blank' ? (value as ProficiencyType) : null;

			if (optionsOptionsSelectedProficiencyTypes[i][j][k] !== newValue) {
				const newOptions = values.proficiencyChoices![i].options![
					j
				].options?.map((option, l) => (l === k ? {} : option));
				if (shouldUseReduxStore) {
					const proficiencyChoice: ProficiencyChoice = {
						...values.proficiencyChoices![i],
						options: values.proficiencyChoices![i].options?.map((option, l) =>
							l === j ? { ...(option as Choose), options: newOptions } : option
						)
					};

					dispatch(setProficiencyChoice({ index: i, proficiencyChoice }));
				}

				setFieldValue(
					`proficiencyChoices.${i}.options.${j}.options.${k}`,
					{},
					false
				);
			}

			setOptionsOptionsSelectedProficiencyTypes(prev =>
				prev.map((proficiencyTypeListList, l) =>
					l === i
						? proficiencyTypeListList.map((proficiencyTypeList, m) =>
								m === j
									? proficiencyTypeList.map((pt, n) =>
											n === k ? newValue : pt
									  )
									: proficiencyTypeList
						  )
						: proficiencyTypeListList
				)
			);
		},
		[
			dispatch,
			optionsOptionsSelectedProficiencyTypes,
			shouldUseReduxStore,
			values.proficiencyChoices,
			setFieldValue
		]
	);

	const getOptionsOptionsProficiencyOptions = useCallback(
		(i: number, j: number, k: number) =>
			[{ label: '\u2014', value: 'blank' } as Option].concat(
				proficiencies
					.filter(
						proficiency =>
							proficiency.type ===
								optionsOptionsSelectedProficiencyTypes[i][j][k] &&
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
						values.proficiencyChoices![i].options![j].options![k].name
							? [
									{
										label: values.proficiencyChoices![i].options![j].options![
											k
										].name?.replace(/Skill: /, ''),
										value:
											values.proficiencyChoices![i].options![j].options![k].id
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

	const getOptionsOptionsProficiencyTouched = useCallback(
		(i: number, j: number, k: number) =>
			touched.proficiencyChoices
				? (
						touched.proficiencyChoices as unknown as FormikTouched<
							ProficiencyChoice[]
						>
				  )[i]!.options
					? (
							(
								touched.proficiencyChoices as unknown as FormikTouched<
									ProficiencyChoice[]
								>
							)[i]!.options as unknown as FormikTouched<Choose[]>
					  )[j]!.options
						? (
								(
									(
										touched.proficiencyChoices as unknown as FormikTouched<
											ProficiencyChoice[]
										>
									)[i]!.options as unknown as FormikTouched<Choose[]>
								)[j]!.options as unknown as FormikTouched<Item[]>
						  )[k]?.name
						: undefined
					: undefined
				: undefined,
		[touched.proficiencyChoices]
	);

	const getOptionsOptionsProficiencyError = useCallback(
		(i: number, j: number, k: number) =>
			errors.proficiencyChoices
				? (
						errors.proficiencyChoices as unknown as FormikErrors<
							ProficiencyChoice[]
						>
				  )[i]?.options
					? (
							(
								errors.proficiencyChoices as unknown as FormikErrors<
									ProficiencyChoice[]
								>
							)[i]?.options as unknown as FormikErrors<Choose[]>
					  )[j]?.options
						? (
								(
									(
										errors.proficiencyChoices as unknown as FormikErrors<
											ProficiencyChoice[]
										>
									)[i]!.options as unknown as FormikErrors<Choose[]>
								)[j]!.options as unknown as FormikErrors<Item[]>
						  )[k]?.name
							? optionProficiencyErrorMessage
							: undefined
						: undefined
					: undefined
				: undefined,
		[errors.proficiencyChoices]
	);

	const getHandleOptionsOptionsProficiencyChange = useCallback(
		(i: number, j: number, k: number) => (value: string | number) => {
			const foundProficiency = proficiencies.find(
				({ index }) => index === value
			);
			const newProficiency: Partial<Item> = foundProficiency
				? { id: foundProficiency.index, name: foundProficiency.name }
				: {};

			if (shouldUseReduxStore) {
				const proficiencyChoice: ProficiencyChoice = {
					...values.proficiencyChoices![i],
					options: values.proficiencyChoices![i].options?.map((option, l) =>
						l === j
							? {
									...(option as Choose),
									options: option.options?.map((op, m) =>
										m === k ? newProficiency : op
									)
							  }
							: option
					)
				};

				dispatch(setProficiencyChoice({ index: i, proficiencyChoice }));
			}

			setFieldValue(
				`proficiencyChoices.${i}.options.${j}.options.${k}`,
				newProficiency,
				false
			);
			setFieldTouched(
				`proficiencyChoices.${i}.options.${j}.options.${k}.name`,
				true,
				false
			);
			setFieldError(
				`proficiencyChoices.${i}.options.${j}.options.${k}.name`,
				!foundProficiency ? optionProficiencyErrorMessage : undefined
			);
		},
		[
			dispatch,
			shouldUseReduxStore,
			values.proficiencyChoices,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			proficiencies
		]
	);

	return (
		<div className={styles.container}>
			<div
				className={`${styles['proficiencies-container']}${
					(clickedSubmit || touched.proficiencies) && proficienciesError
						? ` ${styles.error}`
						: ''
				}`}
			>
				<div className={styles.title}>Proficiencies</div>
				<div className={styles.proficiencies}>
					<Select
						id="proficiencies-type"
						label="Proficiency Type"
						value={selectedProficienciesType ?? 'blank'}
						options={proficiencyTypeOptions}
						onChange={handleChangeProficienciesType}
					/>
					{selectedProficienciesType && (
						<MultiSelect
							id="proficiencies"
							label="Proficiencies"
							values={proficienciesValues}
							error={proficienciesError}
							touched={clickedSubmit || !!touched.proficiencies}
							options={proficienciesOptions}
							onSelect={handleProficienciesChange}
						/>
					)}
					{proficiencyGroups.length > 0 && (
						<div className={styles['proficiency-groups']}>
							{proficiencyGroups.map(group => (
								<div key={group.type} className={styles['proficiency-group']}>
									<div className={styles['proficiency-group-title']}>
										{getProficiencyTypeName(group.type)}
									</div>
									<ul className={styles['proficiency-group-list']}>
										{group.proficiencies.map(prof => (
											<li key={prof.index}>
												{prof.name.replace(/Skill: /, '')}
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					)}
					{(clickedSubmit || touched.proficiencies) && proficienciesError && (
						<div className={styles['error-message']}>{proficienciesError}</div>
					)}
				</div>
			</div>
			<div className={styles['proficiency-choices-container']}>
				<div className={styles.title}>Proficiency Choices</div>
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
							<NumberTextInput
								id={`proficiencyChoices.${i}.choose`}
								label="Choose"
								error={getChooseError(i)}
								touched={clickedSubmit || getChooseTouched(i)}
								value={choose}
								onChange={getHandleChooseChange(i)}
								onBlur={getHandleChooseBlur(i)}
							/>
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
												id={`proficiencyChoices.${i}.options.${j}.optionType`}
												label="Option Type"
												value={optionTypes[i][j]}
												onChange={getHandleOptionTypeChange(i, j)}
											/>
											{optionTypes[i][j] === 'item' ? (
												<>
													<Select
														id={`proficiencyChoices.${i}.options.${j}.proficiencyType`}
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
															id={`proficiencyChoices.${i}.options.${j}.proficiency`}
															options={getOptionsProficiencyOptions(i, j)}
															label="Proficiency"
															error={getOptionsProficiencyError(i, j)}
															touched={
																clickedSubmit ||
																getOptionsProficiencyTouched(i, j)
															}
															value={option.id ?? 'blank'}
															onChange={getHandleOptionsProficiencyChange(i, j)}
														/>
													)}
												</>
											) : (
												<>
													<NumberTextInput
														id={`proficiencyChoices.${i}.options.${j}.choose`}
														label="Choose"
														error={getOptionsChooseError(i, j)}
														touched={
															clickedSubmit || getOptionsChooseTouched(i, j)
														}
														value={option.choose}
														onChange={getHandleOptionsChooseChange(i, j)}
														onBlur={getHandleOptionsChooseChangeBlur(i, j)}
													/>
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
																		onClick={getHandleOptionsRemoveOption(
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
																		id={`proficiencyChoices.${i}.options.${j}.options.${k}.proficiencyType`}
																		label="Proficiency Type"
																		options={proficiencyTypeOptions}
																		value={
																			optionsOptionsSelectedProficiencyTypes[i][
																				j
																			][k] ?? 'blank'
																		}
																		onChange={getHandleOptionsOptionsProficiencyTypeChange(
																			i,
																			j,
																			k
																		)}
																	/>
																	{optionsOptionsSelectedProficiencyTypes[i][j][
																		k
																	] && (
																		<Select
																			id={`proficiencyChoices.${i}.options.${j}.options.${k}.proficiency`}
																			value={op.id ?? 'blank'}
																			options={getOptionsOptionsProficiencyOptions(
																				i,
																				j,
																				k
																			)}
																			label="Proficiency"
																			touched={
																				clickedSubmit ||
																				getOptionsOptionsProficiencyTouched(
																					i,
																					j,
																					k
																				)
																			}
																			error={getOptionsOptionsProficiencyError(
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
																onClick={getHandleOptionsAddOption(i, j)}
															>
																Add Option
															</Button>
														)}
													</div>
												</>
											)}
										</div>
									))}
								</div>
								{(values.proficiencyChoices?.length ?? 0) < 5 && (
									<Button positive size="small" onClick={getHandleAddOption(i)}>
										Add Option
									</Button>
								)}
							</div>
						</div>
					))}
				</div>
				{(values.proficiencyChoices?.length ?? 0) < 5 && (
					<Button positive onClick={handleAddProficiencyChoice}>
						Add Proficiciency Choice
					</Button>
				)}
			</div>
		</div>
	);
};

export default ProficienciesAndProficiencyChoices;
