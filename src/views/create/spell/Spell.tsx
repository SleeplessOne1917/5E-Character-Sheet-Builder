import { Formik, FormikHelpers } from 'formik';
import { FocusEventHandler, useCallback, useState } from 'react';
import Button, { ButtonType } from '../../../components/Button/Button';
import Checkbox from '../../../components/Checkbox/Checkbox';
import MainContent from '../../../components/MainContent/MainContent';
import Select, { Option } from '../../../components/Select/Select';
import TextInput from '../../../components/TextInput/TextInput';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
	addComponent,
	EditingSpellState,
	removeComponent,
	resetSpell,
	setCastingTime,
	setConcentration,
	setDuration,
	setLevel,
	setMaterial,
	setName,
	setRange,
	setRitual,
	setSchool
} from '../../../redux/features/editingSpell';
import { SpellComponent, SrdItem } from '../../../types/srd';
import spellSchema from '../../../yup-schemas/spellSchema';
import classes from './Spell.module.css';

type SpellProps = {
	magicSchools: SrdItem[];
};

const Spell = ({ magicSchools }: SpellProps) => {
	const editingSpell = useAppSelector(state => state.editingSpell);
	const dispatch = useAppDispatch();
	/* eslint-disable unused-imports/no-unused-vars */
	const [initialValues, setInitialValues] = useState(editingSpell);
	/* eslint-enable unused-imports/no-unused-vars */

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			dispatch(setName(e.target.value));
		},
		[dispatch]
	);

	const handleCastingTimeBlur: FocusEventHandler<HTMLInputElement> =
		useCallback(
			e => {
				dispatch(setCastingTime(e.target.value));
			},
			[dispatch]
		);

	const handleDurationBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			dispatch(setDuration(e.target.value));
		},
		[dispatch]
	);

	const handleRangeBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			dispatch(setRange(e.target.value));
		},
		[dispatch]
	);

	const handleMaterialBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			dispatch(setMaterial(e.target.value));
		},
		[dispatch]
	);

	const handleSelectComponent = useCallback(
		(selected: boolean, value: SpellComponent) => {
			if (selected) {
				dispatch(addComponent(value));
			} else {
				if (value === 'M') {
					dispatch(setMaterial(undefined));
				}
				dispatch(removeComponent(value));
			}
		},
		[dispatch]
	);

	const handleLevelChange = useCallback(
		(level: number | null) => {
			dispatch(setLevel(level));
		},
		[dispatch]
	);

	const handleSchoolChange = useCallback(
		(school: SrdItem | null) => {
			dispatch(setSchool(school));
		},
		[dispatch]
	);

	const handleConcentrationChange = useCallback(
		(value: boolean) => {
			dispatch(setConcentration(value));
		},
		[dispatch]
	);

	const handleRitualChange = useCallback(
		(value: boolean) => {
			dispatch(setRitual(value));
		},
		[dispatch]
	);

	const handleFormikSubmit = useCallback(
		async (
			values: EditingSpellState,
			{ resetForm }: FormikHelpers<EditingSpellState>
		) => {
			resetForm();
			dispatch(resetSpell());
		},
		[dispatch]
	);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleFormikSubmit}
			validationSchema={spellSchema}
			enableReinitialize
		>
			{({
				values,
				handleChange,
				handleBlur,
				handleSubmit,
				touched,
				errors,
				isSubmitting,
				setFieldValue,
				setFieldTouched,
				setFieldError
			}) => (
				<MainContent>
					<h1>Create Spell</h1>
					<form onSubmit={handleSubmit} className={classes.form}>
						<div className={classes['name-and-level']}>
							<TextInput
								id="name"
								label="Name"
								value={values.name}
								touched={touched.name}
								error={errors.name}
								onChange={handleChange}
								onBlur={event => {
									handleNameBlur(event);
									handleBlur(event);
								}}
							/>
							<Select
								touched={touched.level}
								error={errors.level}
								options={[{ value: 'blank', label: '\u2014' } as Option].concat(
									[...Array(10).keys()].map(level => ({
										value: level,
										label: `${level === 0 ? 'Cantrip' : level}`
									}))
								)}
								onChange={value => {
									const newLevel = value === 'blank' ? null : (value as number);
									handleLevelChange(newLevel);
									setFieldValue('level', newLevel, false);
									setFieldTouched('level', true, false);
									setFieldError(
										'level',
										newLevel === null ? 'Level is required' : undefined
									);
								}}
								value={values.level ?? 'blank'}
								id="level"
								label="Level"
							/>
						</div>
						<div className={classes['casting-time-duration-range']}>
							<TextInput
								id="castingTime"
								label="Casting Time"
								value={values.castingTime}
								touched={touched.castingTime}
								error={errors.castingTime}
								onChange={handleChange}
								onBlur={e => {
									handleCastingTimeBlur(e);
									handleBlur(e);
								}}
							/>
							<TextInput
								id="duration"
								label="Duration"
								value={values.duration}
								touched={touched.duration}
								error={errors.duration}
								onChange={handleChange}
								onBlur={e => {
									handleDurationBlur(e);
									handleBlur(e);
								}}
							/>
							<TextInput
								id="range"
								label="Range"
								value={values.range}
								touched={touched.range}
								error={errors.range}
								onChange={handleChange}
								onBlur={e => {
									handleRangeBlur(e);
									handleBlur(e);
								}}
							/>
						</div>
						<div className={classes['components-school-ritual-concentration']}>
							<div className={classes['components-container']}>
								<fieldset
									className={`${classes.components}${
										errors.components ? ` ${classes.error}` : ''
									}`}
								>
									<legend>Components</legend>
									<Checkbox
										label="V"
										checked={values.components?.includes('V') ?? false}
										onChange={value => {
											handleSelectComponent(value, 'V');

											if (value) {
												setFieldValue(
													'components',
													[...(values.components ?? []), 'V'],
													false
												);
												setFieldError('components', undefined);
											} else {
												setFieldValue(
													'components',
													(values.components ?? [])?.filter(
														component => component !== 'V'
													),
													false
												);
												setFieldError(
													'components',
													!(
														(values.components ?? []).filter(
															component => component !== 'S'
														).length > 0
													)
														? 'Must have at least 1 component'
														: undefined
												);
											}

											setFieldTouched('components', true, false);
										}}
									/>
									<Checkbox
										label="S"
										checked={values.components?.includes('S') ?? false}
										onChange={value => {
											handleSelectComponent(value, 'S');

											if (value) {
												setFieldValue(
													'components',
													[...(values.components ?? []), 'S'],
													false
												);
												setFieldError('components', undefined);
											} else {
												setFieldValue(
													'components',
													(values.components ?? [])?.filter(
														component => component !== 'S'
													),
													false
												);
												setFieldError(
													'components',
													!(
														(values.components ?? []).filter(
															component => component !== 'S'
														).length > 0
													)
														? 'Must have at least 1 component'
														: undefined
												);
											}

											setFieldTouched('components', true, false);
										}}
									/>
									<Checkbox
										label="M"
										checked={values.components?.includes('M') ?? false}
										onChange={value => {
											handleSelectComponent(value, 'M');

											if (value) {
												setFieldValue(
													'components',
													[...(values.components ?? []), 'M'],
													false
												);
												setFieldError('components', undefined);
												setFieldError('material', undefined);
												setFieldValue('material', '', false);
											} else {
												setFieldValue(
													'components',
													(values.components ?? [])?.filter(
														component => component !== 'M'
													),
													false
												);
												setFieldError(
													'components',
													!(
														(values.components ?? []).filter(
															component => component !== 'M'
														).length > 0
													)
														? 'Must have at least 1 component'
														: undefined
												);
												setFieldValue('material', undefined, false);
											}

											setFieldTouched('components', true, false);
										}}
									/>
									{values.components?.includes('M') && (
										<TextInput
											id="material"
											label="Material"
											value={values.material ?? ''}
											touched={touched.material}
											error={errors.material}
											onChange={handleChange}
											onBlur={e => {
												handleMaterialBlur(e);
												handleBlur(e);
											}}
										/>
									)}
									{errors.components && (
										<div className={classes['error-message']}>
											{errors.components}
										</div>
									)}
								</fieldset>
							</div>
							<div className={classes['school-ritual-concentration']}>
								<div className={classes['margin-vertical']}>
									<Select
										id="school"
										label="Magic School"
										value={values.school?.index ?? 'blank'}
										options={[{ value: 'blank', label: '\u2014' }].concat(
											magicSchools.map(school => ({
												value: school.index,
												label: school.name
											}))
										)}
										touched={touched.school}
										error={errors.school}
										onChange={value => {
											const newSchool =
												magicSchools.find(school => school.index === value) ??
												null;

											handleSchoolChange(newSchool);
											setFieldValue('school', newSchool, false);
											setFieldTouched('school', true, false);
											setFieldError(
												'school',
												newSchool ? undefined : 'School is required'
											);
										}}
									/>
								</div>
								<div className={classes['concentration-ritual']}>
									<div className={classes['margin-vertical']}>
										<Checkbox
											label="Requires Concentration"
											checked={values.concentration}
											onChange={value => {
												handleConcentrationChange(value);
												setFieldValue('concentration', value);
												setFieldTouched('concentration', true);
											}}
										/>
									</div>
									<div className={classes['margin-vertical']}>
										<Checkbox
											label="Can Cast as Ritual"
											checked={values.ritual}
											onChange={value => {
												handleRitualChange(value);
												setFieldValue('ritual', value);
												setFieldTouched('ritual', true);
											}}
										/>
									</div>
								</div>
							</div>
						</div>
						<Button
							positive
							type={ButtonType.submit}
							disabled={isSubmitting}
							style={{ marginTop: '3rem' }}
						>
							Create Spell
						</Button>
					</form>
				</MainContent>
			)}
		</Formik>
	);
};

export default Spell;
