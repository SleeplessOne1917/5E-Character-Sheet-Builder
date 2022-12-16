'use client';

import {
	EditingClassState,
	setHitDie,
	setName
} from '../../../../redux/features/editingClass';
import { FocusEventHandler, useCallback } from 'react';

import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import TextInput from '../../../TextInput/TextInput';
import styles from './NameAndHitDie.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type NameAndHitDieProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
};

const hitDieOptions: Option[] = [
	{ label: '\u2014', value: 'blank' } as Option
].concat([6, 8, 10, 12].map(value => ({ label: `${value}`, value })));

const NameAndHitDie = ({
	clickedSubmit,
	shouldUseReduxStore
}: NameAndHitDieProps) => {
	const {
		values,
		errors,
		touched,
		handleBlur,
		handleChange,
		setFieldError,
		setFieldValue,
		setFieldTouched
	} = useFormikContext<EditingClassState>();
	const dispatch = useAppDispatch();

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			if (shouldUseReduxStore) {
				dispatch(setName(event.target.value));
			}

			handleBlur(event);
		},
		[handleBlur, shouldUseReduxStore, dispatch]
	);

	const handleHitDieChange = useCallback(
		(value: string | number) => {
			const newValue = value !== 'blank' ? (value as number) : undefined;

			if (shouldUseReduxStore) {
				dispatch(setHitDie(newValue));
			}

			setFieldValue('hitDie', newValue, false);
			setFieldTouched('hitDie', true, false);
			setFieldError('hitDie', !newValue ? 'Hit die is required' : undefined);
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
		<div className={styles.container}>
			<TextInput
				id="name"
				label="Name"
				value={values.name}
				error={errors.name}
				touched={touched.name}
				onChange={handleChange}
				onBlur={handleNameBlur}
			/>
			<Select
				options={hitDieOptions}
				error={errors.hitDie}
				touched={touched.hitDie}
				id="hitDie"
				label="Hit Die"
				value={values.hitDie ?? 'blank'}
				onChange={handleHitDieChange}
			/>
		</div>
	);
};

export default NameAndHitDie;
