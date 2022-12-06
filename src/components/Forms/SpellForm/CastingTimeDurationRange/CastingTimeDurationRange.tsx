'use client';

import { FocusEventHandler, useCallback } from 'react';
import {
	setCastingTime,
	setDuration,
	setRange
} from '../../../../redux/features/editingSpell';

import { Spell } from '../../../../types/characterSheetBuilderAPI';
import TextInput from '../../../TextInput/TextInput';
import classes from './CastingTimeDurationRange.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type CastingTimeDurationRangeProps = {
	shouldUseReduxStore: boolean;
};

const CastingTimeDurationRange = ({
	shouldUseReduxStore
}: CastingTimeDurationRangeProps) => {
	const { values, errors, touched, handleBlur, handleChange } =
		useFormikContext<Pick<Spell, 'castingTime' | 'duration' | 'range'>>();
	const dispatch = useAppDispatch();

	const handleCastingTimeBlur: FocusEventHandler<HTMLInputElement> =
		useCallback(
			e => {
				if (shouldUseReduxStore) {
					dispatch(setCastingTime(e.target.value));
				}
				handleBlur(e);
			},
			[dispatch, shouldUseReduxStore, handleBlur]
		);

	const handleDurationBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			if (shouldUseReduxStore) {
				dispatch(setDuration(e.target.value));
			}
			handleBlur(e);
		},
		[dispatch, shouldUseReduxStore, handleBlur]
	);

	const handleRangeBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			if (shouldUseReduxStore) {
				dispatch(setRange(e.target.value));
			}
			handleBlur(e);
		},
		[dispatch, shouldUseReduxStore, handleBlur]
	);

	return (
		<div className={classes['casting-time-duration-range']}>
			<TextInput
				id="castingTime"
				label="Casting Time"
				value={values.castingTime}
				touched={touched.castingTime}
				error={errors.castingTime}
				onChange={handleChange}
				onBlur={handleCastingTimeBlur}
			/>
			<TextInput
				id="duration"
				label="Duration"
				value={values.duration}
				touched={touched.duration}
				error={errors.duration}
				onChange={handleChange}
				onBlur={handleDurationBlur}
			/>
			<TextInput
				id="range"
				label="Range"
				value={values.range}
				touched={touched.range}
				error={errors.range}
				onChange={handleChange}
				onBlur={handleRangeBlur}
			/>
		</div>
	);
};

export default CastingTimeDurationRange;
