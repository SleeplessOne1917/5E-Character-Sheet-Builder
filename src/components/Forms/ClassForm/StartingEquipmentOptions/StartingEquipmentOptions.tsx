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
	ItemType,
	OptionType,
	StartingEquipmentChoiceType,
	addStartingEquipmentChoice,
	addStartingEquipmentChoiceOption,
	addStartingEquipmentChoiceOptionItem,
	removeStartingEquipmentChoice,
	removeStartingEquipmentChoiceOption,
	removeStartingEquipmentChoiceOptionItem,
	setStartingEquipmentChoiceChoose,
	setStartingEquipmentChoiceOptionChoose,
	setStartingEquipmentChoiceOptionCount,
	setStartingEquipmentChoiceOptionEquipmentCategory,
	setStartingEquipmentChoiceOptionItem,
	setStartingEquipmentChoiceOptionItemChoose,
	setStartingEquipmentChoiceOptionItemCount,
	setStartingEquipmentChoiceOptionItemEquipmentCategory,
	setStartingEquipmentChoiceOptionItemItem,
	setStartingEquipmentChoiceOptionItemType,
	setStartingEquipmentChoiceOptionType
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { SrdEquipmentItem, SrdItem } from '../../../../types/srd';
import { ToastShowPayload, show } from '../../../../redux/features/toast';

import Button from '../../../Button/Button';
import { Item } from '../../../../types/db/item';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { ToastType } from '../../../../types/toast';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { getEquipmentCategoryWithEquipment } from '../../../../graphql/srdClientService';
import styles from './StartingEquipmentOptions.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type StartingEquipmentOptionsProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	equipments: SrdEquipmentItem[];
	equipmentCategories: SrdItem[];
};

const chooseErrorMessage = 'Must have number of options to choose';
const countErrorMessage = 'Count is required';
const itemErrorMessage = 'Item is required';
const equipmentCategoryErrorMessage = 'Equipment category is required';
const optionsErrorMessage = 'There must be at least 1 option to choose from';
const itemsErrorMessage = 'Must have at least 1 item';

const optionTypeOptions: Option[] = [
	{ label: 'Item', value: 'item' },
	{ label: 'Equipment Category', value: 'category' },
	{ label: 'Multiple', value: 'multiple' }
];

const itemTypeOptions = optionTypeOptions.filter(
	option => option.value !== 'multiple'
);

const getChoiceStr = (index: number) => `startingEquipmentChoices.${index}`;

const getOptionStr = (choiceIndex: number, optionIndex: number) =>
	`${getChoiceStr(choiceIndex)}.options.${optionIndex}`;

const getItemStr = (
	choiceIndex: number,
	optionIndex: number,
	itemIndex: number
) => `${getOptionStr(choiceIndex, optionIndex)}.items.${itemIndex}`;

const StartingEquipmentOptions = ({
	clickedSubmit,
	equipments,
	equipmentCategories,
	shouldUseReduxStore
}: StartingEquipmentOptionsProps) => {
	const {
		values,
		setFieldValue,
		errors,
		touched,
		setFieldError,
		setFieldTouched
	} = useFormikContext<EditingClassState>();
	const dispatch = useAppDispatch();

	const [equipmentByCategory, setEquipmentByCategory] = useState<
		Record<string, SrdItem[]>
	>({});

	const [
		optionsSelectedEquipmentCategoryIds,
		setOptionsSelectedEquipmentCategoryIds
	] = useState(
		values.startingEquipmentChoices?.map(choice =>
			choice.options.map(
				option =>
					equipments.find(eq => eq.index === option.item?.id)
						?.equipment_category.index ?? null
			)
		) ?? []
	);

	const [
		optionsItemsSelectedEquipmentCategoryIds,
		setOptionsItemsSelectedEquipmentCategoryIds
	] = useState(
		values.startingEquipmentChoices?.map(choice =>
			choice.options.map(
				option =>
					option.items?.map(
						item =>
							equipments.find(eq => eq.index === item?.item?.id)
								?.equipment_category.index ?? null
					) ?? []
			)
		) ?? []
	);

	const equipmentCategoryOptions = useMemo(
		() =>
			[{ label: '\u2014', value: 'blank' } as Option].concat(
				equipmentCategories
					.filter(cat => cat.index !== 'mounts_and_vehicles')
					.map(({ index, name }) => ({ label: name, value: index }))
			),
		[equipmentCategories]
	);

	const getChoiceError = useCallback(
		function get<T>(index: number) {
			return errors.startingEquipmentChoices
				? (
						errors.startingEquipmentChoices as unknown as FormikErrors<
							StartingEquipmentChoiceType[]
						>
				  )[index]
					? ((
							errors.startingEquipmentChoices as unknown as FormikErrors<
								StartingEquipmentChoiceType[]
							>
					  )[index] as FormikErrors<T>)
					: undefined
				: undefined;
		},
		[errors.startingEquipmentChoices]
	);

	const getChoiceTouched = useCallback(
		function get<T>(index: number) {
			return touched.startingEquipmentChoices
				? (
						touched.startingEquipmentChoices as unknown as FormikErrors<
							StartingEquipmentChoiceType[]
						>
				  )[index]
					? ((
							touched.startingEquipmentChoices as unknown as FormikErrors<
								StartingEquipmentChoiceType[]
							>
					  )[index] as FormikTouched<T>)
					: undefined
				: undefined;
		},
		[touched.startingEquipmentChoices]
	);

	const getOptionError = useCallback(
		function get<T>(choiceIndex: number, optionIndex: number) {
			return getChoiceError<{ options: T[] }>(choiceIndex)?.options &&
				typeof getChoiceError<{ options: T[] }>(choiceIndex)?.options !==
					'string'
				? (getChoiceError<{ options: T[] }>(choiceIndex)!.options![
						optionIndex
				  ] as FormikErrors<T>)
				: undefined;
		},
		[getChoiceError]
	);

	const getOptionTouched = useCallback(
		function get<T>(choiceIndex: number, optionIndex: number) {
			return getChoiceTouched<{ options: T[] }>(choiceIndex)?.options &&
				typeof getChoiceTouched<{ options: T[] }>(choiceIndex)?.options !==
					'boolean'
				? ((getChoiceTouched<{ options: T[] }>(choiceIndex)!
						.options as FormikTouched<T[]>)![
						optionIndex
				  ] as unknown as FormikTouched<T>)
				: undefined;
		},
		[getChoiceTouched]
	);

	const getItemError = useCallback(
		function get<T>(
			choiceIndex: number,
			optionIndex: number,
			itemIndex: number
		) {
			return getOptionError<{ items: Item[] }>(choiceIndex, optionIndex)
				?.items &&
				typeof getOptionError<{ items: Item[] }>(choiceIndex, optionIndex)
					?.items !== 'string'
				? (getOptionError<{ items: Item[] }>(choiceIndex, optionIndex)!.items![
						itemIndex
				  ] as FormikErrors<T>)
				: undefined;
		},
		[getOptionError]
	);

	const getItemTouched = useCallback(
		function get<T>(
			choiceIndex: number,
			optionIndex: number,
			itemIndex: number
		) {
			return getOptionTouched<{ items: Item[] }>(choiceIndex, optionIndex)
				?.items &&
				typeof getOptionTouched<{ items: Item[] }>(choiceIndex, optionIndex)
					?.items !== 'boolean'
				? (getOptionTouched<{ items: Item[] }>(choiceIndex, optionIndex)!
						.items![itemIndex] as FormikTouched<T>)
				: undefined;
		},
		[getOptionTouched]
	);

	const handleAddChoice = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addStartingEquipmentChoice());
		}

		setOptionsSelectedEquipmentCategoryIds(prev => [...prev, []]);
		setOptionsItemsSelectedEquipmentCategoryIds(prev => [...prev, []]);

		setFieldValue(
			'startingEquipmentChoices',
			[...(values.startingEquipmentChoices ?? []), { options: [] }],
			false
		);
	}, [
		shouldUseReduxStore,
		dispatch,
		values.startingEquipmentChoices,
		setFieldValue
	]);

	const getHandleRemoveChoice = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeStartingEquipmentChoice(index));
			}

			setOptionsSelectedEquipmentCategoryIds(prev =>
				prev.filter((_, i) => i !== index)
			);
			setOptionsItemsSelectedEquipmentCategoryIds(prev =>
				prev.filter((_, i) => i !== index)
			);

			const newValues = values.startingEquipmentChoices?.filter(
				(_, i) => i !== index
			);

			setFieldValue(
				'startingEquipmentChoices',
				newValues?.length === 0 ? undefined : newValues,
				false
			);
		},
		[
			shouldUseReduxStore,
			dispatch,
			values.startingEquipmentChoices,
			setFieldValue
		]
	);

	const getChooseError = useCallback(
		(index: number) =>
			getChoiceError<{ choose: number }>(index)?.choose
				? chooseErrorMessage
				: undefined,
		[getChoiceError]
	);

	const getChooseTouched = useCallback(
		(index: number) => !!getChoiceTouched<{ choose: number }>(index)?.choose,
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
					dispatch(
						setStartingEquipmentChoiceChoose({ index, choose: newValue })
					);
				}

				const field = `${getChoiceStr(index)}.choose`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? chooseErrorMessage : undefined);
			},
		[
			dispatch,
			shouldUseReduxStore,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);

	const getHandleAddOption = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(addStartingEquipmentChoiceOption(index));
			}

			setOptionsSelectedEquipmentCategoryIds(prev =>
				prev.map((ecs, i) => (i === index ? [...ecs, null] : ecs))
			);

			setOptionsItemsSelectedEquipmentCategoryIds(prev =>
				prev.map((ecs, i) => (i === index ? [...ecs, []] : ecs))
			);

			const field = `${getChoiceStr(index)}.options`;
			const oldOptions = values.startingEquipmentChoices![index].options;

			setFieldValue(field, [...oldOptions, { optionType: 'item' }], false);

			if (oldOptions.length === 0) {
				setFieldError(field, undefined);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldError,
			values.startingEquipmentChoices
		]
	);

	const getHandleRemoveOption = useCallback(
		(choiceIndex: number, optionIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(
					removeStartingEquipmentChoiceOption({ choiceIndex, optionIndex })
				);
			}

			setOptionsSelectedEquipmentCategoryIds(prev =>
				prev.map((ecs, i) =>
					i === choiceIndex ? ecs.filter((_, j) => j !== optionIndex) : ecs
				)
			);

			setOptionsItemsSelectedEquipmentCategoryIds(prev =>
				prev.map((ecs, i) =>
					i === choiceIndex ? ecs.filter((_, j) => j !== optionIndex) : ecs
				)
			);

			const newOptions = values.startingEquipmentChoices![
				choiceIndex
			].options.filter((_, i) => i !== optionIndex);
			const field = `${getChoiceStr(choiceIndex)}.options`;

			setFieldValue(field, newOptions, false);

			if (newOptions.length === 0) {
				setFieldTouched(field, true, false);
				setFieldError(field, optionsErrorMessage);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError,
			values.startingEquipmentChoices
		]
	);

	const getChoiceOptionsError = useCallback(
		(index: number) =>
			typeof getChoiceError<StartingEquipmentChoiceType>(index)?.options ===
			'string'
				? optionsErrorMessage
				: undefined,
		[getChoiceError]
	);

	const getChoiceOptionsTouched = useCallback(
		(index: number) =>
			typeof getChoiceTouched<StartingEquipmentChoiceType>(index)?.options ===
			'boolean',
		[getChoiceTouched]
	);

	const getHandleOptionTypeChange = useCallback(
		(choiceIndex: number, optionIndex: number) => (value: string | number) => {
			const newValue = value as OptionType;

			if (
				newValue !==
				values.startingEquipmentChoices![choiceIndex].options[optionIndex]
					.optionType
			) {
				if (shouldUseReduxStore) {
					dispatch(
						setStartingEquipmentChoiceOptionType({
							choiceIndex,
							optionIndex,
							optionType: newValue
						})
					);
				}

				setOptionsSelectedEquipmentCategoryIds(prev =>
					prev.map((ecs, i) =>
						i === choiceIndex
							? ecs.map((cat, j) => (j === optionIndex ? null : cat))
							: ecs
					)
				);

				setFieldValue(
					getOptionStr(choiceIndex, optionIndex),
					{ optionType: newValue },
					false
				);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			values.startingEquipmentChoices
		]
	);

	const getOptionCountError = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionError<{ count: number }>(choiceIndex, optionIndex)?.count
				? countErrorMessage
				: undefined,
		[getOptionError]
	);

	const getOptionCountTouched = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionTouched<{ count: number }>(choiceIndex, optionIndex)?.count,
		[getOptionTouched]
	);

	const getHandleOptionCountChange = useCallback(
		(
				choiceIndex: number,
				optionIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`${getOptionStr(choiceIndex, optionIndex)}.count`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleOptionCountBlur = useCallback(
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
						setStartingEquipmentChoiceOptionCount({
							choiceIndex,
							optionIndex,
							count: newValue
						})
					);
				}

				const field = `${getOptionStr(choiceIndex, optionIndex)}.count`;
				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? countErrorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);

	const getHandleOptionItemCategoryChange = useCallback(
		(choiceIndex: number, optionIndex: number) => (value: string | number) => {
			const newValue = value !== 'blank' ? (value as string) : null;

			if (
				optionsSelectedEquipmentCategoryIds[choiceIndex][optionIndex] !==
				newValue
			) {
				if (shouldUseReduxStore) {
					dispatch(
						setStartingEquipmentChoiceOptionItem({ choiceIndex, optionIndex })
					);
				}

				setFieldValue(
					`${getOptionStr(choiceIndex, optionIndex)}.item`,
					undefined,
					false
				);

				setOptionsSelectedEquipmentCategoryIds(prev =>
					prev.map((ecs, i) =>
						i === choiceIndex
							? ecs.map((ec, j) => (j === optionIndex ? newValue : ec))
							: ecs
					)
				);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			optionsSelectedEquipmentCategoryIds
		]
	);

	const getOptionItemError = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionError<{ item: Item }>(choiceIndex, optionIndex)?.item
				? itemErrorMessage
				: undefined,
		[getOptionError]
	);

	const getOptionItemTouched = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			!!getOptionTouched<{ item: Item }>(choiceIndex, optionIndex)?.item,
		[getOptionTouched]
	);

	const getItemOptions = useCallback(
		(category: string | null) => {
			let options = [{ label: '\u2014', value: 'blank' } as Option];

			if (category && equipmentByCategory[category]) {
				options = options.concat(
					equipmentByCategory[category].map(cat => ({
						label: cat.name,
						value: cat.index
					}))
				);
			} else if (category) {
				getEquipmentCategoryWithEquipment(category).then(result => {
					if (result.data) {
						setEquipmentByCategory(prev => ({
							...prev,
							[category]: result.data?.equipmentCategory.equipment ?? []
						}));
					} else if (result.error) {
						const toastShowPayload: ToastShowPayload = {
							message: 'Error fetching equipment',
							type: ToastType.error,
							closeTimeoutSeconds: 5
						};

						dispatch(show(toastShowPayload));
					}
				});
			}

			return options;
		},
		[dispatch, equipmentByCategory]
	);

	const getOptionItemOptions = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getItemOptions(
				optionsSelectedEquipmentCategoryIds[choiceIndex][optionIndex]
			),
		[getItemOptions, optionsSelectedEquipmentCategoryIds]
	);

	const getItemItemOptions = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			getItemOptions(
				optionsItemsSelectedEquipmentCategoryIds[choiceIndex][optionIndex][
					itemIndex
				]
			),
		[getItemOptions, optionsItemsSelectedEquipmentCategoryIds]
	);

	const getHandleItemChange = useCallback(
		(choiceIndex: number, optionIndex: number) => (value: string | number) => {
			const foundEquipment = equipments.find(
				equipment => equipment.index === value
			);
			const newItem: Item | undefined = foundEquipment
				? { id: foundEquipment.index, name: foundEquipment.name }
				: undefined;

			if (shouldUseReduxStore) {
				dispatch(
					setStartingEquipmentChoiceOptionItem({
						choiceIndex,
						optionIndex,
						item: newItem
					})
				);
			}

			const field = `${getOptionStr(choiceIndex, optionIndex)}.item`;
			setFieldValue(field, newItem, false);
			setFieldTouched(field, true, false);
			setFieldError(field, !newItem ? itemErrorMessage : undefined);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError,
			equipments
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

	const getHandleOptionChooseBlur = useCallback(
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
						setStartingEquipmentChoiceOptionChoose({
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

	const getOptionEquipmentCategoryError = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			getOptionError<{ equipmentCategory: Item }>(choiceIndex, optionIndex)
				?.equipmentCategory
				? equipmentCategoryErrorMessage
				: undefined,
		[getOptionError]
	);

	const getOptionEquipmentCategoryTouched = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			!!getOptionTouched<{ equipmentCategory: Item }>(choiceIndex, optionIndex)
				?.equipmentCategory,
		[getOptionTouched]
	);

	const getHandleOptionEquipmentCategoryChange = useCallback(
		(choiceIndex: number, optionIndex: number) => (value: string | number) => {
			const foundEquipmentCategory = equipmentCategories.find(
				cat => cat.index === value
			);
			const newCategory: Item | undefined = foundEquipmentCategory
				? {
						id: foundEquipmentCategory.index,
						name: foundEquipmentCategory.name
				  }
				: undefined;

			if (shouldUseReduxStore) {
				dispatch(
					setStartingEquipmentChoiceOptionEquipmentCategory({
						choiceIndex,
						optionIndex,
						equipmentCategory: newCategory
					})
				);
			}

			const field = `${getOptionStr(
				choiceIndex,
				optionIndex
			)}.equipmentCategory`;

			setFieldValue(field, newCategory, false);
			setFieldTouched(field, true, false);
			setFieldError(
				field,
				!newCategory ? equipmentCategoryErrorMessage : undefined
			);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			equipmentCategories
		]
	);

	const getHandleAddOptionItem = useCallback(
		(choiceIndex: number, optionIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(
					addStartingEquipmentChoiceOptionItem({ choiceIndex, optionIndex })
				);
			}

			setOptionsItemsSelectedEquipmentCategoryIds(prev =>
				prev.map((ecsLists, i) =>
					i === choiceIndex
						? ecsLists.map((ecs, j) =>
								j === optionIndex ? [...ecs, null] : ecs
						  )
						: ecsLists
				)
			);

			const field = `${getOptionStr(choiceIndex, optionIndex)}.items`;
			const oldItems =
				values.startingEquipmentChoices![choiceIndex].options[optionIndex]
					.items ?? [];

			setFieldValue(field, [...oldItems, { itemType: 'item' }], false);

			if (oldItems.length === 0) {
				setFieldError(field, undefined);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldError,
			values.startingEquipmentChoices
		]
	);

	const getHandleRemoveOptionItem = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(
					removeStartingEquipmentChoiceOptionItem({
						choiceIndex,
						optionIndex,
						itemIndex
					})
				);
			}

			setOptionsItemsSelectedEquipmentCategoryIds(prev =>
				prev.map((ecsLists, i) =>
					i === choiceIndex
						? ecsLists.map((ecs, j) =>
								j === optionIndex ? ecs.filter((_, k) => k !== itemIndex) : ecs
						  )
						: ecsLists
				)
			);

			const newItems = values.startingEquipmentChoices![choiceIndex].options[
				optionIndex
			].items?.filter((_, i) => i !== itemIndex);
			const field = `${getOptionStr(choiceIndex, optionIndex)}.items`;

			setFieldValue(
				field,
				(newItems?.length ?? 0) > 0 ? newItems : undefined,
				false
			);

			if ((newItems?.length ?? 0) === 0) {
				setFieldTouched(field, true, false);
				setFieldError(field, itemsErrorMessage);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError,
			values.startingEquipmentChoices
		]
	);

	const getOptionItemsError = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			typeof getOptionError<{ items: Item[] }>(choiceIndex, optionIndex)
				?.items === 'string'
				? itemsErrorMessage
				: undefined,
		[getOptionError]
	);

	const getOptionItemsTouched = useCallback(
		(choiceIndex: number, optionIndex: number) =>
			typeof getOptionTouched<{ items: Item[] }>(choiceIndex, optionIndex)
				?.items === 'boolean',
		[getOptionTouched]
	);

	const getHandleItemTypeChange = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			(value: string | number) => {
				const newValue = value as ItemType;

				if (
					newValue !==
					values.startingEquipmentChoices![choiceIndex].options[optionIndex]
						.items![itemIndex].itemType
				) {
					if (shouldUseReduxStore) {
						dispatch(
							setStartingEquipmentChoiceOptionItemType({
								choiceIndex,
								optionIndex,
								itemIndex,
								itemType: newValue
							})
						);
					}

					setOptionsItemsSelectedEquipmentCategoryIds(prev =>
						prev.map((ecsList, i) =>
							i === choiceIndex
								? ecsList.map((ecs, j) =>
										j === optionIndex
											? ecs.map((cat, k) => (k === itemIndex ? null : cat))
											: ecs
								  )
								: ecsList
						)
					);

					setFieldValue(
						`${getItemStr(choiceIndex, optionIndex, itemIndex)}.itemType`,
						newValue,
						false
					);
				}
			},
		[
			dispatch,
			shouldUseReduxStore,
			values.startingEquipmentChoices,
			setFieldValue
		]
	);

	const getItemCountError = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			getItemError<{ count: number }>(choiceIndex, optionIndex, itemIndex)
				?.count
				? countErrorMessage
				: undefined,
		[getItemError]
	);

	const getItemCountTouched = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			getItemTouched<{ count: number }>(choiceIndex, optionIndex, itemIndex)
				?.count,
		[getItemTouched]
	);

	const getHandleItemCountChange = useCallback(
		(
				choiceIndex: number,
				optionIndex: number,
				itemIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`${getItemStr(choiceIndex, optionIndex, itemIndex)}.count`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleItemCountBlur = useCallback(
		(
				choiceIndex: number,
				optionIndex: number,
				itemIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setStartingEquipmentChoiceOptionItemCount({
							choiceIndex,
							optionIndex,
							itemIndex,
							count: newValue
						})
					);
				}

				const field = `${getItemStr(
					choiceIndex,
					optionIndex,
					itemIndex
				)}.count`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? countErrorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError
		]
	);

	const getHandleOptionItemItemCategoryChange = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			(value: string | number) => {
				const newValue = value !== 'blank' ? (value as string) : null;
				if (
					optionsItemsSelectedEquipmentCategoryIds[choiceIndex][optionIndex][
						itemIndex
					] !== newValue
				) {
					if (shouldUseReduxStore) {
						dispatch(
							setStartingEquipmentChoiceOptionItemItem({
								choiceIndex,
								optionIndex,
								itemIndex
							})
						);
					}

					setOptionsItemsSelectedEquipmentCategoryIds(prev =>
						prev.map((ecsList, i) =>
							i === choiceIndex
								? ecsList.map((ecs, j) =>
										j === optionIndex
											? ecs.map((cat, k) => (k === itemIndex ? newValue : cat))
											: ecs
								  )
								: ecsList
						)
					);

					setFieldValue(
						`${getItemStr(choiceIndex, optionIndex, itemIndex)}.item`,
						undefined,
						false
					);
				}
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			optionsItemsSelectedEquipmentCategoryIds
		]
	);

	const getItemItemError = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			getItemError<{ item: Item }>(choiceIndex, optionIndex, itemIndex)?.item
				? itemErrorMessage
				: undefined,
		[getItemError]
	);

	const getItemItemTouched = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			!!getItemTouched<{ item: Item }>(choiceIndex, optionIndex, itemIndex)
				?.item,
		[getItemTouched]
	);

	const getHandleOptionItemItemChange = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			(value: string | number) => {
				const foundEquipment = equipments.find(
					equipment => equipment.index === value
				);
				const newItem: Item | undefined = foundEquipment
					? { id: foundEquipment.index, name: foundEquipment.name }
					: undefined;

				if (shouldUseReduxStore) {
					dispatch(
						setStartingEquipmentChoiceOptionItemItem({
							choiceIndex,
							optionIndex,
							itemIndex,
							item: newItem
						})
					);
				}

				const field = `${getItemStr(choiceIndex, optionIndex, itemIndex)}.item`;
				setFieldValue(field, newItem, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newItem ? itemErrorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			equipments
		]
	);

	const getItemChooseError = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			getItemError<{ choose: number }>(choiceIndex, optionIndex, itemIndex)
				?.choose
				? chooseErrorMessage
				: undefined,
		[getItemError]
	);

	const getItemChooseTouched = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			getItemTouched<{ choose: number }>(choiceIndex, optionIndex, itemIndex)
				?.choose,
		[getItemTouched]
	);

	const getHandleOptionItemChooseChange = useCallback(
		(
				choiceIndex: number,
				optionIndex: number,
				itemIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`${getItemStr(choiceIndex, optionIndex, itemIndex)}.choose`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleOptionItemChooseBlur = useCallback(
		(
				choiceIndex: number,
				optionIndex: number,
				itemIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setStartingEquipmentChoiceOptionItemChoose({
							choiceIndex,
							optionIndex,
							itemIndex,
							choose: newValue
						})
					);
				}

				const field = `${getItemStr(
					choiceIndex,
					optionIndex,
					itemIndex
				)}.choose`;
				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
				setFieldError(field, !newValue ? countErrorMessage : undefined);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldValue,
			setFieldTouched
		]
	);

	const getItemEquipmentCategoryError = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			getItemError<{ equipmentCategory: Item }>(
				choiceIndex,
				optionIndex,
				itemIndex
			)?.equipmentCategory
				? equipmentCategoryErrorMessage
				: undefined,
		[getItemError]
	);

	const getItemEquipmentCategoryTouched = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			!!getItemTouched<{ equipmentCategory: Item }>(
				choiceIndex,
				optionIndex,
				itemIndex
			)?.equipmentCategory,
		[getItemTouched]
	);

	const getHandleOptionItemEquipmentCategoryChange = useCallback(
		(choiceIndex: number, optionIndex: number, itemIndex: number) =>
			(value: string | number) => {
				const foundEquipmentCategory = equipmentCategories.find(
					cat => cat.index === value
				);
				const newCategory: Item | undefined = foundEquipmentCategory
					? {
							id: foundEquipmentCategory.index,
							name: foundEquipmentCategory.name
					  }
					: undefined;

				if (shouldUseReduxStore) {
					dispatch(
						setStartingEquipmentChoiceOptionItemEquipmentCategory({
							choiceIndex,
							optionIndex,
							itemIndex,
							equipmentCategory: newCategory
						})
					);
				}

				const field = `${getItemStr(
					choiceIndex,
					optionIndex,
					itemIndex
				)}.equipmentCategory`;

				setFieldValue(field, newCategory, false);
				setFieldTouched(field, true, false);
				setFieldError(
					field,
					!newCategory ? equipmentCategoryErrorMessage : undefined
				);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError,
			equipmentCategories
		]
	);

	return (
		<section className={styles.container}>
			<h2>Starting Equipment Choices</h2>
			<div className={styles['choices-container']}>
				{values.startingEquipmentChoices?.map((choice, i) => (
					<div key={i} className={styles.choice}>
						<div className={styles['choose-container']}>
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
								onClick={getHandleRemoveChoice(i)}
							>
								<XMarkIcon className={styles['close-button-icon']} /> Remove
							</Button>
							<NumberTextInput
								id={`${getChoiceStr(i)}.choose`}
								label="Choose"
								value={choice.choose}
								error={getChooseError(i)}
								touched={clickedSubmit || getChooseTouched(i)}
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
								{choice.options.map((option, j) => (
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
											id={`${getOptionStr(i, j)}.optionType`}
											label="Option Type"
											options={optionTypeOptions}
											value={option.optionType}
											onChange={getHandleOptionTypeChange(i, j)}
										/>
										{option.optionType === 'item' && (
											<>
												<NumberTextInput
													id={`${getOptionStr(i, j)}.count`}
													label="Count"
													value={option.count}
													error={getOptionCountError(i, j)}
													touched={clickedSubmit || getOptionCountTouched(i, j)}
													onChange={getHandleOptionCountChange(i, j)}
													onBlur={getHandleOptionCountBlur(i, j)}
												/>
												<Select
													id={`${getOptionStr(i, j)}.itemCategory`}
													label="Equipment Category"
													value={
														optionsSelectedEquipmentCategoryIds[i][j] ?? 'blank'
													}
													error={
														!optionsSelectedEquipmentCategoryIds[i][j]
															? getOptionItemError(i, j)
															: undefined
													}
													touched={
														!optionsSelectedEquipmentCategoryIds[i][j] &&
														(clickedSubmit || getOptionItemTouched(i, j))
													}
													options={equipmentCategoryOptions}
													onChange={getHandleOptionItemCategoryChange(i, j)}
												/>
												{optionsSelectedEquipmentCategoryIds[i][j] && (
													<Select
														id={`${getOptionStr(i, j)}.item`}
														label="Item"
														value={option.item?.id ?? 'blank'}
														options={getOptionItemOptions(i, j)}
														error={getOptionItemError(i, j)}
														touched={
															clickedSubmit || getOptionItemTouched(i, j)
														}
														onChange={getHandleItemChange(i, j)}
													/>
												)}
											</>
										)}
										{option.optionType === 'category' && (
											<>
												<NumberTextInput
													id={`${getOptionStr(i, j)}.choose`}
													label="Choose"
													value={option.choose}
													error={getOptionChooseError(i, j)}
													touched={
														clickedSubmit || getOptionChooseTouched(i, j)
													}
													onChange={getHandleOptionChooseChange(i, j)}
													onBlur={getHandleOptionChooseBlur(i, j)}
												/>
												<Select
													id={`${getOptionStr(i, j)}.equipmentCategory`}
													label="From"
													value={option.equipmentCategory?.id ?? 'blank'}
													options={equipmentCategoryOptions}
													error={getOptionEquipmentCategoryError(i, j)}
													touched={
														clickedSubmit ||
														getOptionEquipmentCategoryTouched(i, j)
													}
													onChange={getHandleOptionEquipmentCategoryChange(
														i,
														j
													)}
												/>
											</>
										)}
										{option.optionType === 'multiple' && (
											<div className={styles['from-container']}>
												<div
													className={`${styles['from-label-container']}${
														(clickedSubmit || getOptionItemsTouched(i, j)) &&
														getOptionItemsError(i, j)
															? ` ${styles.error}`
															: ''
													}`}
												>
													<div className={styles['items-label']}>Items</div>
													{(clickedSubmit || getOptionItemsTouched(i, j)) &&
														getOptionItemsError(i, j) && (
															<div className={styles['error-message']}>
																{getOptionItemsError(i, j)}
															</div>
														)}
												</div>
												<div className={styles['options-container']}>
													{option.items?.map((item, k) => (
														<div key={k} className={styles.item}>
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
																onClick={getHandleRemoveOptionItem(i, j, k)}
															>
																<XMarkIcon
																	className={styles['close-button-icon']}
																/>{' '}
																Remove
															</Button>
															<Select
																id={`${getItemStr(i, j, k)}.itemType`}
																label="Item Type"
																options={itemTypeOptions}
																value={item.itemType}
																onChange={getHandleItemTypeChange(i, j, k)}
															/>
															{item.itemType === 'item' && (
																<>
																	<NumberTextInput
																		id={`${getItemStr(i, j, k)}.count`}
																		label="Count"
																		error={getItemCountError(i, j, k)}
																		touched={
																			clickedSubmit ||
																			getItemCountTouched(i, j, k)
																		}
																		value={item.count}
																		onChange={getHandleItemCountChange(i, j, k)}
																		onBlur={getHandleItemCountBlur(i, j, k)}
																	/>
																	<Select
																		id={`${getItemStr(i, j, k)}.itemCategory`}
																		label="Equipment Category"
																		value={
																			optionsItemsSelectedEquipmentCategoryIds[
																				i
																			][j][k] ?? 'blank'
																		}
																		error={
																			!optionsItemsSelectedEquipmentCategoryIds[
																				i
																			][j][k]
																				? getItemItemError(i, j, k)
																				: undefined
																		}
																		touched={
																			!optionsItemsSelectedEquipmentCategoryIds[
																				i
																			][j][k] &&
																			(clickedSubmit ||
																				getItemItemTouched(i, j, k))
																		}
																		options={equipmentCategoryOptions}
																		onChange={getHandleOptionItemItemCategoryChange(
																			i,
																			j,
																			k
																		)}
																	/>
																	{optionsItemsSelectedEquipmentCategoryIds[i][
																		j
																	][k] && (
																		<Select
																			id={`${getItemStr(i, j, k)}.item`}
																			label="Item"
																			value={item.item?.id ?? 'blank'}
																			options={getItemItemOptions(i, j, k)}
																			error={getItemItemError(i, j, k)}
																			touched={
																				clickedSubmit ||
																				getItemItemTouched(i, j, k)
																			}
																			onChange={getHandleOptionItemItemChange(
																				i,
																				j,
																				k
																			)}
																		/>
																	)}
																</>
															)}
															{item.itemType === 'category' && (
																<>
																	<NumberTextInput
																		id={`${getItemStr(i, j, k)}.choose`}
																		label="Choose"
																		value={option.choose}
																		error={getItemChooseError(i, j, k)}
																		touched={
																			clickedSubmit ||
																			getItemChooseTouched(i, j, k)
																		}
																		onChange={getHandleOptionItemChooseChange(
																			i,
																			j,
																			k
																		)}
																		onBlur={getHandleOptionItemChooseBlur(
																			i,
																			j,
																			k
																		)}
																	/>
																	<Select
																		id={`${getItemStr(
																			i,
																			j,
																			k
																		)}.equipmentCategory`}
																		label="From"
																		value={
																			option.equipmentCategory?.id ?? 'blank'
																		}
																		options={equipmentCategoryOptions}
																		error={getItemEquipmentCategoryError(
																			i,
																			j,
																			k
																		)}
																		touched={
																			clickedSubmit ||
																			getItemEquipmentCategoryTouched(i, j, k)
																		}
																		onChange={getHandleOptionItemEquipmentCategoryChange(
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
												{(option.items?.length ?? 0) < 5 && (
													<Button
														positive
														size="small"
														onClick={getHandleAddOptionItem(i, j)}
													>
														Add Item
													</Button>
												)}
											</div>
										)}
									</div>
								))}
							</div>
							{(choice.options?.length ?? 0) < 5 && (
								<Button positive size="small" onClick={getHandleAddOption(i)}>
									Add Option
								</Button>
							)}
						</div>
					</div>
				))}
			</div>
			{(values.startingEquipmentChoices?.length ?? 0) < 5 && (
				<Button positive onClick={handleAddChoice}>
					Add Equipment Option
				</Button>
			)}
		</section>
	);
};

export default StartingEquipmentOptions;
