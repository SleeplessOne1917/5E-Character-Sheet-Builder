'use client';

import {
	EditingClassState,
	setSavingThrow
} from '../../../../redux/features/editingClass';

import { AbilityItem } from '../../../../types/srd';
import { Item } from '../../../../types/db/item';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import styles from './SavingThrows.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useCallback } from 'react';
import { useFormikContext } from 'formik';

type SavingThrowsProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	abilities: AbilityItem[];
};

const savingThrowErrorMessage = 'Saving throws required';

const SavingThrows = ({
	clickedSubmit,
	shouldUseReduxStore,
	abilities
}: SavingThrowsProps) => {
	const {
		values,
		errors,
		touched,
		setFieldValue,
		setFieldTouched,
		setFieldError
	} = useFormikContext<EditingClassState>();
	const dispatch = useAppDispatch();

	const getAbilitiesOptions = useCallback(
		(index: number) =>
			abilities
				.map<Option>(ability => ({
					value: ability.index,
					label: ability.full_name
				}))
				.filter(
					({ value }) =>
						!values.savingThrows.some(savingThrow => savingThrow?.id === value)
				)
				.concat(
					values.savingThrows[index]
						? [
								{
									value: values.savingThrows[index]?.id,
									label: values.savingThrows[index]?.name
								} as Option
						  ]
						: []
				)
				.concat([{ label: '\u2014', value: 'blank' } as Option]),
		[abilities, values.savingThrows]
	);

	const getSavingThrowError = useCallback(
		(index: number) =>
			errors.savingThrows
				? (errors.savingThrows as (string | undefined)[])[index]
					? savingThrowErrorMessage
					: undefined
				: undefined,
		[errors.savingThrows]
	);

	const getSavingThrowTouched = useCallback(
		(index: number) =>
			touched.savingThrows
				? (touched.savingThrows as unknown as boolean[])[index]
				: undefined,
		[touched.savingThrows]
	);

	const getHandleSavingThrowChange = useCallback(
		(index: number) => (value: string | number) => {
			const foundAbility = abilities.find(ability => ability.index === value);
			const newSavingThrow = foundAbility
				? ({ id: foundAbility.index, name: foundAbility.full_name } as Item)
				: null;

			if (shouldUseReduxStore) {
				dispatch(setSavingThrow({ index, savingThrow: newSavingThrow }));
			}

			setFieldValue(`savingThrows.${index}`, newSavingThrow, false);
			setFieldTouched(`savingThrows.${index}`, true, false);
			setFieldError(
				`savingThrows.${index}`,
				!foundAbility ? savingThrowErrorMessage : undefined
			);
		},
		[
			abilities,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			shouldUseReduxStore
		]
	);

	return (
		<section className={styles.container}>
			<h2>Saving Throws</h2>
			<div className={styles['saving-throws']}>
				{values.savingThrows.map((savingThrow, i) => (
					<Select
						key={i}
						options={getAbilitiesOptions(i)}
						id={`savingThrows.${i}`}
						label={`Saving Throw ${i + 1}`}
						value={savingThrow?.id ?? 'blank'}
						error={getSavingThrowError(i)}
						touched={clickedSubmit || getSavingThrowTouched(i)}
						onChange={getHandleSavingThrowChange(i)}
					/>
				))}
			</div>
		</section>
	);
};

export default SavingThrows;
