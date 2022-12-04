'use client';

import { ChangeEventHandler, FocusEventHandler, useCallback } from 'react';
import {
	EditingSubraceState,
	setSize,
	setSpeed
} from '../../../../redux/features/editingSubrace';

import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import Option from '../../../Select/Option';
import { SIZES } from '../../../../constants/sizeConstants';
import Select from '../../../Select/Select/Select';
import Size from '../../../../types/size';
import { capitalize } from '../../../../services/capitalizeService';
import classes from './SizeAndSpeed.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type SizeAndSpeedProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
};

const sizesOptions = [{ label: '\u2014', value: 'blank' } as Option].concat(
	SIZES.map<Option>(size => ({ label: capitalize(size), value: size }))
);

const SizeAndSpeed = ({
	shouldUseReduxStore,
	clickedSubmit
}: SizeAndSpeedProps) => {
	const {
		values,
		touched,
		errors,
		setFieldValue,
		setFieldTouched,
		setFieldError
	} = useFormikContext<EditingSubraceState>();
	const dispatch = useAppDispatch();

	const handleSizeChange = useCallback(
		(value: string | number) => {
			const newSize = value === 'blank' ? undefined : (value as Size);

			if (shouldUseReduxStore) {
				dispatch(setSize(newSize));
			}

			setFieldValue('size', newSize, false);
			setFieldTouched('size', true, false);
			setFieldError('size', !newSize ? 'Subrace size is required' : undefined);
		},
		[
			shouldUseReduxStore,
			setFieldValue,
			setFieldTouched,
			setFieldError,
			dispatch
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
			const parsedSpeed = parseInt(event.target.value, 10);
			const newSpeed = !isNaN(parsedSpeed) ? parsedSpeed : undefined;

			if (shouldUseReduxStore) {
				dispatch(setSpeed(newSpeed));
			}

			setFieldValue('speed', newSpeed, false);
			setFieldTouched('speed', true, false);
			setFieldError('speed', !newSpeed ? 'Speed is required' : undefined);
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
		<div className={classes.container}>
			{values.overrides?.size && (
				<Select
					options={sizesOptions}
					value={values.size ?? 'blank'}
					error={errors.size}
					id="size"
					touched={clickedSubmit || touched.size}
					label="Size"
					onChange={handleSizeChange}
				/>
			)}
			{values.overrides?.speed && (
				<NumberTextInput
					id="speed"
					label="Speed"
					value={values.speed}
					error={errors.speed}
					touched={clickedSubmit || touched.speed}
					onChange={handleSpeedChange}
					onBlur={handleSpeedBlur}
				/>
			)}
		</div>
	);
};

export default SizeAndSpeed;
