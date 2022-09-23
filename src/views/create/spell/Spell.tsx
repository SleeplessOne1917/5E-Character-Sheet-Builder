import Button, { ButtonType } from '../../../components/Button/Button';
import { DeepError, DeepPartial, DeepTouched } from '../../../types/helpers';
import {
	EditingSpellState,
	addComponent,
	addSummon,
	deleteSummon,
	removeComponent,
	resetSpell,
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
	setSummonProperties,
	initialState as spellInitialState
} from '../../../redux/features/editingSpell';
import { FocusEventHandler, useCallback, useState } from 'react';
import { Formik, FormikErrors, FormikHelpers, FormikTouched } from 'formik';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { SpellComponent, SrdItem } from '../../../types/srd';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';

import Checkbox from '../../../components/Checkbox/Checkbox';
import { Item } from '../../../types/db/item';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import { MONSTER_TYPES } from '../../../constants/monsterTypeConstants';
import MainContent from '../../../components/MainContent/MainContent';
import MarkdownTextArea from '../../../components/MarkdownTextArea/MarkdownTextArea';
import MonsterType from '../../../types/monsterType';
import MultiSelect from '../../../components/Select/MultiSelect/MultiSelect';
import Option from '../../../components/Select/Option';
import { SIZES } from '../../../constants/sizeContants';
import Select from '../../../components/Select/Select/Select';
import Size from '../../../types/size';
import { Summon } from '../../../types/summon';
import TextInput from '../../../components/TextInput/TextInput';
import { capitalize } from '../../../services/capitalizeService';
import classes from './Spell.module.css';
import spellSchema from '../../../yup-schemas/spellSchema';

type SpellProps = {
	magicSchools: SrdItem[];
	srdClasses: SrdItem[];
	damageTypes: SrdItem[];
	loading: boolean;
};

const getSummonTouchedAtIndex = (
	touched: FormikTouched<EditingSpellState>,
	index: number
) =>
	touched.summons
		? (touched.summons as never as DeepTouched<Summon>[])[index]
		: undefined;

const getSummonErrorAtIndex = (
	errors: FormikErrors<EditingSpellState>,
	index: number
) =>
	errors.summons
		? (errors.summons as never as DeepError<Summon>[])[index]
		: undefined;

const Spell = ({
	magicSchools,
	loading,
	damageTypes,
	srdClasses
}: SpellProps) => {
	const editingSpell = useAppSelector(state => state.editingSpell);
	const dispatch = useAppDispatch();
	const [initialValues, setInitialValues] = useState(editingSpell);

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

	const handleFormikSubmit = useCallback(
		async (
			values: EditingSpellState,
			{ resetForm }: FormikHelpers<EditingSpellState>
		) => {
			setInitialValues(spellInitialState);
			resetForm();
			dispatch(resetSpell());
		},
		[dispatch]
	);

	const handleAddSummon = useCallback(() => {
		dispatch(addSummon());
	}, [dispatch]);

	const handleSetSummonProperties = useCallback(
		(index: number, overrideProps: DeepPartial<Summon>) => {
			dispatch(setSummonProperties({ index, overrideProps }));
		},
		[dispatch]
	);

	const handleRemoveSummon = useCallback(
		(index: number) => {
			dispatch(deleteSummon(index));
		},
		[dispatch]
	);

	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
				<MainContent testId="create-spell">
					<h1>Create Spell</h1>
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
											handleNameBlur(event);
											handleBlur(event);
										}}
									/>
									<Select
										touched={touched.level}
										error={errors.level}
										options={[
											{ value: 'blank', label: '\u2014' } as Option
										].concat(
											[...Array(10).keys()].map(level => ({
												value: level,
												label: `${level === 0 ? 'Cantrip' : level}`
											}))
										)}
										onChange={value => {
											const newLevel =
												value === 'blank' ? null : (value as number);
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
								<div
									className={classes['components-school-ritual-concentration']}
								>
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
												touched={touched.school}
												error={errors.school}
												onChange={value => {
													const newSchool =
														magicSchools.find(
															school => school.index === value
														) ?? null;

													const newSchoolItem = newSchool
														? {
																name: newSchool?.name,
																id: newSchool?.index
														  }
														: newSchool;

													handleSchoolChange(newSchoolItem);
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

												handleSelectClasses(newClasses);
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
											options={[
												{ value: 'blank', label: '\u2014' } as Option
											].concat(
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

												handleDamageTypeChange(newDamageType);

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
								<div className={classes['summons']}>
									{values.summons && values.summons.length > 0 ? (
										<>
											<h2>Summons</h2>
											{values.summons.map((summon, index) => (
												<div className={classes.summon} key={index}>
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
														onClick={() => {
															handleRemoveSummon(index);
															if (touched.summons) {
																const newTouched = Object.keys(
																	getSummonTouchedAtIndex(
																		touched,
																		index
																	) as DeepTouched<Summon>
																).reduce<Partial<DeepTouched<Summon>>>(
																	(acc, key) => ({ ...acc, [key]: false }),
																	{}
																);

																setFieldTouched(
																	`summons.${index}`,
																	newTouched as unknown as boolean
																);
															}

															setFieldValue(
																'summons',
																(values.summons ?? []).length <= 1
																	? undefined
																	: values.summons?.filter(
																			(s, i) => i !== index
																	  ),
																(values.summons ?? []).length <= 1
															);
														}}
													>
														<XMarkIcon
															className={classes['close-button-icon']}
														/>{' '}
														Remove Summon
													</Button>
													<div
														style={{
															display: 'flex',
															justifyContent: 'center'
														}}
													>
														<TextInput
															id={`summon-${index}-name`}
															label="Name"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.name`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index].name ?? ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	name: event.target.value
																});
																setFieldTouched(`summons.${index}.name`);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)?.name ??
																false
															}
															error={
																getSummonErrorAtIndex(errors, index)?.name ??
																undefined
															}
														/>
													</div>
													<div
														style={{
															display: 'flex',
															justifyContent: 'space-evenly'
														}}
													>
														<Select
															id={`summon-${index}-size`}
															label="Size"
															options={[
																{ label: '\u2014', value: 'blank' }
															].concat(
																SIZES.map(size => ({
																	label: capitalize(size),
																	value: size
																}))
															)}
															value={
																values.summons
																	? values.summons[index].size ?? 'blank'
																	: 'blank'
															}
															onChange={value => {
																const newVal =
																	value !== 'blank'
																		? (value as Size)
																		: undefined;
																handleSetSummonProperties(index, {
																	size: newVal
																});
																setFieldValue(
																	`summons.${index}.size`,
																	newVal,
																	false
																);
																setFieldTouched(
																	`summons.${index}.size`,
																	true,
																	false
																);
																setFieldError(
																	`summons.${index}.size`,
																	newVal ? undefined : 'Summon size is required'
																);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)?.size ??
																false
															}
															error={
																getSummonErrorAtIndex(errors, index)?.size ??
																undefined
															}
														/>
														<Select
															id={`summon-${index}-type`}
															label="Type"
															options={[
																{ label: '\u2014', value: 'blank' }
															].concat(
																MONSTER_TYPES.map(size => ({
																	label: capitalize(size),
																	value: size
																}))
															)}
															value={
																values.summons
																	? values.summons[index].type ?? 'blank'
																	: 'blank'
															}
															onChange={value => {
																const newVal =
																	value !== 'blank'
																		? (value as MonsterType)
																		: undefined;
																handleSetSummonProperties(index, {
																	type: newVal
																});
																setFieldValue(
																	`summons.${index}.type`,
																	newVal,
																	false
																);
																setFieldTouched(
																	`summons.${index}.type`,
																	true,
																	false
																);
																setFieldError(
																	`summons.${index}.type`,
																	newVal ? undefined : 'Summon type is required'
																);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)?.type ??
																false
															}
															error={
																getSummonErrorAtIndex(errors, index)?.type ??
																undefined
															}
														/>
													</div>
													<div
														style={{
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'space-evenly',
															flexWrap: 'wrap'
														}}
													>
														<TextInput
															id={`summon-${index}-armor-class`}
															label="Armor Class"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.armorClass`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.armorClass ?? ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	armorClass: event.target.value
																});
																setFieldTouched(`summons.${index}.armorClass`);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.armorClass ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)
																	?.armorClass ?? undefined
															}
														/>
														<TextInput
															id={`summon-${index}-hit-points`}
															label="Hit Points"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.hitPoints`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.hitPoints ?? ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	hitPoints: event.target.value
																});
																setFieldTouched(`summons.${index}.hitPoints`);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.hitPoints ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)
																	?.hitPoints ?? undefined
															}
														/>
														<TextInput
															id={`summon-${index}-speed`}
															label="Speed"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.speed`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.speed ?? ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	speed: event.target.value
																});
																setFieldTouched(`summons.${index}.speed`);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.speed ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)?.speed ??
																undefined
															}
														/>
														<TextInput
															id={`summon-${index}-condition-immunities`}
															label="Condition Immunities"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.conditionImmunities`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]
																			?.conditionImmunities ?? ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	conditionImmunities: event.target.value
																});
																setFieldTouched(
																	`summons.${index}.conditionImmunities`
																);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.conditionImmunities ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)
																	?.conditionImmunities ?? undefined
															}
														/>
														<TextInput
															id={`summon-${index}-damage-resistances`}
															label="Damage Resistances"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.damageResistances`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.damageResistances ??
																	  ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	damageResistances: event.target.value
																});
																setFieldTouched(
																	`summons.${index}.damageResistances`
																);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.damageResistances ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)
																	?.damageResistances ?? undefined
															}
														/>
														<TextInput
															id={`summon-${index}-damage-immunities`}
															label="Damage Immunities"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.damageImmunities`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.damageImmunities ??
																	  ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	damageImmunities: event.target.value
																});
																setFieldTouched(
																	`summons.${index}.damageImmunities`
																);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.damageImmunities ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)
																	?.damageImmunities ?? undefined
															}
														/>
														<TextInput
															id={`summon-${index}-saving-throws`}
															label="Saving Throws"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.savingThrows`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.savingThrows ?? ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	savingThrows: event.target.value
																});
																setFieldTouched(
																	`summons.${index}.savingThrows`
																);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.savingThrows ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)
																	?.savingThrows ?? undefined
															}
														/>
														<TextInput
															id={`summon-${index}-skills`}
															label="Skills"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.skills`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.skills ?? ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	skills: event.target.value
																});
																setFieldTouched(`summons.${index}.skills`);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.skills ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)?.skills ??
																undefined
															}
														/>
														<TextInput
															id={`summon-${index}-senses`}
															label="Senses"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.senses`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.senses ?? ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	senses: event.target.value
																});
																setFieldTouched(`summons.${index}.senses`);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.senses ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)?.senses ??
																undefined
															}
														/>
														<TextInput
															id={`summon-${index}-languages`}
															label="Languages"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.languages`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.languages ?? ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	languages: event.target.value
																});
																setFieldTouched(`summons.${index}.languages`);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.languages ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)
																	?.languages ?? undefined
															}
														/>
														<TextInput
															id={`summon-${index}-proficiency-bonus`}
															label="Proficiency Bonus"
															onChange={event => {
																setFieldValue(
																	`summons.${index}.proficiencyBonus`,
																	event.target.value,
																	false
																);
															}}
															value={
																values.summons
																	? values.summons[index]?.proficiencyBonus ??
																	  ''
																	: ''
															}
															onBlur={event => {
																handleSetSummonProperties(index, {
																	proficiencyBonus: event.target.value
																});
																setFieldTouched(
																	`summons.${index}.proficiencyBonus`
																);
															}}
															touched={
																getSummonTouchedAtIndex(touched, index)
																	?.proficiencyBonus ?? false
															}
															error={
																getSummonErrorAtIndex(errors, index)
																	?.proficiencyBonus ?? undefined
															}
														/>
													</div>
												</div>
											))}
											{values.summons.length < 5 && (
												<Button
													positive
													style={{ display: 'flex', alignItems: 'center' }}
													onClick={() => {
														handleAddSummon();
														setFieldValue(
															'summons',
															[...(values.summons ?? []), {}],
															false
														);
													}}
												>
													<PlusIcon className={classes['button-icon']} /> Add
													Summon
												</Button>
											)}
										</>
									) : (
										<Button
											positive
											style={{ display: 'flex', alignItems: 'center' }}
											onClick={() => {
												handleAddSummon();
												setFieldValue(
													'summons',
													[...(values.summons ?? []), {}],
													false
												);
											}}
										>
											<PlusIcon className={classes['button-icon']} /> Add Summon
										</Button>
									)}
								</div>
								<div className={classes['description-higher-levels']}>
									<MarkdownTextArea
										id="description"
										value={values.description}
										label="Description"
										onBlur={handleBlur}
										onChange={event => {
											handleChange(event);
											handleDescriptionChange(event.target.value);
										}}
										touched={touched.description}
										error={errors.description}
									/>
									<MarkdownTextArea
										id="higher-levels"
										value={values.atHigherLevels}
										label="At Higher Levels"
										onBlur={handleBlur}
										onChange={event => {
											handleChange(event);
											handleHigherLevelsChange(event.target.value);
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
									Create Spell
								</Button>
							</form>
						)}
					</Formik>
				</MainContent>
			)}
		</>
	);
};

export default Spell;
