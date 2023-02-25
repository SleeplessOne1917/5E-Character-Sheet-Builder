'use client';

import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useMemo
} from 'react';
import {
	EditingClassState,
	FeatureState,
	PrerequisiteType,
	SubfeatureChoiceType,
	addFeature,
	addFeaturePerLevelBonus,
	addFeaturePerLevelDice,
	addFeaturePerLevelDistance,
	addFeaturePerLevelMultiDice,
	addFeaturePerLevelNumber,
	addFeatureSubfeatureOptions,
	addFeatureSubfeatureOptionsOption,
	addFeatureSubfeatureOptionsOptionPrerequisite,
	removeFeature,
	removeFeaturePerLevelBonus,
	removeFeaturePerLevelDice,
	removeFeaturePerLevelDistance,
	removeFeaturePerLevelMultiDice,
	removeFeaturePerLevelNumber,
	removeFeatureSubfeatureOptions,
	removeFeatureSubfeatureOptionsOption,
	removeFeatureSubfeatureOptionsOptionPrerequisite,
	setFeatureDescription,
	setFeatureLevel,
	setFeatureName,
	setFeaturePerLevelBonusLevel,
	setFeaturePerLevelBonusName,
	setFeaturePerLevelDiceLevel,
	setFeaturePerLevelDiceName,
	setFeaturePerLevelDistanceLevel,
	setFeaturePerLevelDistanceName,
	setFeaturePerLevelMultiDiceLevelCount,
	setFeaturePerLevelMultiDiceLevelDie,
	setFeaturePerLevelMultiDiceName,
	setFeaturePerLevelNumberLevel,
	setFeaturePerLevelNumberName,
	setFeatureSubfeatureOptionsChoiceType,
	setFeatureSubfeatureOptionsChoose,
	setFeatureSubfeatureOptionsOptionDescription,
	setFeatureSubfeatureOptionsOptionName,
	setFeatureSubfeatureOptionsOptionPrerequisiteFeature,
	setFeatureSubfeatureOptionsOptionPrerequisiteLevel,
	setFeatureSubfeatureOptionsOptionPrerequisiteSpell,
	setFeatureSubfeatureOptionsOptionPrerequisiteType,
	setFeatureSubfeatureOptionsPerLevelNumberIndex
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';

import Button from '../../../Button/Button';
import { Item } from '../../../../types/db/item';
import MarkdownTextArea from '../../../MarkdownTextArea/MarkdownTextArea';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import Option from '../../../Select/Option';
import RemoveButton from '../../../RemoveButton/RemoveButton';
import Select from '../../../Select/Select/Select';
import TextInput from '../../../TextInput/TextInput';
import { XMarkIcon } from '@heroicons/react/24/solid';
import styles from './Features.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { v4 as uuidV4 } from 'uuid';

type FeaturesProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
};

const choiceTypeOptions: Option[] = [
	{ label: 'Once', value: 'once' },
	{ label: 'Per Level', value: 'per-level' }
];

const levelErrorMessage = 'Level is required';

const getFeatureStr = (index: number) => `features.${index}`;
const getSubfeatureStr = (featureIndex: number, optionIndex: number) =>
	`${getFeatureStr(featureIndex)}.subFeatureOptions.options.${optionIndex}`;
const getPrerequisiteStr = (
	featureIndex: number,
	optionIndex: number,
	prerequisiteIndex: number
) =>
	`${getSubfeatureStr(
		featureIndex,
		optionIndex
	)}.prerequisites.${prerequisiteIndex}`;
const chooseErrorMessage = 'Choose is required';
const featureErrorMessage = 'Feature is requred';
const spellErorMessage = 'Spell is required';

const Features = ({ clickedSubmit, shouldUseReduxStore }: FeaturesProps) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		setFieldValue,
		setFieldError,
		setFieldTouched
	} = useFormikContext<EditingClassState>();
	const dispatch = useAppDispatch();

	const hasReachedMaxPerLevels = useMemo(
		() =>
			values.features.reduce(
				(acc, cur) =>
					acc +
					(cur.perLevelNumbers?.length ?? 0) +
					(cur.perLevelBonuses?.length ?? 0) +
					(cur.perLevelDice?.length ?? 0) +
					(cur.perLevelDistances?.length ?? 0) +
					(cur.perLevelMultiDice?.length ?? 0),
				0
			) >= 5,
		[values.features]
	);

	const prerequisiteSpellOptions = useMemo(
		() =>
			[{ value: 'blank', label: '\u2014' } as Option].concat(
				values.spellcasting?.spells.map(({ id, name }) => ({
					value: id,
					label: name
				})) ?? []
			),
		[values.spellcasting]
	);

	const getPrerequisiteTypeOptions = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex?: number) =>
			[{ label: 'Level', value: 'level' } as Option]
				.concat(
					values.features
						.filter((_, i) => i !== featureIndex)
						.some(
							feature => (feature.subFeatureOptions?.options.length ?? 0) > 0
						)
						? [{ label: 'Feature', value: 'feature' }]
						: []
				)
				.concat(
					values.spellcasting?.spells.length ?? 0
						? [{ label: 'Spell', value: 'spell' }]
						: []
				)
				.filter(
					option =>
						!(
							values.features[featureIndex].subFeatureOptions!.options[
								optionIndex
							].prerequisites ?? []
						).some(
							(prerequisite, i) =>
								prerequisite.type === option.value && i !== prerequisiteIndex
						)
				),
		[values.features, values.spellcasting]
	);

	const getPrerequisiteFeatures = useCallback(
		(featureIndex: number) =>
			values.features
				.filter((_, i) => i !== featureIndex)
				.flatMap(feature => feature.subFeatureOptions?.options ?? []),
		[values.features]
	);

	const getPrerequisiteFeatureOptions = useCallback(
		(featureIndex: number) =>
			[{ value: 'blank', label: '\u2014' } as Option].concat(
				getPrerequisiteFeatures(featureIndex).map<Option>(option => ({
					value: option.uuid,
					label: option.name.length > 0 ? option.name : 'Unnamed'
				}))
			),
		[getPrerequisiteFeatures]
	);

	const getFeatureTouched = useCallback(
		(index: number) => touched.features && touched.features[index],
		[touched.features]
	);

	const getFeatureError = useCallback(
		(index: number) =>
			errors.features
				? (errors.features[index] as FormikErrors<FeatureState> | undefined)
				: undefined,
		[errors.features]
	);

	const getSubfeatureOptionsTouched = useCallback(
		function get<T>(index: number) {
			return getFeatureTouched(index)?.subFeatureOptions as unknown as
				| FormikTouched<T>
				| undefined;
		},
		[getFeatureTouched]
	);

	const getSubfeatureOptionsError = useCallback(
		function get<T>(index: number) {
			return getFeatureError(index)
				? getFeatureError(index)?.subFeatureOptions
					? (getFeatureError(index)?.subFeatureOptions as FormikErrors<T>)
					: undefined
				: undefined;
		},
		[getFeatureError]
	);

	const getSubfeatureOptionsOptionTouched = useCallback(
		function get<T>(featureIndex: number, optionIndex: number) {
			return (
				(getSubfeatureOptionsTouched<{ options: any[] }>(featureIndex)
					?.options as FormikTouched<T>[] | undefined) &&
				(
					getSubfeatureOptionsTouched<{ options: any[] }>(featureIndex)!
						.options as FormikTouched<T>[]
				)[optionIndex]
			);
		},
		[getSubfeatureOptionsTouched]
	);

	const getSubfeatureOptionsOptionError = useCallback(
		function get<T>(featureIndex: number, optionIndex: number) {
			return getSubfeatureOptionsError<{ options: any[] }>(featureIndex)
				?.options
				? (
						getSubfeatureOptionsError<{ options: any[] }>(featureIndex)!
							.options as FormikErrors<T>[]
				  )[optionIndex]
				: undefined;
		},
		[getSubfeatureOptionsError]
	);

	const getPrerequisiteTouched = useCallback(
		function get<T>(
			featureIndex: number,
			optionIndex: number,
			prerequisiteIndex: number
		) {
			return (
				(getSubfeatureOptionsOptionTouched<{ prerequisites: any[] }>(
					featureIndex,
					optionIndex
				)?.prerequisites as FormikTouched<T> | undefined) &&
				(
					getSubfeatureOptionsOptionTouched<{ prerequisites: any[] }>(
						featureIndex,
						optionIndex
					)?.prerequisites as FormikTouched<T>[]
				)[prerequisiteIndex]
			);
		},
		[getSubfeatureOptionsOptionTouched]
	);

	const getPrerequisiteError = useCallback(
		function get<T>(
			featureIndex: number,
			optionIndex: number,
			prerequisiteIndex: number
		) {
			return getSubfeatureOptionsOptionError<{ prerequisites: any[] }>(
				featureIndex,
				optionIndex
			)?.prerequisites
				? (
						getSubfeatureOptionsOptionError<{ prerequisites: any[] }>(
							featureIndex,
							optionIndex
						)?.prerequisites as FormikErrors<T>[]
				  )[prerequisiteIndex]
				: undefined;
		},
		[getSubfeatureOptionsOptionError]
	);

	const handleAddFeature = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addFeature());
		}

		setFieldValue(
			'features',
			[...values.features, { uuid: uuidV4(), name: '', description: '' }],
			false
		);
	}, [shouldUseReduxStore, dispatch, setFieldValue, values.features]);

	const getHandleRemoveFeature = useCallback(
		(id: string) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeature(id));
			}

			setFieldValue(
				'features',
				values.features.filter(({ uuid }) => uuid !== id),
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getNameTouched = useCallback(
		(index: number) => getFeatureTouched(index)?.name,
		[getFeatureTouched]
	);

	const getNameError = useCallback(
		(index: number) => getFeatureError(index)?.name,
		[getFeatureError]
	);

	const getHandleNameBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(setFeatureName({ index, name: event.target.value }));
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getDescriptionTouched = useCallback(
		(index: number) => getFeatureTouched(index)?.description,
		[getFeatureTouched]
	);

	const getDescriptionError = useCallback(
		(index: number) => getFeatureError(index)?.description,
		[getFeatureError]
	);

	const getHandleDescriptionChange = useCallback(
		(index: number) => (value: string) => {
			setFieldValue(`${getFeatureStr(index)}.description`, value, false);
		},
		[setFieldValue]
	);

	const getHandleDescriptionBlur = useCallback(
		(index: number): FocusEventHandler<HTMLTextAreaElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeatureDescription({ index, description: event.target.value })
					);
				}

				const field = `features.${index}.description`;

				setFieldValue(field, event.target.value, false);
				setFieldTouched(field, true, false);
				setFieldError(
					field,
					event.target.value.length === 0
						? 'Description is required'
						: undefined
				);
			},
		[
			setFieldValue,
			dispatch,
			shouldUseReduxStore,
			setFieldError,
			setFieldTouched
		]
	);

	const getLevelTouched = useCallback(
		(index: number) => getFeatureTouched(index)?.level,
		[getFeatureTouched]
	);

	const getLevelError = useCallback(
		(index: number) => getFeatureError(index)?.level,
		[getFeatureError]
	);

	const getHandleLevelChange = useCallback(
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`${getFeatureStr(index)}.level`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleLevelBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (newValue !== undefined && newValue > 20) {
					newValue = 20;
				}

				if (values.features[index].level !== newValue) {
					for (
						let i = 0;
						i < (values.features[index].perLevelNumbers?.length ?? 0);
						++i
					) {
						for (let j = 0; j < (newValue ?? 0) - 1; ++j) {
							if (shouldUseReduxStore) {
								dispatch(
									setFeaturePerLevelNumberLevel({
										featureIndex: index,
										numberIndex: i,
										levelIndex: j,
										level: null
									})
								);
							}

							setFieldValue(
								`features.${index}.perLevelNumbers.${i}.levels.${j}`,
								null,
								false
							);
						}
					}

					for (
						let i = 0;
						i < (values.features[index].perLevelDice?.length ?? 0);
						++i
					) {
						for (let j = 0; j < (newValue ?? 0) - 1; ++j) {
							if (shouldUseReduxStore) {
								dispatch(
									setFeaturePerLevelDiceLevel({
										featureIndex: index,
										diceIndex: i,
										levelIndex: j,
										level: null
									})
								);
							}

							setFieldValue(
								`features.${index}.perLevelDice.${i}.levels.${j}`,
								null,
								false
							);
						}
					}

					for (
						let i = 0;
						i < (values.features[index].perLevelMultiDice?.length ?? 0);
						++i
					) {
						for (let j = 0; j < (newValue ?? 0) - 1; ++j) {
							if (shouldUseReduxStore) {
								dispatch(
									setFeaturePerLevelMultiDiceLevelCount({
										featureIndex: index,
										diceIndex: i,
										levelIndex: j
									})
								);

								dispatch(
									setFeaturePerLevelMultiDiceLevelDie({
										featureIndex: index,
										diceIndex: i,
										levelIndex: j
									})
								);
							}

							setFieldValue(
								`features.${index}.perLevelMultiDice.${i}.levels.${j}`,
								{},
								false
							);
						}
					}

					for (
						let i = 0;
						i < (values.features[index].perLevelBonuses?.length ?? 0);
						++i
					) {
						for (let j = 0; j < (newValue ?? 0) - 1; ++j) {
							if (shouldUseReduxStore) {
								dispatch(
									setFeaturePerLevelBonusLevel({
										featureIndex: index,
										bonusIndex: i,
										levelIndex: j,
										level: null
									})
								);
							}

							setFieldValue(
								`features.${index}.perLevelBonuses.${i}.levels.${j}`,
								null,
								false
							);
						}
					}

					for (
						let i = 0;
						i < (values.features[index].perLevelDistances?.length ?? 0);
						++i
					) {
						for (let j = 0; j < (newValue ?? 0) - 1; ++j) {
							if (shouldUseReduxStore) {
								dispatch(
									setFeaturePerLevelDistanceLevel({
										featureIndex: index,
										distanceIndex: i,
										levelIndex: j,
										level: null
									})
								);
							}

							setFieldValue(
								`features.${index}.perLevelDistances.${i}.levels.${j}`,
								null,
								false
							);
						}
					}
				}

				if (shouldUseReduxStore) {
					dispatch(setFeatureLevel({ index, level: newValue }));
				}

				const field = `${getFeatureStr(index)}.level`;
				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? 'Level is required' : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldValue,
			setFieldTouched,
			values.features
		]
	);

	const getHandleAddPerLevelNumber = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelNumber(index));
			}

			const newLNs = [
				...(values.features[index].perLevelNumbers ?? []),
				{ name: '', levels: [...Array(20).keys()].map(() => null) }
			];

			setFieldValue(`${getFeatureStr(index)}.perLevelNumbers`, newLNs, false);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelNumberNameTouched = useCallback(
		(featureIndex: number, numberIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelNumbers &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelNumbers as unknown as FormikTouched<{
					name: string;
				}>[]
			)[numberIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelNumberNameError = useCallback(
		(featureIndex: number, numberIndex: number) =>
			getFeatureError(featureIndex)?.perLevelNumbers
				? (
						getFeatureError(featureIndex)
							?.perLevelNumbers as unknown as FormikErrors<{ name: string }>[]
				  )[numberIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelNumberNameBlur = useCallback(
		(
				featureIndex: number,
				numberIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelNumberName({
							featureIndex,
							numberIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelNumber = useCallback(
		(featureIndex: number, numberIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeaturePerLevelNumber({ featureIndex, numberIndex }));
			}

			const newLNs = values.features[featureIndex].perLevelNumbers?.filter(
				(_, i) => i !== numberIndex
			);

			const subFeatureOptions = values.features[featureIndex].subFeatureOptions;

			if (
				(subFeatureOptions?.choiceType === 'per-level' &&
					(newLNs?.length ?? 0) === 1) ||
				subFeatureOptions?.perLevelNumberIndex === numberIndex ||
				(subFeatureOptions &&
					(subFeatureOptions?.perLevelNumberIndex ?? 0) >=
						(newLNs?.length ?? 0))
			) {
				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsPerLevelNumberIndex({
							index: featureIndex,
							perLevelNumberIndex: 0
						})
					);
				}

				setFieldValue(
					`${getFeatureStr(
						featureIndex
					)}.subFeatureOptions.perLevelNumberIndex`,
					0,
					false
				);
			}

			if ((newLNs?.length ?? 0) === 0 && subFeatureOptions) {
				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsPerLevelNumberIndex({
							index: featureIndex
						})
					);

					dispatch(
						setFeatureSubfeatureOptionsChoiceType({
							index: featureIndex,
							choiceType: 'once'
						})
					);
				}

				setFieldValue(
					`${getFeatureStr(
						featureIndex
					)}.subFeatureOptions.perLevelNumberIndex`,
					undefined,
					false
				);

				setFieldValue(
					`${getFeatureStr(featureIndex)}.subFeatureOptions.choiceType`,
					'once',
					false
				);
			}

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelNumbers`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleAddPerLevelDice = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelDice(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.perLevelDice`,
				[
					...(values.features[index].perLevelDice ?? []),
					{ name: '', levels: [...Array(20).keys()].map(() => null) }
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelDiceNameTouched = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelDice &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelDice as unknown as FormikTouched<{
					name: string;
				}>[]
			)[diceIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelDiceNameError = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureError(featureIndex)?.perLevelDice
				? (
						getFeatureError(featureIndex)
							?.perLevelDice as unknown as FormikErrors<{ name: string }>[]
				  )[diceIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelDiceNameBlur = useCallback(
		(
				featureIndex: number,
				diceIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelDiceName({
							featureIndex,
							diceIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelDice = useCallback(
		(featureIndex: number, diceIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeaturePerLevelDice({ featureIndex, diceIndex }));
			}

			const newLNs = values.features[featureIndex].perLevelDice?.filter(
				(_, i) => i !== diceIndex
			);

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelDice`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleAddPerLevelMultiDice = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelMultiDice(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.perLevelMultiDice`,
				[
					...(values.features[index].perLevelMultiDice ?? []),
					{
						name: '',
						levels: [...Array(20).keys()].map(() => ({}))
					}
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelMultiDiceNameTouched = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelMultiDice &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelMultiDice as unknown as FormikTouched<{
					name: string;
				}>[]
			)[diceIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelMultiDiceNameError = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureError(featureIndex)?.perLevelMultiDice
				? (
						getFeatureError(featureIndex)
							?.perLevelMultiDice as unknown as FormikErrors<{ name: string }>[]
				  )[diceIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelMultiDiceNameBlur = useCallback(
		(
				featureIndex: number,
				diceIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelMultiDiceName({
							featureIndex,
							diceIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelMultiDice = useCallback(
		(featureIndex: number, diceIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeaturePerLevelMultiDice({ featureIndex, diceIndex }));
			}

			const newLNs = values.features[featureIndex].perLevelMultiDice?.filter(
				(_, i) => i !== diceIndex
			);

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelMultiDice`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleAddPerLevelBonus = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelBonus(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.perLevelBonuses`,
				[
					...(values.features[index].perLevelBonuses ?? []),
					{ name: '', levels: [...Array(20).keys()].map(() => null) }
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelBonusNameTouched = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelBonuses &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelBonuses as unknown as FormikTouched<{
					name: string;
				}>[]
			)[diceIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelBonusNameError = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureError(featureIndex)?.perLevelBonuses
				? (
						getFeatureError(featureIndex)
							?.perLevelBonuses as unknown as FormikErrors<{ name: string }>[]
				  )[diceIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelBonusNameBlur = useCallback(
		(
				featureIndex: number,
				bonusIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelBonusName({
							featureIndex,
							bonusIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelBonus = useCallback(
		(featureIndex: number, bonusIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeaturePerLevelBonus({ featureIndex, bonusIndex }));
			}

			const newLNs = values.features[featureIndex].perLevelBonuses?.filter(
				(_, i) => i !== bonusIndex
			);

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelBonuses`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleAddPerLevelDistance = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeaturePerLevelDistance(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.perLevelDistances`,
				[
					...(values.features[index].perLevelDistances ?? []),
					{ name: '', levels: [...Array(20).keys()].map(() => null) }
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getPerLevelDistanceNameTouched = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureTouched(featureIndex)?.perLevelDistances &&
			(
				getFeatureTouched(featureIndex)
					?.perLevelDistances as unknown as FormikTouched<{
					name: string;
				}>[]
			)[diceIndex]?.name,
		[getFeatureTouched]
	);

	const getPerLevelDistanceNameError = useCallback(
		(featureIndex: number, diceIndex: number) =>
			getFeatureError(featureIndex)?.perLevelDistances
				? (
						getFeatureError(featureIndex)
							?.perLevelDistances as unknown as FormikErrors<{ name: string }>[]
				  )[diceIndex]?.name
				: undefined,
		[getFeatureError]
	);

	const getHandlePerLevelDistanceNameBlur = useCallback(
		(
				featureIndex: number,
				distanceIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelDistanceName({
							featureIndex,
							distanceIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);
			},
		[shouldUseReduxStore, dispatch, handleBlur]
	);

	const getHandleRemovePerLevelDistance = useCallback(
		(featureIndex: number, distanceIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(
					removeFeaturePerLevelDistance({ featureIndex, distanceIndex })
				);
			}

			const newLNs = values.features[featureIndex].perLevelDistances?.filter(
				(_, i) => i !== distanceIndex
			);

			setFieldValue(
				`${getFeatureStr(featureIndex)}.perLevelDistances`,
				newLNs?.length === 0 ? undefined : newLNs,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleAddSubfeatureOptions = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeatureSubfeatureOptions(index));
			}

			setFieldValue(
				`features.${index}.subFeatureOptions`,
				{
					choiceType: 'once',
					options: []
				},
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue]
	);

	const getHandleRemoveSubfeatureOptions = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeatureSubfeatureOptions(index));
			}

			setFieldValue(`features.${index}.subFeatureOptions`, undefined, false);
		},
		[shouldUseReduxStore, dispatch, setFieldValue]
	);

	const getHandleSubfeatureOptionsChoiceTypeChange = useCallback(
		(index: number) => (value: string | number) => {
			const newValue = value as SubfeatureChoiceType;

			if (
				newValue === 'per-level' &&
				values.features[index].subFeatureOptions?.choiceType !== 'per-level'
			) {
				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsPerLevelNumberIndex({
							index,
							perLevelNumberIndex: 0
						})
					);

					dispatch(setFeatureSubfeatureOptionsChoose({ index }));
				}

				setFieldValue(
					`${getFeatureStr(index)}.subFeatureOptions.choose`,
					undefined,
					false
				);

				setFieldValue(
					`${getFeatureStr(index)}.subFeatureOptions.perLevelNumberIndex`,
					0,
					false
				);
			} else {
				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsPerLevelNumberIndex({
							index
						})
					);
				}

				setFieldValue(
					`${getFeatureStr(index)}.subFeatureOptions.perLevelNumberIndex`,
					undefined,
					false
				);
			}

			if (shouldUseReduxStore) {
				dispatch(
					setFeatureSubfeatureOptionsChoiceType({ index, choiceType: newValue })
				);
			}

			setFieldValue(
				`features.${index}.subFeatureOptions.choiceType`,
				newValue,
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getSubfeatureOptionsChooseTouched = useCallback(
		(index: number) =>
			getSubfeatureOptionsTouched<{ choose: number }>(index)?.choose,
		[getSubfeatureOptionsTouched]
	);

	const getSubfeatureOptionsChooseError = useCallback(
		(index: number) =>
			getSubfeatureOptionsError<{ choose: number }>(index)?.choose
				? chooseErrorMessage
				: undefined,
		[getSubfeatureOptionsError]
	);

	const getHandleSubfeatureOptionsChooseChange = useCallback(
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`${getFeatureStr(index)}.subFeatureOptions.choose`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleSubfeatureOptionsChooseBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsChoose({ index, choose: newValue })
					);
				}

				const field = `${getFeatureStr(index)}.subFeatureOptions.choose`;
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

	const getHandleSubfeatureOptionsPerLevelNumberIndexChange = useCallback(
		(index: number) => (value: string | number) => {
			const newValue = value as number;

			if (shouldUseReduxStore) {
				dispatch(
					setFeatureSubfeatureOptionsPerLevelNumberIndex({
						index,
						perLevelNumberIndex: newValue
					})
				);
			}

			setFieldValue(
				`${getFeatureStr(index)}.subFeatureOptions.perLevelNumberIndex`,
				newValue,
				false
			);
		},
		[dispatch, shouldUseReduxStore, setFieldValue]
	);

	const getHandleSubfeatureOptionsAddOption = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addFeatureSubfeatureOptionsOption(index));
			}

			setFieldValue(
				`${getFeatureStr(index)}.subFeatureOptions.options`,
				[
					...values.features[index].subFeatureOptions!.options,
					{
						uuid: uuidV4(),
						name: '',
						description: ''
					}
				],
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleRemoveSubfeatureOptionsOptionPrerequisite = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			() => {
				if (shouldUseReduxStore) {
					dispatch(
						removeFeatureSubfeatureOptionsOptionPrerequisite({
							featureIndex,
							optionIndex,
							prerequisiteIndex
						})
					);
				}

				const newPrerequisites = values.features[
					featureIndex
				].subFeatureOptions!.options[optionIndex].prerequisites?.filter(
					(_, i) => i !== prerequisiteIndex
				);

				setFieldValue(
					`${getSubfeatureStr(featureIndex, optionIndex)}.prerequisites`,
					(newPrerequisites?.length ?? 0) === 0 ? undefined : newPrerequisites,
					false
				);
			},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getHandleSubfeatureOptionsRemoveOption = useCallback(
		(index: number, uuid: string) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeFeatureSubfeatureOptionsOption({ index, uuid }));
			}

			values.features.forEach((feature, i) => {
				feature.subFeatureOptions?.options.forEach((option, j) =>
					option.prerequisites?.forEach((prerequisite, k) => {
						if (prerequisite.feature?.id === uuid) {
							if (shouldUseReduxStore) {
								dispatch(
									setFeatureSubfeatureOptionsOptionPrerequisiteFeature({
										featureIndex: i,
										optionIndex: j,
										prerequisiteIndex: k
									})
								);
							}

							setFieldValue(
								`${getPrerequisiteStr(i, j, k)}.feature`,
								undefined,
								false
							);
						}
					})
				);
			});

			values.features.forEach((feature, i) => {
				(feature.subFeatureOptions?.options ?? []).forEach((option, j) =>
					(option.prerequisites ?? []).forEach((prerequisite, k) => {
						if (prerequisite.feature?.id === uuid) {
							if (shouldUseReduxStore) {
								dispatch(
									removeFeatureSubfeatureOptionsOptionPrerequisite({
										featureIndex: i,
										optionIndex: j,
										prerequisiteIndex: k
									})
								);
							}

							const newPrerequisites = values.features[
								i
							].subFeatureOptions!.options[j].prerequisites?.filter(
								(_, i) => i !== k
							);

							setFieldValue(
								getPrerequisiteStr(i, j, k),
								(newPrerequisites?.length ?? 0) === 0
									? undefined
									: newPrerequisites,
								false
							);
						}
					})
				);
			});

			setFieldValue(
				`${getFeatureStr(index)}.subFeatureOptions.options`,
				values.features[index].subFeatureOptions!.options.filter(
					option => option.uuid !== uuid
				),
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.features]
	);

	const getSubfeatureOptionsOptionNameTouched = useCallback(
		(featureIndex: number, optionIndex: number) =>
			getSubfeatureOptionsOptionTouched<{ name: string }>(
				featureIndex,
				optionIndex
			)?.name,
		[getSubfeatureOptionsOptionTouched]
	);

	const getSubfeatureOptionsOptionNameError = useCallback(
		(featureIndex: number, optionIndex: number) =>
			getSubfeatureOptionsOptionError<{ name: string }>(
				featureIndex,
				optionIndex
			)?.name,
		[getSubfeatureOptionsOptionError]
	);

	const getHandleSubfeatureOptionsOptionNameBlur = useCallback(
		(
				featureIndex: number,
				optionIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsOptionName({
							featureIndex,
							optionIndex,
							name: event.target.value
						})
					);
				}

				handleBlur(event);

				const id =
					values.features[featureIndex].subFeatureOptions!.options[optionIndex]
						.uuid;
				values.features.forEach((feature, i) =>
					feature.subFeatureOptions?.options.forEach((option, j) =>
						option.prerequisites?.forEach((prereq, k) => {
							if (
								id === prereq.feature?.id &&
								prereq.feature.name !== event.target.value
							) {
								const newFeature: Item = { id, name: event.target.value };

								if (shouldUseReduxStore) {
									dispatch(
										setFeatureSubfeatureOptionsOptionPrerequisiteFeature({
											featureIndex: i,
											optionIndex: j,
											prerequisiteIndex: k,
											feature: newFeature
										})
									);
								}

								setFieldValue(
									`${getPrerequisiteStr(i, j, k)}.feature`,
									newFeature,
									false
								);
							}
						})
					)
				);
			},
		[shouldUseReduxStore, dispatch, handleBlur, setFieldValue, values.features]
	);

	const getSubfeatureOptionsOptionDescriptionTouched = useCallback(
		(featureIndex: number, optionIndex: number) =>
			getSubfeatureOptionsOptionTouched<{ description: string }>(
				featureIndex,
				optionIndex
			)?.description,
		[getSubfeatureOptionsOptionTouched]
	);

	const getSubfeatureOptionsOptionDescriptionError = useCallback(
		(featureIndex: number, optionIndex: number) =>
			getSubfeatureOptionsOptionError<{ description: string }>(
				featureIndex,
				optionIndex
			)?.description,
		[getSubfeatureOptionsOptionError]
	);

	const getHandleSubfeatureOptionsOptionDescriptionChange = useCallback(
		(featureIndex: number, optionIndex: number) => (value: string) => {
			setFieldValue(
				`${getSubfeatureStr(featureIndex, optionIndex)}.description`,
				value,
				false
			);
		},
		[setFieldValue]
	);

	const getHandleSubfeatureOptionsOptionDescriptionBlur = useCallback(
		(
				featureIndex: number,
				optionIndex: number
			): FocusEventHandler<HTMLTextAreaElement> =>
			event => {
				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsOptionDescription({
							featureIndex,
							optionIndex,
							description: event.target.value
						})
					);
				}

				const field = `${getSubfeatureStr(
					featureIndex,
					optionIndex
				)}.description`;

				setFieldValue(field, event.target.value, false);
				setFieldTouched(field, true, false);
				setFieldError(
					field,
					event.target.value.length === 0
						? 'Description is required'
						: undefined
				);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError
		]
	);

	const getHandleAddSubfeatureOptionsOptionPrerequisite = useCallback(
		(featureIndex: number, optionIndex: number) => () => {
			const prerequisiteType = getPrerequisiteTypeOptions(
				featureIndex,
				optionIndex
			)
				.map(({ value }) => value as PrerequisiteType)
				.filter(
					type =>
						!values.features[featureIndex].subFeatureOptions!.options[
							optionIndex
						].prerequisites?.some(prerequisite => prerequisite.type === type)
				)[0];

			if (shouldUseReduxStore) {
				dispatch(
					addFeatureSubfeatureOptionsOptionPrerequisite({
						featureIndex,
						optionIndex,
						prerequisiteType
					})
				);
			}

			setFieldValue(
				`${getSubfeatureStr(featureIndex, optionIndex)}.prerequisites`,
				[
					...(values.features[featureIndex].subFeatureOptions!.options[
						optionIndex
					].prerequisites ?? []),
					{ type: prerequisiteType }
				],
				false
			);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			values.features,
			getPrerequisiteTypeOptions
		]
	);

	const getHandleSetSubfeatureOptionsOptionPrerequisiteType = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			(value: string | number) => {
				const newValue = value as PrerequisiteType;

				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsOptionPrerequisiteType({
							featureIndex,
							optionIndex,
							prerequisiteIndex,
							prerequisiteType: newValue
						})
					);
				}

				setFieldValue(
					`${getPrerequisiteStr(
						featureIndex,
						optionIndex,
						prerequisiteIndex
					)}.type`,
					newValue,
					false
				);
			},
		[shouldUseReduxStore, dispatch, setFieldValue]
	);

	const getPrerequisiteLevelTouched = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			getPrerequisiteTouched<{ level: number }>(
				featureIndex,
				optionIndex,
				prerequisiteIndex
			)?.level,
		[getPrerequisiteTouched]
	);

	const getPrerequisiteLevelError = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			getPrerequisiteError<{ level: number }>(
				featureIndex,
				optionIndex,
				prerequisiteIndex
			)?.level,
		[getPrerequisiteError]
	);

	const getHandlePrerequisiteLevelChange = useCallback(
		(
				featureIndex: number,
				optionIndex: number,
				prerequisiteIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`${getPrerequisiteStr(
						featureIndex,
						optionIndex,
						prerequisiteIndex
					)}.level`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandlePrerequisiteLevelBlur = useCallback(
		(
				featureIndex: number,
				optionIndex: number,
				prerequisiteIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (newValue !== undefined && newValue > 20) {
					newValue = 20;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsOptionPrerequisiteLevel({
							featureIndex,
							optionIndex,
							prerequisiteIndex,
							level: newValue
						})
					);
				}
				const field = `${getPrerequisiteStr(
					featureIndex,
					optionIndex,
					prerequisiteIndex
				)}.level`;

				setFieldValue(field, event.target.value, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? levelErrorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError
		]
	);

	const getPrerequisiteFeatureTouched = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			!!getPrerequisiteTouched<{ feature: any }>(
				featureIndex,
				optionIndex,
				prerequisiteIndex
			)?.feature,
		[getPrerequisiteTouched]
	);

	const getPrerequisiteFeatureError = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			!!getPrerequisiteError<{ feature: any }>(
				featureIndex,
				optionIndex,
				prerequisiteIndex
			)?.feature
				? featureErrorMessage
				: undefined,
		[getPrerequisiteError]
	);

	const getHandlePrerequisiteFeatureChange = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			(value: string | number) => {
				const newId = value !== 'blank' ? (value as string) : undefined;
				const newFeature = newId
					? getPrerequisiteFeatures(featureIndex).find(
							feature => feature.uuid === newId
					  ) ?? undefined
					: undefined;
				const newItem: Item | undefined = newFeature
					? { id: newFeature.uuid, name: newFeature.name }
					: undefined;

				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsOptionPrerequisiteFeature({
							featureIndex,
							optionIndex,
							prerequisiteIndex,
							feature: newItem
						})
					);
				}

				const field = `${getPrerequisiteStr(
					featureIndex,
					optionIndex,
					prerequisiteIndex
				)}.feature`;

				setFieldValue(field, newItem, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newItem ? featureErrorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldTouched,
			setFieldError,
			setFieldValue,
			getPrerequisiteFeatures
		]
	);

	const getPrerequisiteSpellTouched = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			!!getPrerequisiteTouched<{ spell: any }>(
				featureIndex,
				optionIndex,
				prerequisiteIndex
			)?.spell,
		[getPrerequisiteTouched]
	);

	const getPrerequisiteSpellError = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			!!getPrerequisiteError<{ spell: any }>(
				featureIndex,
				optionIndex,
				prerequisiteIndex
			)?.spell
				? spellErorMessage
				: undefined,
		[getPrerequisiteError]
	);

	const getHandlePrerequisiteSpellChange = useCallback(
		(featureIndex: number, optionIndex: number, prerequisiteIndex: number) =>
			(value: string | number) => {
				const newId = value !== 'blank' ? (value as string) : undefined;
				const newSpell = newId
					? values.spellcasting?.spells.find(spell => spell.id === newId) ??
					  undefined
					: undefined;
				const newItem: Item | undefined = newSpell
					? { id: newSpell.id, name: newSpell.name }
					: undefined;

				if (shouldUseReduxStore) {
					dispatch(
						setFeatureSubfeatureOptionsOptionPrerequisiteSpell({
							featureIndex,
							optionIndex,
							prerequisiteIndex,
							spell: newItem
						})
					);
				}

				const field = `${getPrerequisiteStr(
					featureIndex,
					optionIndex,
					prerequisiteIndex
				)}.spell`;

				setFieldValue(field, newItem, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newItem ? spellErorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldTouched,
			setFieldError,
			setFieldValue,
			values.spellcasting
		]
	);

	return (
		<section className={styles.container}>
			<h2>Features</h2>
			{values.features.length > 0 && (
				<div className={styles.features}>
					{values.features.map((feature, i) => (
						<div key={feature.uuid} className={styles.feature}>
							<RemoveButton onClick={getHandleRemoveFeature(feature.uuid)} />
							<NumberTextInput
								id={`${getFeatureStr(i)}.level`}
								label="Level"
								value={feature.level}
								touched={clickedSubmit || getLevelTouched(i)}
								error={getLevelError(i)}
								onChange={getHandleLevelChange(i)}
								onBlur={getHandleLevelBlur(i)}
							/>
							<TextInput
								id={`${getFeatureStr(i)}.name`}
								label="Name"
								value={feature.name}
								touched={clickedSubmit || getNameTouched(i)}
								error={getNameError(i)}
								onChange={handleChange}
								onBlur={getHandleNameBlur(i)}
							/>
							<MarkdownTextArea
								id={`${getFeatureStr(i)}.description`}
								label="Description"
								value={feature.description}
								touched={clickedSubmit || getDescriptionTouched(i)}
								error={getDescriptionError(i)}
								onChange={getHandleDescriptionChange(i)}
								onBlur={getHandleDescriptionBlur(i)}
							/>
							{(!hasReachedMaxPerLevels ||
								(feature.perLevelNumbers?.length ?? 0) > 0 ||
								(feature.perLevelDice?.length ?? 0) > 0 ||
								(feature.perLevelMultiDice?.length ?? 0) > 0 ||
								(feature.perLevelBonuses?.length ?? 0) > 0 ||
								(feature.perLevelDistances?.length ?? 0) > 0) && (
								<div className={styles['per-level-container']}>
									<div className={styles['per-levels-title']}>
										Per Level Info
									</div>
									<p>
										Use this section to add Info that changes every level, such
										as the rogue class&apos;s sneak attack dice or the barbarian
										class&apos;s rages.
									</p>
									<div className={styles['per-levels']}>
										{(!hasReachedMaxPerLevels ||
											(feature.perLevelNumbers?.length ?? 0) > 0) && (
											<div className={styles['per-level']}>
												{(feature.perLevelNumbers?.length ?? 0) > 0 && (
													<>
														<div className={styles['sub-title']}>Numbers</div>
														{feature.perLevelNumbers?.map((pl, j) => (
															<div
																key={j}
																className={styles['input-container']}
															>
																<TextInput
																	id={`${getFeatureStr(
																		i
																	)}.perLevelNumbers.${j}.name`}
																	label="Name"
																	value={pl.name}
																	touched={
																		clickedSubmit ||
																		getPerLevelNumberNameTouched(i, j)
																	}
																	error={getPerLevelNumberNameError(i, j)}
																	onChange={handleChange}
																	onBlur={getHandlePerLevelNumberNameBlur(i, j)}
																/>
																<button
																	className={styles['remove-button']}
																	onClick={getHandleRemovePerLevelNumber(i, j)}
																	type="button"
																>
																	<XMarkIcon
																		className={styles['remove-icon']}
																	/>
																</button>
															</div>
														))}
													</>
												)}
												{!hasReachedMaxPerLevels && (
													<Button
														positive
														onClick={getHandleAddPerLevelNumber(i)}
														style={{ margin: '0 auto' }}
													>
														Add Number
													</Button>
												)}
											</div>
										)}
										{(!hasReachedMaxPerLevels ||
											(feature.perLevelDice?.length ?? 0) > 0) && (
											<div className={styles['per-level']}>
												{(feature.perLevelDice?.length ?? 0) > 0 && (
													<>
														<div className={styles['sub-title']}>Dice</div>
														{feature.perLevelDice?.map((pl, j) => (
															<div
																key={j}
																className={styles['input-container']}
															>
																<TextInput
																	id={`${getFeatureStr(
																		i
																	)}.perLevelDice.${j}.name`}
																	label="Name"
																	value={pl.name}
																	touched={
																		clickedSubmit ||
																		getPerLevelDiceNameTouched(i, j)
																	}
																	error={getPerLevelDiceNameError(i, j)}
																	onChange={handleChange}
																	onBlur={getHandlePerLevelDiceNameBlur(i, j)}
																/>
																<button
																	className={styles['remove-button']}
																	onClick={getHandleRemovePerLevelDice(i, j)}
																	type="button"
																>
																	<XMarkIcon
																		className={styles['remove-icon']}
																	/>
																</button>
															</div>
														))}
													</>
												)}
												{!hasReachedMaxPerLevels && (
													<Button
														positive
														onClick={getHandleAddPerLevelDice(i)}
														style={{ margin: '0 auto' }}
													>
														Add Dice
													</Button>
												)}
											</div>
										)}
										{(!hasReachedMaxPerLevels ||
											(feature.perLevelMultiDice?.length ?? 0) > 0) && (
											<div className={styles['per-level']}>
												{(feature.perLevelMultiDice?.length ?? 0) > 0 && (
													<>
														<div className={styles['sub-title']}>
															Multi Dice
														</div>
														{feature.perLevelMultiDice?.map((pl, j) => (
															<div
																key={j}
																className={styles['input-container']}
															>
																<TextInput
																	id={`${getFeatureStr(
																		i
																	)}.perLevelMultiDice.${j}.name`}
																	label="Name"
																	value={pl.name}
																	touched={
																		clickedSubmit ||
																		getPerLevelMultiDiceNameTouched(i, j)
																	}
																	error={getPerLevelMultiDiceNameError(i, j)}
																	onChange={handleChange}
																	onBlur={getHandlePerLevelMultiDiceNameBlur(
																		i,
																		j
																	)}
																/>
																<button
																	className={styles['remove-button']}
																	onClick={getHandleRemovePerLevelMultiDice(
																		i,
																		j
																	)}
																	type="button"
																>
																	<XMarkIcon
																		className={styles['remove-icon']}
																	/>
																</button>
															</div>
														))}
													</>
												)}
												{!hasReachedMaxPerLevels && (
													<Button
														positive
														onClick={getHandleAddPerLevelMultiDice(i)}
														style={{ margin: '0 auto' }}
													>
														Add Multi Dice
													</Button>
												)}
											</div>
										)}
										{(!hasReachedMaxPerLevels ||
											(feature.perLevelBonuses?.length ?? 0) > 0) && (
											<div className={styles['per-level']}>
												{(feature.perLevelBonuses?.length ?? 0) > 0 && (
													<>
														<div className={styles['sub-title']}>Bonuses</div>
														{feature.perLevelBonuses?.map((pl, j) => (
															<div
																key={j}
																className={styles['input-container']}
															>
																<TextInput
																	id={`${getFeatureStr(
																		i
																	)}.perLevelBonuses.${j}.name`}
																	label="Name"
																	value={pl.name}
																	touched={
																		clickedSubmit ||
																		getPerLevelBonusNameTouched(i, j)
																	}
																	error={getPerLevelBonusNameError(i, j)}
																	onChange={handleChange}
																	onBlur={getHandlePerLevelBonusNameBlur(i, j)}
																/>
																<button
																	className={styles['remove-button']}
																	onClick={getHandleRemovePerLevelBonus(i, j)}
																	type="button"
																>
																	<XMarkIcon
																		className={styles['remove-icon']}
																	/>
																</button>
															</div>
														))}
													</>
												)}
												{!hasReachedMaxPerLevels && (
													<Button
														positive
														onClick={getHandleAddPerLevelBonus(i)}
														style={{ margin: '0 auto' }}
													>
														Add Bonus
													</Button>
												)}
											</div>
										)}
										{(!hasReachedMaxPerLevels ||
											(feature.perLevelDistances?.length ?? 0) > 0) && (
											<div className={styles['per-level']}>
												{(feature.perLevelDistances?.length ?? 0) > 0 && (
													<>
														<div className={styles['sub-title']}>Distances</div>
														{feature.perLevelDistances?.map((pl, j) => (
															<div
																key={j}
																className={styles['input-container']}
															>
																<TextInput
																	id={`${getFeatureStr(
																		i
																	)}.perLevelDistances.${j}.name`}
																	label="Name"
																	value={pl.name}
																	touched={
																		clickedSubmit ||
																		getPerLevelDistanceNameTouched(i, j)
																	}
																	error={getPerLevelDistanceNameError(i, j)}
																	onChange={handleChange}
																	onBlur={getHandlePerLevelDistanceNameBlur(
																		i,
																		j
																	)}
																/>
																<button
																	className={styles['remove-button']}
																	onClick={getHandleRemovePerLevelDistance(
																		i,
																		j
																	)}
																	type="button"
																>
																	<XMarkIcon
																		className={styles['remove-icon']}
																	/>
																</button>
															</div>
														))}
													</>
												)}
												{!hasReachedMaxPerLevels && (
													<Button
														positive
														onClick={getHandleAddPerLevelDistance(i)}
														style={{ margin: '0 auto' }}
													>
														Add Distance
													</Button>
												)}
											</div>
										)}
									</div>
								</div>
							)}
							{feature.subFeatureOptions && (
								<div className={styles[`sub-features-container`]}>
									<div className={styles['sub-features-choose']}>
										{(feature.perLevelNumbers?.length ?? 0) > 0 && (
											<Select
												id={`${getFeatureStr(i)}.subFeatureOptions.choiceType`}
												label="Choice Type"
												value={feature.subFeatureOptions.choiceType}
												options={choiceTypeOptions}
												onChange={getHandleSubfeatureOptionsChoiceTypeChange(i)}
											/>
										)}
										{feature.subFeatureOptions.choiceType === 'once' && (
											<NumberTextInput
												id={`${getFeatureStr(i)}.subFeatureOptions.choose`}
												label="Choose"
												value={feature.subFeatureOptions.choose}
												touched={
													clickedSubmit || getSubfeatureOptionsChooseTouched(i)
												}
												error={getSubfeatureOptionsChooseError(i)}
												onChange={getHandleSubfeatureOptionsChooseChange(i)}
												onBlur={getHandleSubfeatureOptionsChooseBlur(i)}
											/>
										)}
										{feature.subFeatureOptions.choiceType === 'per-level' &&
											(feature.perLevelNumbers?.length ?? 0) > 1 && (
												<Select
													id={`${getFeatureStr(
														i
													)}.subFeatureOptions.perLevelNumber`}
													label="Per Level Number"
													options={feature.perLevelNumbers!.map<Option>(
														(pl, j) => ({
															label: pl.name.length > 0 ? pl.name : 'Unnamed',
															value: j
														})
													)}
													value={feature.subFeatureOptions.perLevelNumberIndex}
													onChange={getHandleSubfeatureOptionsPerLevelNumberIndexChange(
														i
													)}
												/>
											)}
									</div>
									<div className={styles['sub-features-from']}>
										<div className={styles['sub-title']}>From</div>
										{feature.subFeatureOptions.options.map((option, j) => (
											<div key={option.uuid} className={styles['sub-feature']}>
												<RemoveButton
													onClick={getHandleSubfeatureOptionsRemoveOption(
														i,
														option.uuid
													)}
												/>
												<TextInput
													id={`${getSubfeatureStr(i, j)}.name`}
													label="Name"
													touched={
														clickedSubmit ||
														getSubfeatureOptionsOptionNameTouched(i, j)
													}
													error={getSubfeatureOptionsOptionNameError(i, j)}
													value={option.name}
													onChange={handleChange}
													onBlur={getHandleSubfeatureOptionsOptionNameBlur(
														i,
														j
													)}
												/>
												<MarkdownTextArea
													id={`${getSubfeatureStr(i, j)}.description`}
													label="Description"
													touched={
														clickedSubmit ||
														getSubfeatureOptionsOptionDescriptionTouched(i, j)
													}
													error={getSubfeatureOptionsOptionDescriptionError(
														i,
														j
													)}
													value={option.description}
													onChange={getHandleSubfeatureOptionsOptionDescriptionChange(
														i,
														j
													)}
													onBlur={getHandleSubfeatureOptionsOptionDescriptionBlur(
														i,
														j
													)}
												/>
												{feature.subFeatureOptions!.choiceType ===
													'per-level' && (
													<>
														{(option.prerequisites?.length ?? 0) > 0 && (
															<div
																className={styles['prerequisites-container']}
															>
																<div className={styles['sub-title']}>
																	Prerequisites
																</div>
																<div className={styles['prerequisites']}>
																	{option.prerequisites!.map(
																		(prerequisite, k) => (
																			<div
																				key={k}
																				className={styles['prerequisite']}
																			>
																				{getPrerequisiteTypeOptions(i, j, k)
																					.length > 1 && (
																					<Select
																						id={`${getPrerequisiteStr(
																							i,
																							j,
																							k
																						)}.type`}
																						options={getPrerequisiteTypeOptions(
																							i,
																							j,
																							k
																						)}
																						label="Type"
																						value={prerequisite.type}
																						onChange={getHandleSetSubfeatureOptionsOptionPrerequisiteType(
																							i,
																							j,
																							k
																						)}
																					/>
																				)}
																				{prerequisite.type === 'level' && (
																					<NumberTextInput
																						id={`${getPrerequisiteStr(
																							i,
																							j,
																							k
																						)}.level`}
																						label="Level"
																						touched={
																							clickedSubmit ||
																							getPrerequisiteLevelTouched(
																								i,
																								j,
																								k
																							)
																						}
																						error={getPrerequisiteLevelError(
																							i,
																							j,
																							k
																						)}
																						value={prerequisite.level}
																						onChange={getHandlePrerequisiteLevelChange(
																							i,
																							j,
																							k
																						)}
																						onBlur={getHandlePrerequisiteLevelBlur(
																							i,
																							j,
																							k
																						)}
																					/>
																				)}
																				{prerequisite.type === 'feature' && (
																					<Select
																						id={`${getPrerequisiteStr(
																							i,
																							j,
																							k
																						)}.feature`}
																						label="Feature"
																						options={getPrerequisiteFeatureOptions(
																							i
																						)}
																						touched={
																							clickedSubmit ||
																							getPrerequisiteFeatureTouched(
																								i,
																								j,
																								k
																							)
																						}
																						error={getPrerequisiteFeatureError(
																							i,
																							j,
																							k
																						)}
																						onChange={getHandlePrerequisiteFeatureChange(
																							i,
																							j,
																							k
																						)}
																						value={
																							prerequisite.feature?.id ??
																							'blank'
																						}
																						searchable
																					/>
																				)}
																				{prerequisite.type === 'spell' && (
																					<Select
																						id={`${getPrerequisiteStr(
																							i,
																							j,
																							k
																						)}.spell`}
																						label="Spell"
																						options={prerequisiteSpellOptions}
																						touched={
																							clickedSubmit ||
																							getPrerequisiteSpellTouched(
																								i,
																								j,
																								k
																							)
																						}
																						error={getPrerequisiteSpellError(
																							i,
																							j,
																							k
																						)}
																						onChange={getHandlePrerequisiteSpellChange(
																							i,
																							j,
																							k
																						)}
																						value={
																							prerequisite.spell?.id ?? 'blank'
																						}
																						searchable
																					/>
																				)}
																				<button
																					className={styles['remove-button']}
																					onClick={getHandleRemoveSubfeatureOptionsOptionPrerequisite(
																						i,
																						j,
																						k
																					)}
																					type="button"
																				>
																					<XMarkIcon
																						className={styles['remove-icon']}
																					/>
																				</button>
																			</div>
																		)
																	)}
																</div>
															</div>
														)}
														{(option.prerequisites?.length ?? 0) < 3 &&
															!getPrerequisiteTypeOptions(i, j).every(
																({ value }) =>
																	option.prerequisites?.some(
																		prerequisite => prerequisite.type === value
																	)
															) && (
																<Button
																	positive
																	onClick={getHandleAddSubfeatureOptionsOptionPrerequisite(
																		i,
																		j
																	)}
																>
																	Add Prerequisite
																</Button>
															)}
													</>
												)}
											</div>
										))}
										{feature.subFeatureOptions.options.length < 20 && (
											<Button
												positive
												onClick={getHandleSubfeatureOptionsAddOption(i)}
											>
												Add Subfeature
											</Button>
										)}
									</div>
									<Button onClick={getHandleRemoveSubfeatureOptions(i)}>
										Remove Subfeatures
									</Button>
								</div>
							)}
							{!feature.subFeatureOptions && (
								<Button
									positive
									style={{ width: 'fit-content', margin: '0 auto' }}
									onClick={getHandleAddSubfeatureOptions(i)}
								>
									Add Subfeatures
								</Button>
							)}
						</div>
					))}
				</div>
			)}
			{values.features.length < 20 && (
				<Button positive onClick={handleAddFeature}>
					Add Feature
				</Button>
			)}
		</section>
	);
};

export default Features;
