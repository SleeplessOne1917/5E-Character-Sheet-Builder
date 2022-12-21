'use client';

import { FocusEventHandler, useCallback, useMemo } from 'react';
import { setLevel, setName } from '../../../../redux/features/editingSpell';

import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import TextInput from '../../../TextInput/TextInput';
import classes from './NameAndLevel.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type NameAndLevelProps = {
	shouldUseReduxStore: boolean;
};

const levelOptions = [{ value: 'blank', label: '\u2014' } as Option].concat(
	[...Array(10).keys()].map(level => ({
		value: level,
		label: `${level === 0 ? 'Cantrip' : level}`
	}))
);

const NameAndLevel = ({ shouldUseReduxStore }: NameAndLevelProps) => {
	const {
		handleBlur,
		handleChange,
		values,
		errors,
		touched,
		setFieldError,
		setFieldTouched,
		setFieldValue
	} = useFormikContext<Pick<Spell, 'name' | 'level'>>();
	const dispatch = useAppDispatch();

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			if (shouldUseReduxStore) {
				dispatch(setName(e.target.value));
			}
			handleBlur(event);
		},
		[dispatch, shouldUseReduxStore, handleBlur]
	);

	const handleLevelChange = useCallback(
		(value: number | string) => {
			const newLevel = value === 'blank' ? null : (value as number);
			if (shouldUseReduxStore) {
				dispatch(setLevel(newLevel));
			}

			setFieldValue('level', newLevel, false);
			setFieldTouched('level', true, false);
			setFieldError(
				'level',
				newLevel === null ? 'Level is required' : undefined
			);
		},
		[
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			shouldUseReduxStore
		]
	);

	return (
		<div className={classes['name-and-level']}>
			<TextInput
				id="name"
				label="Name"
				value={values.name}
				touched={touched.name}
				error={errors.name}
				onChange={handleChange}
				onBlur={handleNameBlur}
			/>
			<Select
				touched={touched.level}
				error={errors.level}
				options={levelOptions}
				onChange={handleLevelChange}
				value={values.level ?? 'blank'}
				id="level"
				label="Level"
			/>
		</div>
	);
};

export default NameAndLevel;
