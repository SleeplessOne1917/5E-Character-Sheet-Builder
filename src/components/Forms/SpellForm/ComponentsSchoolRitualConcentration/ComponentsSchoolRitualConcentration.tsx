'use client';

import { FocusEventHandler, useCallback, useMemo } from 'react';
import { SpellComponent, SrdItem } from '../../../../types/srd';
import {
	addComponent,
	removeComponent,
	setConcentration,
	setMaterial,
	setRitual,
	setSchool
} from '../../../../redux/features/editingSpell';

import Checkbox from '../../../Checkbox/Checkbox';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import TextInput from '../../../TextInput/TextInput';
import classes from './ComponentsSchoolRitualConcentration.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type ComponentsSchoolRitualConcentrationProps = {
	shouldUseReduxStore: boolean;
	magicSchools: SrdItem[];
};

const ComponentsSchoolRitualConcentration = ({
	shouldUseReduxStore,
	magicSchools
}: ComponentsSchoolRitualConcentrationProps) => {
	const {
		values,
		errors,
		touched,
		handleBlur,
		handleChange,
		setFieldError,
		setFieldTouched,
		setFieldValue
	} =
		useFormikContext<
			Pick<
				Spell,
				'components' | 'school' | 'ritual' | 'concentration' | 'material'
			>
		>();
	const dispatch = useAppDispatch();

	const handleMaterialBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			if (shouldUseReduxStore) {
				dispatch(setMaterial(e.target.value));
			}
			handleBlur(e);
		},
		[dispatch, shouldUseReduxStore, handleBlur]
	);

	const selectComponent = useCallback(
		(selected: boolean, value: SpellComponent) => {
			if (shouldUseReduxStore) {
				if (selected) {
					dispatch(addComponent(value));
				} else {
					if (value === 'M') {
						dispatch(setMaterial(undefined));
					}
					dispatch(removeComponent(value));
				}
			}

			if (selected) {
				setFieldValue(
					'components',
					[...(values.components ?? []), value],
					false
				);
				setFieldError('components', undefined);

				if (value === 'M') {
					setFieldError('material', undefined);
					setFieldValue('material', '', false);
				}
			} else {
				setFieldValue(
					'components',
					(values.components ?? [])?.filter(component => component !== value),
					false
				);
				setFieldError(
					'components',
					!(
						(values.components ?? []).filter(component => component !== value)
							.length > 0
					)
						? 'Must have at least 1 component'
						: undefined
				);
				if (value === 'M') {
					setFieldValue('material', undefined, false);
				}
			}

			setFieldTouched('components', true, false);
		},
		[
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			shouldUseReduxStore,
			values.components
		]
	);

	const handleSelectV = useCallback(
		(selected: boolean) => selectComponent(selected, 'V'),
		[selectComponent]
	);

	const handleSelectS = useCallback(
		(selected: boolean) => selectComponent(selected, 'S'),
		[selectComponent]
	);

	const handleSelectM = useCallback(
		(selected: boolean) => selectComponent(selected, 'M'),
		[selectComponent]
	);

	const handleSchoolChange = useCallback(
		(value: string | number) => {
			const newSchool =
				magicSchools.find(school => school.index === value) ?? null;

			const newSchoolItem = newSchool
				? {
						name: newSchool?.name,
						id: newSchool?.index
				  }
				: newSchool;

			if (shouldUseReduxStore) {
				dispatch(setSchool(newSchoolItem));
			}
			setFieldValue('school', newSchoolItem, false);
			setFieldTouched('school', true, false);
			setFieldError('school', newSchoolItem ? undefined : 'School is required');
		},
		[
			dispatch,
			shouldUseReduxStore,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			magicSchools
		]
	);

	const handleConcentrationChange = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setConcentration(value));
			}
			setFieldValue('concentration', value);
			setFieldTouched('concentration', true);
		},
		[dispatch, shouldUseReduxStore, setFieldValue, setFieldTouched]
	);

	const handleRitualChange = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setRitual(value));
			}
			setFieldValue('ritual', value);
			setFieldTouched('ritual', true);
		},
		[dispatch, shouldUseReduxStore, setFieldTouched, setFieldValue]
	);

	const magicSchoolOptions: Option[] = useMemo(
		() =>
			[{ value: 'blank', label: '\u2014' }].concat(
				magicSchools.map(school => ({
					value: school.index,
					label: school.name
				}))
			),
		[magicSchools]
	);

	return (
		<div className={classes['components-school-ritual-concentration']}>
			<div className={classes['components-container']}>
				<fieldset
					className={`${classes.components}${
						touched.components && errors.components ? ` ${classes.error}` : ''
					}`}
				>
					<legend>Components</legend>
					<Checkbox
						label="V"
						checked={values.components?.includes('V') ?? false}
						onChange={handleSelectV}
					/>
					<Checkbox
						label="S"
						checked={values.components?.includes('S') ?? false}
						onChange={handleSelectS}
					/>
					<Checkbox
						label="M"
						checked={values.components?.includes('M') ?? false}
						onChange={handleSelectM}
					/>
					{values.components?.includes('M') && (
						<TextInput
							id="material"
							label="Material"
							value={values.material ?? ''}
							touched={touched.material}
							error={errors.material}
							onChange={handleChange}
							onBlur={handleMaterialBlur}
						/>
					)}
					{touched.components && errors.components && (
						<div className={classes['error-message']}>{errors.components}</div>
					)}
				</fieldset>
			</div>
			<div className={classes['school-ritual-concentration']}>
				<div className={classes['margin-vertical']}>
					<Select
						id="school"
						label="Magic School"
						value={values.school?.id ?? 'blank'}
						options={magicSchoolOptions}
						touched={touched.school?.id || touched.school?.name}
						error={errors.school?.id || errors.school?.name}
						onChange={handleSchoolChange}
					/>
				</div>
				<div className={classes['concentration-ritual']}>
					<div className={classes['margin-vertical']}>
						<Checkbox
							label="Requires Concentration"
							checked={values.concentration}
							onChange={handleConcentrationChange}
						/>
					</div>
					<div className={classes['margin-vertical']}>
						<Checkbox
							label="Can Cast as Ritual"
							checked={values.ritual}
							onChange={handleRitualChange}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComponentsSchoolRitualConcentration;
