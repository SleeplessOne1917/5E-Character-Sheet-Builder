'use client';

import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useMemo,
	useState
} from 'react';
import {
	CountedItem,
	EditingClassState,
	addStartingEquipment,
	removeStartingEquipment,
	setStartingEquipmentCount,
	setStartingEquipmentItem
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';

import Button from '../../../Button/Button';
import { Item } from '../../../../types/db/item';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { SrdEquipmentItem } from '../../../../types/srd';
import { XMarkIcon } from '@heroicons/react/20/solid';
import styles from './StartingEquipment.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type StartingEquipmentProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	equipments: SrdEquipmentItem[];
};

const countErrorMessage = 'Count is required';
const itemErrorMessage = 'Item is required';

const StartingEuipment = ({
	clickedSubmit,
	shouldUseReduxStore,
	equipments
}: StartingEquipmentProps) => {
	const {
		values,
		setFieldValue,
		errors,
		touched,
		setFieldError,
		setFieldTouched
	} = useFormikContext<EditingClassState>();
	const dispatch = useAppDispatch();

	const equipmentCategoryOptions = useMemo(
		() =>
			[{ label: '\u2014', value: 'blank' } as Option].concat(
				equipments.reduce<Option[]>(
					(acc, { equipment_category: { index, name } }) =>
						!acc.some(({ value }) => value === index) &&
						index !== 'mounts-and-vehicles'
							? [...acc, { label: name, value: index } as Option]
							: acc,
					[]
				)
			),
		[equipments]
	);

	const [selectedEquipmentCategories, setSelectedEquipmentCategories] =
		useState(
			values.startingEquipment.map(
				({ item }) =>
					equipments.find(equipment => equipment.index === item?.id)
						?.equipment_category.index ?? null
			)
		);

	const handleAddStartingEquipment = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addStartingEquipment());
		}

		setSelectedEquipmentCategories(prev => [...prev, null]);

		setFieldValue(
			'startingEquipment',
			[...values.startingEquipment, {}],
			false
		);
	}, [shouldUseReduxStore, values.startingEquipment, dispatch, setFieldValue]);

	const getHandleRemoveStartingEquipment = useCallback(
		(index: number) => () => {
			if (shouldUseReduxStore) {
				dispatch(removeStartingEquipment(index));
			}

			setSelectedEquipmentCategories(prev =>
				prev.filter((_, i) => i !== index)
			);

			setFieldValue(
				'startingEquipment',
				values.startingEquipment.filter((_, i) => i !== index),
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.startingEquipment]
	);

	const getHandleEquipmentCategoryChange = useCallback(
		(index: number) => (value: string | number) => {
			const newValue = value !== 'blank' ? (value as string) : null;

			if (shouldUseReduxStore) {
				dispatch(setStartingEquipmentItem({ index }));
			}

			setFieldValue(`startingEquipment.${index}.item`, undefined, false);
			setFieldTouched(`startingEquipment.${index}.item`, true, false);
			setFieldError(`startingEquipment.${index}.item`, undefined);

			setSelectedEquipmentCategories(prev =>
				prev.map((ec, i) => (i === index ? newValue : ec))
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

	const getCountError = useCallback(
		(index: number) =>
			errors.startingEquipment
				? (errors.startingEquipment as FormikErrors<CountedItem[]>)[index]
						?.count
					? countErrorMessage
					: undefined
				: undefined,
		[errors.startingEquipment]
	);

	const getCountTouched = useCallback(
		(index: number) =>
			touched.startingEquipment &&
			(touched.startingEquipment as FormikTouched<CountedItem[]>)[index]?.count,
		[touched.startingEquipment]
	);

	const getHandleCountChange = useCallback(
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`startingEquipment.${index}.count`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleCountBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(setStartingEquipmentCount({ index, count: newValue }));
				}

				setFieldValue(`startingEquipment.${index}.count`, newValue, false);
				setFieldTouched(`startingEquipment.${index}.count`, true, false);
				setFieldError(
					`startingEquipment.${index}.count`,
					!newValue ? countErrorMessage : undefined
				);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldValue,
			setFieldTouched
		]
	);

	const getItemOptions = useCallback(
		(index: number) =>
			[{ label: '\u2014', value: 'blank' } as Option].concat(
				equipments
					.filter(
						({ equipment_category }) =>
							equipment_category.index === selectedEquipmentCategories[index]
					)
					.map<Option>(equipment => ({
						label: equipment.name,
						value: equipment.index
					}))
			),
		[equipments, selectedEquipmentCategories]
	);

	const getItemError = useCallback(
		(index: number) =>
			errors.startingEquipment
				? (errors.startingEquipment as FormikErrors<CountedItem[]>)[index]?.item
					? itemErrorMessage
					: undefined
				: undefined,
		[errors.startingEquipment]
	);

	const getItemTouched = useCallback(
		(index: number) =>
			touched.startingEquipment &&
			(touched.startingEquipment as FormikTouched<CountedItem[]>)[index]?.item,
		[touched.startingEquipment]
	);

	const getHandleItemChange = useCallback(
		(index: number) => (value: string | number) => {
			const newId = value !== 'blank' ? (value as string) : undefined;
			const foundEquipment = equipments.find(
				equipment => equipment.index === newId
			);
			const newItem: Item | undefined = foundEquipment
				? { id: foundEquipment.index, name: foundEquipment.name }
				: undefined;

			if (shouldUseReduxStore) {
				dispatch(setStartingEquipmentItem({ index, item: newItem }));
			}

			setFieldValue(`startingEquipment.${index}.item`, newItem, false);
			setFieldTouched(`startingEquipment.${index}.item`, true, false);
			setFieldError(
				`startingEquipment.${index}.item`,
				!newItem ? itemErrorMessage : undefined
			);
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

	return (
		<section className={styles.container}>
			<h2>Starting Equipment</h2>
			<div className={styles.equipments}>
				{values.startingEquipment.map((equipment, i) => (
					<div key={i} className={styles.equipment}>
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
							onClick={getHandleRemoveStartingEquipment(i)}
						>
							<XMarkIcon className={styles['close-button-icon']} /> Remove
						</Button>
						<NumberTextInput
							id={`startingEquipment.${i}.count`}
							label="Count"
							error={getCountError(i)}
							touched={clickedSubmit || getCountTouched(i)}
							value={equipment.count}
							onChange={getHandleCountChange(i)}
							onBlur={getHandleCountBlur(i)}
						/>
						<Select
							id={`startingEquipment.${i}.category`}
							label="Equipment Category"
							options={equipmentCategoryOptions}
							value={selectedEquipmentCategories[i] ?? 'blank'}
							onChange={getHandleEquipmentCategoryChange(i)}
						/>
						{selectedEquipmentCategories[i] && (
							<Select
								id={`startingEquipment.${i}.item`}
								label="Item"
								options={getItemOptions(i)}
								value={equipment.item?.id ?? 'blank'}
								error={getItemError(i)}
								touched={clickedSubmit || getItemTouched(i)}
								onChange={getHandleItemChange(i)}
							/>
						)}
					</div>
				))}
			</div>
			{values.startingEquipment.length < 10 && (
				<Button positive onClick={handleAddStartingEquipment}>
					Add Starting Equipment
				</Button>
			)}
		</section>
	);
};

export default StartingEuipment;
