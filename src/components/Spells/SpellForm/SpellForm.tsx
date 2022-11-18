import { AbilityItem, SpellComponent, SrdItem } from '../../../types/srd';
import Button, { ButtonType } from '../../Button/Button';
import { DeepError, DeepTouched, PartialBy } from '../../../types/helpers';
import { FocusEventHandler, useCallback } from 'react';
import { Formik, FormikErrors, FormikHelpers } from 'formik';
import {
	addComponent,
	addSummon,
	deleteSummon,
	removeComponent,
	setAtHigherLevels,
	setCastingTime,
	setClasses,
	setConcentration,
	setDamageType,
	setDescription,
	setDuration,
	setLevel,
	setMaterial,
	setName,
	setRange,
	setRitual,
	setSchool,
	setSummonProperties
} from '../../../redux/features/editingSpell';

import Checkbox from '../../Checkbox/Checkbox';
import { Item } from '../../../types/db/item';
import MarkdownTextArea from '../../MarkdownTextArea/MarkdownTextArea';
import MultiSelect from '../../Select/MultiSelect/MultiSelect';
import Option from '../../Select/Option';
import Select from '../../Select/Select/Select';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import { Summon } from '../../../types/summon';
import SummonFormFields from '../../Create/Summon/SummonFormFields/SummonFormFields';
import TextInput from '../../TextInput/TextInput';
import classes from './SpellForm.module.css';
import { doNothing } from '../../../redux/features/editingCharacter';
import spellSchema from '../../../yup-schemas/spellSchema';
import { useAppDispatch } from '../../../hooks/reduxHooks';

type SpellFormProps = {
	damageTypes: SrdItem[];
	magicSchools: SrdItem[];
	abilities: AbilityItem[];
	srdClasses: SrdItem[];
	shouldUseReduxStore: boolean;
	initialValues: PartialBy<Spell, 'id'>;
	handleFormikSubmit: (
		values: PartialBy<Spell, 'id'>,
		helpers: FormikHelpers<PartialBy<Spell, 'id'>>
	) => Promise<void>;
};

const SpellForm = ({
	abilities,
	initialValues,
	handleFormikSubmit,
	magicSchools,
	srdClasses,
	damageTypes,
	shouldUseReduxStore
}: SpellFormProps) => {
	const dispatch = useAppDispatch();

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
		(school: Item | null) => {
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

	const handleSelectClasses = useCallback(
		(klasses: Item[]) => {
			dispatch(setClasses(klasses));
		},
		[dispatch]
	);

	const handleDamageTypeChange = useCallback(
		(damageType: Item | undefined) => {
			dispatch(setDamageType(damageType));
		},
		[dispatch]
	);

	const handleDescriptionChange = useCallback(
		(description: string) => {
			dispatch(setDescription(description));
		},
		[dispatch]
	);

	const handleHigherLevelsChange = useCallback(
		(description: string) => {
			dispatch(setAtHigherLevels(description));
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
								if (shouldUseReduxStore) {
									handleNameBlur(event);
								}
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
								if (shouldUseReduxStore) {
									handleLevelChange(newLevel);
								}
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
								if (shouldUseReduxStore) {
									handleCastingTimeBlur(e);
								}
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
								if (shouldUseReduxStore) {
									handleDurationBlur(e);
								}
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
								if (shouldUseReduxStore) {
									handleRangeBlur(e);
								}
								handleBlur(e);
							}}
						/>
					</div>
					<div className={classes['components-school-ritual-concentration']}>
						<div className={classes['components-container']}>
							<fieldset
								className={`${classes.components}${
									touched.components && errors.components
										? ` ${classes.error}`
										: ''
								}`}
							>
								<legend>Components</legend>
								<Checkbox
									label="V"
									checked={values.components?.includes('V') ?? false}
									onChange={value => {
										if (shouldUseReduxStore) {
											handleSelectComponent(value, 'V');
										}

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
														component => component !== 'V'
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
										if (shouldUseReduxStore) {
											handleSelectComponent(value, 'S');
										}

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
										if (shouldUseReduxStore) {
											handleSelectComponent(value, 'M');
										}

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
											if (shouldUseReduxStore) {
												handleMaterialBlur(e);
											}
											handleBlur(e);
										}}
									/>
								)}
								{touched.components && errors.components && (
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
									value={values.school?.id ?? 'blank'}
									options={[{ value: 'blank', label: '\u2014' }].concat(
										magicSchools.map(school => ({
											value: school.index,
											label: school.name
										}))
									)}
									touched={touched.school?.id || touched.school?.name}
									error={errors.school?.id || errors.school?.name}
									onChange={value => {
										const newSchool =
											magicSchools.find(school => school.index === value) ??
											null;

										const newSchoolItem = newSchool
											? {
													name: newSchool?.name,
													id: newSchool?.index
											  }
											: newSchool;

										if (shouldUseReduxStore) {
											handleSchoolChange(newSchoolItem);
										}
										setFieldValue('school', newSchoolItem, false);
										setFieldTouched('school', true, false);
										setFieldError(
											'school',
											newSchoolItem ? undefined : 'School is required'
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
											if (shouldUseReduxStore) {
												handleConcentrationChange(value);
											}
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
											if (shouldUseReduxStore) {
												handleRitualChange(value);
											}
											setFieldValue('ritual', value);
											setFieldTouched('ritual', true);
										}}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className={classes['classes-damage-type']}>
						<div className={classes['classes-container']}>
							<MultiSelect
								id="spellcasting-classes"
								label="Spellcasting Classes"
								touched={touched.classes as boolean | undefined}
								error={
									typeof errors.classes === 'string' ||
									typeof errors.classes === 'undefined'
										? errors.classes
										: typeof errors.classes[0] === 'string'
										? errors.classes[0]
										: (errors.classes as FormikErrors<Item>[])[0].name
								}
								values={values.classes.map(({ id }) => id)}
								options={[...srdClasses]
									.sort((a, b) => a.name.localeCompare(b.name))
									.map(klass => ({
										value: klass.index,
										label: klass.name
									}))}
								onSelect={values => {
									const newClasses: Item[] = srdClasses
										.filter(klass => values.includes(klass.index))
										.map<Item>(klass => ({
											id: klass.index,
											name: klass.name
										}));

									if (shouldUseReduxStore) {
										handleSelectClasses(newClasses);
									}
									setFieldValue('classes', newClasses, false);
									setFieldTouched('classes', true, false);
									setFieldError(
										'classes',
										newClasses.length === 0
											? 'Must select at least 1 class'
											: undefined
									);
								}}
							/>
						</div>
						<div className={classes['damage-type-container']}>
							<Select
								id="damage-type"
								label="Damage Type"
								touched={touched.damageType}
								error={errors.damageType}
								value={values.damageType?.id ?? 'blank'}
								options={[{ value: 'blank', label: '\u2014' } as Option].concat(
									damageTypes.map(dt => ({
										value: dt.index,
										label: dt.name
									}))
								)}
								onChange={value => {
									let newDamageType: Item | undefined = undefined;

									if (value !== 'blank') {
										const damageTypeSrd = damageTypes.find(
											dt => dt.index === (value as string)
										) as SrdItem;

										newDamageType = {
											id: damageTypeSrd?.index,
											name: damageTypeSrd.name
										};
									}

									if (shouldUseReduxStore) {
										handleDamageTypeChange(newDamageType);
									}

									setFieldValue('damageType', newDamageType, false);
									setFieldTouched('damageType', true, false);
								}}
							/>
							{!!values.damageType && (
								<svg className={classes['damage-type-icon']}>
									<use xlinkHref={`/Icons.svg#${values.damageType.id}`} />
								</svg>
							)}
						</div>
					</div>
					<SummonFormFields
						actions={
							shouldUseReduxStore
								? {
										add: addSummon,
										set: setSummonProperties,
										delete: deleteSummon
								  }
								: {
										add: doNothing,
										set: doNothing,
										delete: doNothing
								  }
						}
						summons={values.summons}
						errors={errors.summons as never as DeepError<Summon>[]}
						touched={touched.summons as never as DeepTouched<Summon>[]}
						setFieldError={setFieldError}
						setFieldTouched={setFieldTouched}
						setFieldValue={setFieldValue}
						abilities={abilities}
					/>
					<div className={classes['description-higher-levels']}>
						<MarkdownTextArea
							id="description"
							value={values.description}
							label="Description"
							onBlur={handleBlur}
							onChange={value => {
								setFieldValue('description', value);
								if (shouldUseReduxStore) {
									handleDescriptionChange(value);
								}
							}}
							touched={touched.description}
							error={errors.description}
						/>
						<MarkdownTextArea
							id="atHigherLevels"
							value={values.atHigherLevels}
							label="At Higher Levels"
							onBlur={handleBlur}
							onChange={value => {
								setFieldValue('atHigherLevels', value);
								if (shouldUseReduxStore) {
									handleHigherLevelsChange(value);
								}
							}}
							touched={touched.atHigherLevels}
							error={errors.atHigherLevels}
						/>
					</div>
					<Button
						positive
						type={ButtonType.submit}
						disabled={isSubmitting}
						size="large"
						style={{ marginTop: '3rem' }}
					>
						{`${shouldUseReduxStore ? 'Create' : 'Edit'} Spell`}
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default SpellForm;
