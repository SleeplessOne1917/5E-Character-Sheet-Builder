'use client';

import { ChangeEventHandler, FocusEventHandler, useCallback } from 'react';
import {
	EditingRaceState,
	setName,
	setSize,
	setSpeed
} from '../../../redux/features/editingRace';

import NumberTextInput from '../NumberTextInput/NumberTextInput';
import { SIZES } from '../../../constants/sizeConstants';
import Select from '../../Select/Select/Select';
import Size from '../../../types/size';
import TextInput from '../../TextInput/TextInput';
import { capitalize } from '../../../services/capitalizeService';
import classes from './NameSizeSpeed.module.css';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type NameSizeSpeedProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
};

const NameSizeSpeed = ({
	clickedSubmit,
	shouldUseReduxStore
}: NameSizeSpeedProps) => {
	const {
		values,
		handleChange,
		errors,
		touched,
		handleBlur,
		setFieldError,
		setFieldTouched,
		setFieldValue
	} = useFormikContext<EditingRaceState>();

	const dispatch = useAppDispatch();

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			if (shouldUseReduxStore) {
				dispatch(setName(e.target.value));
			}
			handleBlur(e);
		},
		[dispatch, handleBlur, shouldUseReduxStore]
	);

	const handleSizeChange = useCallback(
		(value: string | number) => {
			const newSize = value === 'blank' ? undefined : (value as Size);
			if (shouldUseReduxStore) {
				dispatch(setSize(newSize));
			}

			setFieldValue('size', newSize, false);
			setFieldTouched('size', true, false);
			setFieldError('size', !newSize ? 'Race size is required' : undefined);
		},
		[
			dispatch,
			shouldUseReduxStore,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);

	const handleSpeedChange: ChangeEventHandler<HTMLInputElement> = useCallback(
		event => {
			setFieldValue('speed', event.target.value, false);
		},
		[setFieldValue]
	);

	const handleSpeedBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			const parsedValue = parseInt(event.target.value);
			let newValue = !isNaN(parsedValue) ? parsedValue : undefined;
			if (newValue && newValue < 5) {
				newValue = 5;
			}
			if (newValue && newValue > 100) {
				newValue = 100;
			}
			if (newValue && newValue % 5 !== 0) {
				if (newValue % 5 <= 2) {
					newValue = newValue - (newValue % 5);
				} else {
					newValue = newValue + (5 - (newValue % 5));
				}
			}

			if (shouldUseReduxStore) {
				dispatch(setSpeed(newValue));
			}
			setFieldValue('speed', newValue, false);
			setFieldTouched('speed', true, false);
			setFieldError(
				'speed',
				newValue === undefined ? 'Speed is required' : undefined
			);
		},
		[
			dispatch,
			shouldUseReduxStore,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);

	return (
		<div className={classes['name-size-speed']}>
			<TextInput
				id="name"
				label="Name"
				value={values.name}
				onChange={handleChange}
				error={errors.name}
				touched={touched.name || clickedSubmit}
				onBlur={handleNameBlur}
			/>
			<Select
				id="size"
				label="Size"
				options={[{ label: '\u2014', value: 'blank' }].concat(
					SIZES.map(size => ({
						label: capitalize(size),
						value: size
					}))
				)}
				error={errors.size}
				touched={touched.size || clickedSubmit}
				value={values.size ?? 'blank'}
				onChange={handleSizeChange}
			/>
			<NumberTextInput
				label="Speed (in feet)"
				id="speed"
				touched={touched.speed || clickedSubmit}
				error={errors.speed}
				value={values.speed}
				onChange={handleSpeedChange}
				onBlur={handleSpeedBlur}
			/>
		</div>
	);
};

export default NameSizeSpeed;
