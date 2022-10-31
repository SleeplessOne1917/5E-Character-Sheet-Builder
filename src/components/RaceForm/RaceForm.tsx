import { XMarkIcon } from '@heroicons/react/24/solid';
import { Formik, FormikErrors, FormikHelpers, FormikTouched } from 'formik';
import { FocusEventHandler, useCallback, useMemo, useState } from 'react';
import { SIZES } from '../../constants/sizeConstants';
import { useAppDispatch } from '../../hooks/reduxHooks';
import {
	addAbilityBonus,
	addAbilityBonusOptions,
	addTrait,
	addTraitProficiencies,
	EditingRaceState,
	removeAbilityBonus,
	removeAbilityBonusOptions,
	removeTraitProficiencies,
	setAbilityBonusAbilityScore,
	setAbilityBonusBonus,
	setAbilityBonusOptionsBonus,
	setAbilityBonusOptionsNumberOfAbilityScores,
	setLanguages,
	setName,
	setNumLanguageOptions,
	setSize,
	setSpeed,
	setTraitDescription,
	setTraitName,
	addTraitProficiencyOptions,
	removeTraitProficiencyOptions,
	addTraitHPBonus,
	removeTraitHPBonus,
	addTraitSpellOptions,
	removeTraitSpellOptions,
	addTraitSubtraits,
	removeTraitSubtraits,
	removeTrait,
	setTraitProficiencies,
	setTraitProficiencyOptionsChoose,
	setTraitProficiencyOptionsOptions
} from '../../redux/features/editingRace';
import { capitalize } from '../../services/capitalizeService';
import { getProficiencyTypeName } from '../../services/proficiencyTypeService';
import { Item } from '../../types/db/item';
import Size from '../../types/size';
import {
	AbilityItem,
	ProficiencyType,
	SrdItem,
	SrdProficiencyItem
} from '../../types/srd';
import raceSchema from '../../yup-schemas/raceSchema';
import Button, { ButtonType } from '../Button/Button';
import Checkbox from '../Checkbox/Checkbox';
import MarkdownTextArea from '../MarkdownTextArea/MarkdownTextArea';
import MultiSelect from '../Select/MultiSelect/MultiSelect';
import Select from '../Select/Select/Select';
import TextInput from '../TextInput/TextInput';
import classes from './RaceForm.module.css';

type RaceFormProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	shouldUseReduxStore: boolean;
	initialValues: EditingRaceState;
	handleFormikSubmit: (
		values: EditingRaceState,
		helpers: FormikHelpers<EditingRaceState>
	) => Promise<void>;
};

const RaceForm = ({
	abilities,
	languages,
	proficiencies,
	shouldUseReduxStore,
	initialValues,
	handleFormikSubmit
}: RaceFormProps) => {
	const dispatch = useAppDispatch();
	const [clickedSubmit, setClickedSubmit] = useState(false);
	const [traitProficiencySelectedTypes, setTraitProficiencySelectedTypes] =
		useState(
			initialValues.traits.map(trait =>
				trait.proficiencies && trait.proficiencies.length > 0
					? proficiencies.find(
							prof => prof.index === (trait.proficiencies as Item[])[0].id
					  )?.type ?? null
					: null
			)
		);
	const [
		traitProficiencyOptionsSelectedTypes,
		setTraitProficiencyOptionsSelectedTypes
	] = useState(
		initialValues.traits.map(trait =>
			trait.proficiencyOptions && trait.proficiencyOptions.options.length > 0
				? proficiencies.find(
						prof =>
							prof.index === (trait.proficiencyOptions?.options as Item[])[0].id
				  )?.type ?? null
				: null
		)
	);

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		e => {
			dispatch(setName(e.target.value));
		},
		[dispatch]
	);

	const handleSizeChange = useCallback(
		(value?: Size) => {
			dispatch(setSize(value));
		},
		[dispatch]
	);

	const handleSpeedBlur = useCallback(
		(value?: number) => {
			dispatch(setSpeed(value));
		},
		[dispatch]
	);

	const proficiencyTypes = useMemo(
		() =>
			proficiencies.reduce<ProficiencyType[]>(
				(acc, cur) => (!acc.includes(cur.type) ? [...acc, cur.type] : acc),
				[]
			),
		[proficiencies]
	);

	return (
		<Formik
			onSubmit={handleFormikSubmit}
			initialValues={initialValues}
			validationSchema={raceSchema}
		>
			{({
				errors,
				touched,
				handleBlur,
				handleChange,
				handleSubmit,
				isSubmitting,
				values,
				setFieldError,
				setFieldTouched,
				setFieldValue
			}) => (
				<form onSubmit={handleSubmit} className={classes.form}>
					<div className={classes['name-size-speed']}>
						<TextInput
							id="name"
							label="Name"
							value={values.name}
							onChange={handleChange}
							error={errors.name}
							touched={touched.name || clickedSubmit}
							onBlur={event => {
								if (shouldUseReduxStore) {
									handleNameBlur(event);
								}
								handleBlur(event);
							}}
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
							onChange={value => {
								const newSize = value === 'blank' ? undefined : (value as Size);
								if (shouldUseReduxStore) {
									handleSizeChange(newSize);
								}

								setFieldValue('size', newSize, false);
								setFieldTouched('size', true, false);
								setFieldError(
									'size',
									!newSize ? 'Race size is required' : undefined
								);
							}}
						/>
						<div className={classes['input-container']}>
							<label htmlFor="speed" className={classes['input-label']}>
								Speed (in feet)
							</label>
							<input
								id="speed"
								className={`${classes.input}${
									(touched.speed || clickedSubmit) && errors.speed
										? ` ${classes.error}`
										: ''
								}`}
								placeholder={'\u2014'}
								type="text"
								onChange={event => {
									setFieldValue('speed', event.target.value, false);
								}}
								value={values.speed ?? ''}
								onBlur={event => {
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
										handleSpeedBlur(newValue);
									}
									setFieldValue('speed', newValue, false);
									setFieldTouched('speed', true, false);
									setFieldError(
										'speed',
										newValue === undefined ? 'Speed is required' : undefined
									);
								}}
							/>
							{(touched.speed || clickedSubmit) && errors.speed && (
								<div className={classes['error-message']}>{errors.speed}</div>
							)}
						</div>
					</div>
					<div className={classes['abilities-container']}>
						<div
							className={`${classes['abilities']}${
								clickedSubmit &&
								values.abilityBonuses.length === 0 &&
								(values.abilityBonusOptions?.numberOfAbilityScores ?? 0) === 0
									? ` ${classes.error}`
									: ''
							}`}
						>
							<div className={classes['ability-bonuses']}>
								{values.abilityBonuses.map((abilityBonus, index) => (
									<div key={index} className={classes['ability-bonus']}>
										<button
											type="button"
											className={classes['x-button']}
											aria-label="Remove ability bonus"
											onClick={() => {
												if (shouldUseReduxStore) {
													dispatch(removeAbilityBonus(index));
												}

												setFieldValue(
													'abilityBonuses',
													values.abilityBonuses.filter((b, i) => i !== index),
													false
												);
											}}
										>
											<XMarkIcon className={classes['x-icon']} />
										</button>
										<Select
											id={`abilityBonuses.${index}.abilityScore`}
											options={[{ label: '\u2014', value: 'blank' }]
												.concat(
													abilityBonus.abilityScore
														? [
																{
																	label: abilityBonus.abilityScore.name,
																	value: abilityBonus.abilityScore.id
																}
														  ]
														: []
												)
												.concat(
													abilities
														.filter(
															ability =>
																!values.abilityBonuses.some(
																	ab => ab.abilityScore?.id === ability.index
																)
														)
														.map(ability => ({
															label: ability.full_name,
															value: ability.index
														}))
												)}
											value={abilityBonus.abilityScore?.id ?? 'blank'}
											label="Ability"
											error={
												errors.abilityBonuses &&
												errors.abilityBonuses[index] &&
												!!(
													errors.abilityBonuses[index] as FormikErrors<{
														abilityScore?: Item;
													}>
												).abilityScore
													? typeof (
															errors.abilityBonuses[index] as FormikErrors<{
																abilityScore: Item;
															}>
													  ).abilityScore === 'string'
														? ((
																errors.abilityBonuses[index] as FormikErrors<{
																	abilityScore: Item;
																}>
														  ).abilityScore as string)
														: (
																(
																	errors.abilityBonuses[index] as FormikErrors<{
																		abilityScore: Item;
																	}>
																).abilityScore as FormikErrors<{ id: string }>
														  ).id
													: undefined
											}
											errorFontSize="1rem"
											touched={
												clickedSubmit ||
												(touched.abilityBonuses
													? touched.abilityBonuses[index]?.abilityScore
													: false)
											}
											onChange={value => {
												const newId =
													value === 'blank' ? undefined : (value as string);
												const srdAbility = abilities.find(
													ability => ability.index === newId
												) as AbilityItem;
												const newValue: Item | undefined = newId
													? {
															id: newId,
															name: srdAbility.full_name
													  }
													: undefined;

												if (shouldUseReduxStore) {
													dispatch(
														setAbilityBonusAbilityScore({
															index,
															abilityScore: newValue
														})
													);
												}

												setFieldValue(
													`abilityBonuses.${index}.abilityScore`,
													newValue,
													false
												);
												setFieldTouched(
													`abilityBonuses.${index}.abilityScore`,
													true,
													false
												);
												setFieldError(
													`abilityBonuses.${index}.abilityScore`,
													!newValue
														? 'Ability bonus must have ability score'
														: undefined
												);
											}}
										/>
										<div className={classes['input-container']}>
											<label
												htmlFor={`abilityBonuses.${index}.bonus`}
												className={classes['input-label']}
											>
												Bonus
											</label>
											<input
												id={`abilityBonuses.${index}.bonus`}
												className={`${classes.input}${
													((touched.abilityBonuses &&
														touched.abilityBonuses[index] &&
														touched.abilityBonuses[index].bonus) ||
														clickedSubmit) &&
													errors.abilityBonuses &&
													errors.abilityBonuses[index] &&
													(
														errors.abilityBonuses[index] as FormikErrors<{
															bonus: number;
														}>
													).bonus
														? ` ${classes.error}`
														: ''
												}`}
												placeholder={'\u2014'}
												type="text"
												onChange={event => {
													setFieldValue(
														`abilityBonuses.${index}.bonus`,
														event.target.value,
														false
													);
												}}
												value={abilityBonus.bonus ?? ''}
												onBlur={event => {
													const parsedValue = parseInt(event.target.value);
													let newValue = !isNaN(parsedValue)
														? parsedValue
														: undefined;
													if (newValue && newValue < -10) {
														newValue = -10;
													}
													if (newValue && newValue > 10) {
														newValue = 10;
													}

													if (shouldUseReduxStore) {
														dispatch(
															setAbilityBonusBonus({ index, bonus: newValue })
														);
													}
													setFieldValue(
														`abilityBonuses.${index}.bonus`,
														newValue,
														false
													);
													setFieldTouched(
														`abilityBonuses.${index}.bonus`,
														true,
														false
													);
													setFieldError(
														`abilityBonuses.${index}.bonus`,
														newValue === undefined
															? 'Ability bonus must have bonus'
															: undefined
													);
												}}
											/>
											{((touched.abilityBonuses &&
												touched.abilityBonuses[index] &&
												touched.abilityBonuses[index].bonus) ||
												clickedSubmit) &&
												errors.abilityBonuses &&
												errors.abilityBonuses[index] &&
												(
													errors.abilityBonuses[index] as FormikErrors<{
														bonus: number;
													}>
												).bonus && (
													<div
														className={classes['error-message']}
														style={{ fontSize: '1rem' }}
													>
														{
															(
																errors.abilityBonuses[index] as FormikErrors<{
																	bonus: number;
																}>
															).bonus
														}
													</div>
												)}
										</div>
									</div>
								))}
								{values.abilityBonuses.length +
									(values.abilityBonusOptions?.numberOfAbilityScores ?? 0) <
									abilities.length && (
									<Button
										positive
										onClick={() => {
											if (shouldUseReduxStore) {
												dispatch(addAbilityBonus());
											}

											setFieldValue(
												'abilityBonuses',
												[...values.abilityBonuses, {}],
												false
											);
										}}
									>
										Add ability bonus
									</Button>
								)}
							</div>
							<div className={classes['ability-bonus-options']}>
								{values.abilityBonusOptions && (
									<div className={classes['ability-bonus-options-fields']}>
										<div className={classes['ability-bonus-options-field']}>
											<label
												htmlFor="abilityBonusOptions.bonus"
												className={classes['ability-bonus-options-field-label']}
											>
												Bonus:
											</label>
											<div
												className={classes['ability-bonus-options-field-input']}
											>
												<input
													id="abilityBonusOptions.bonus"
													type="text"
													className={`${classes.input}${
														(clickedSubmit ||
															(
																touched.abilityBonusOptions as FormikTouched<{
																	bonus: number;
																}>
															)?.bonus) &&
														(
															errors.abilityBonusOptions as FormikErrors<{
																bonus: number;
															}>
														)?.bonus
															? ` ${classes.error}`
															: ''
													}`}
													placeholder={'\u2014'}
													value={values.abilityBonusOptions.bonus}
													onChange={event => {
														setFieldValue(
															'abilityBonusOptions.bonus',
															event.target.value,
															false
														);
													}}
													onBlur={event => {
														const parsedValue = parseInt(event.target.value);
														let newValue = !isNaN(parsedValue)
															? parsedValue
															: undefined;
														if (newValue && newValue < -10) {
															newValue = -10;
														}
														if (newValue && newValue > 10) {
															newValue = 10;
														}

														if (shouldUseReduxStore) {
															dispatch(setAbilityBonusOptionsBonus(newValue));
														}
														setFieldValue(
															'abilityBonusOptions.bonus',
															newValue,
															false
														);
														setFieldTouched(
															'abilityBonusOptions.bonus',
															true,
															false
														);
														setFieldError(
															'abilityBonusOptions.bonus',
															newValue === undefined
																? 'Bonus is required'
																: undefined
														);
													}}
												/>
												{(clickedSubmit ||
													(
														touched.abilityBonusOptions as FormikTouched<{
															bonus: number;
														}>
													)?.bonus) &&
													(
														errors.abilityBonusOptions as FormikErrors<{
															bonus: number;
														}>
													)?.bonus && (
														<div className={classes['error-message']}>
															{
																(
																	errors.abilityBonusOptions as FormikErrors<{
																		bonus: number;
																	}>
																)?.bonus
															}
														</div>
													)}
											</div>
										</div>
										<div className={classes['ability-bonus-options-field']}>
											<label
												htmlFor="abilityBonusOptions.numberOfAbilityScores"
												className={classes['ability-bonus-options-field-label']}
											>
												Number of abilities to select from:
											</label>
											<div
												className={classes['ability-bonus-options-field-input']}
											>
												<input
													id="abilityBonusOptions.numberOfAbilityScores"
													type="text"
													className={`${classes.input}${
														(clickedSubmit ||
															(
																touched.abilityBonusOptions as FormikTouched<{
																	numberOfAbilityScores: number;
																}>
															)?.numberOfAbilityScores) &&
														(
															errors.abilityBonusOptions as FormikErrors<{
																numberOfAbilityScores: number;
															}>
														)?.numberOfAbilityScores
															? ` ${classes.error}`
															: ''
													}`}
													placeholder={'\u2014'}
													value={
														values.abilityBonusOptions.numberOfAbilityScores
													}
													onChange={event => {
														setFieldValue(
															'abilityBonusOptions.numberOfAbilityScores',
															event.target.value,
															false
														);
													}}
													onBlur={event => {
														const parsedValue = parseInt(event.target.value);
														let newValue = !isNaN(parsedValue)
															? parsedValue
															: undefined;
														if (newValue && newValue < 1) {
															newValue = 1;
														}
														if (
															newValue &&
															newValue >
																abilities.length - values.abilityBonuses.length
														) {
															newValue =
																abilities.length - values.abilityBonuses.length;
														}

														if (shouldUseReduxStore) {
															dispatch(
																setAbilityBonusOptionsNumberOfAbilityScores(
																	newValue
																)
															);
														}
														setFieldValue(
															'abilityBonusOptions.numberOfAbilityScores',
															newValue,
															false
														);
														setFieldTouched(
															'abilityBonusOptions.numberOfAbilityScores',
															true,
															false
														);
														setFieldError(
															'abilityBonusOptions.numberOfAbilityScores',
															newValue === undefined
																? 'Bonus is required'
																: undefined
														);
													}}
												/>
												{(clickedSubmit ||
													(
														touched.abilityBonusOptions as FormikTouched<{
															numberOfAbilityScores: number;
														}>
													)?.numberOfAbilityScores) &&
													(
														errors.abilityBonusOptions as FormikErrors<{
															numberOfAbilityScores: number;
														}>
													)?.numberOfAbilityScores && (
														<div className={classes['error-message']}>
															{
																(
																	errors.abilityBonusOptions as FormikErrors<{
																		numberOfAbilityScores: number;
																	}>
																)?.numberOfAbilityScores
															}
														</div>
													)}
											</div>
										</div>
									</div>
								)}
								{values.abilityBonuses.length +
									(values.abilityBonusOptions?.numberOfAbilityScores ?? 0) <
									abilities.length &&
									!values.abilityBonusOptions && (
										<Button
											positive
											onClick={() => {
												if (shouldUseReduxStore) {
													dispatch(addAbilityBonusOptions());
												}

												setFieldValue('abilityBonusOptions', {}, false);
											}}
										>
											Add ability bonus options
										</Button>
									)}
								{values.abilityBonusOptions && (
									<Button
										size="small"
										onClick={() => {
											if (shouldUseReduxStore) {
												dispatch(removeAbilityBonusOptions());
											}

											setFieldValue('abilityBonusOptions', undefined, false);
										}}
										style={{ position: 'absolute', top: 0, right: 0 }}
									>
										Remove ability bonus options
									</Button>
								)}
							</div>
						</div>
						{clickedSubmit &&
							values.abilityBonuses.length === 0 &&
							(values.abilityBonusOptions?.numberOfAbilityScores ?? 0) ===
								0 && (
								<div
									className={classes['error-message']}
									style={{ alignSelf: 'center' }}
								>
									Must select ability bonuses and/or ability bonus options
								</div>
							)}
					</div>
					<div className={classes['languages-container']}>
						<MultiSelect
							id="languages"
							options={languages.map(language => ({
								label: language.name,
								value: language.index
							}))}
							values={values.languages.map(language => language.id)}
							label="Languages Known"
							touched={
								clickedSubmit ||
								(touched.languages?.length !== undefined
									? false
									: !!touched.languages)
							}
							error={
								errors.languages
									? typeof errors.languages === 'string'
										? errors.languages
										: (errors.languages[0] as FormikErrors<Item>).name
									: undefined
							}
							onSelect={selectValues => {
								const newLanguages = languages
									.filter(language =>
										(selectValues as string[]).includes(language.index)
									)
									.map<Item>(language => ({
										id: language.index,
										name: language.name
									}));

								if (shouldUseReduxStore) {
									dispatch(setLanguages(newLanguages));
								}

								setFieldValue('languages', newLanguages, false);
								setFieldTouched('languages', true, false);
								setFieldError(
									'languages',
									newLanguages.length === 0
										? 'Must have at least 1 language'
										: ''
								);

								if (
									(values.numLanguageOptions ?? 0) + newLanguages.length >
									languages.length
								) {
									setFieldValue(
										'numLanguageOptions',
										languages.length - newLanguages.length,
										false
									);

									if (shouldUseReduxStore) {
										dispatch(
											setNumLanguageOptions(
												languages.length - newLanguages.length
											)
										);
									}
								}
							}}
						/>
						<div className={classes['input-container']}>
							<label
								htmlFor="numLanguageOptions"
								className={classes['input-label']}
							>
								Number of language options
							</label>
							<input
								id="numLanguageOptions"
								className={`${classes.input}${
									(clickedSubmit || touched.numLanguageOptions) &&
									errors.numLanguageOptions
										? ` ${classes.error}`
										: ''
								}`}
								placeholder={'\u2014'}
								type="text"
								onChange={event => {
									setFieldValue(
										'numLanguageOptions',
										event.target.value,
										false
									);
								}}
								style={{ marginTop: '0.2rem' }}
								value={values.numLanguageOptions ?? ''}
								onBlur={event => {
									const parsedValue = parseInt(event.target.value);
									let newValue = !isNaN(parsedValue) ? parsedValue : undefined;
									if (newValue && newValue < 0) {
										newValue = 0;
									}
									if (
										newValue &&
										newValue > languages.length - values.languages.length
									) {
										newValue = languages.length - values.languages.length;
									}

									if (shouldUseReduxStore) {
										dispatch(setNumLanguageOptions(newValue));
									}
									setFieldValue('numLanguageOptions', newValue, false);
									setFieldTouched('numLanguageOptions', true, false);
								}}
							/>
							{(clickedSubmit || touched.numLanguageOptions) &&
								errors.numLanguageOptions && (
									<div
										className={classes['error-message']}
										style={{ fontSize: '1rem' }}
									>
										{errors.numLanguageOptions}
									</div>
								)}
						</div>
					</div>
					<div className={classes['traits-container']}>
						{values.traits.map((trait, index) => (
							<div className={classes.trait} key={index}>
								<Button
									size="small"
									style={{
										position: 'absolute',
										top: '-0.3rem',
										right: '-0.3rem',
										borderTopRightRadius: '0.75rem'
									}}
									onClick={() => {
										if (shouldUseReduxStore) {
											dispatch(removeTrait(index));
										}

										setTraitProficiencySelectedTypes(prev =>
											prev.filter((val, i) => i !== index)
										);

										setTraitProficiencyOptionsSelectedTypes(prev =>
											prev.filter((val, i) => i !== index)
										);

										setFieldValue(
											'traits',
											values.traits.filter((t, i) => i !== index),
											false
										);
									}}
								>
									Remove trait
								</Button>
								<TextInput
									label="Trait Name"
									id={`traits.${index}.name`}
									onChange={handleChange}
									onBlur={event => {
										if (shouldUseReduxStore) {
											dispatch(
												setTraitName({ index, name: event.target.value })
											);
										}

										handleBlur(event);
									}}
									value={trait.name ?? ''}
									touched={
										clickedSubmit ||
										(touched.traits && touched.traits[index]?.name)
									}
									error={
										errors.traits
											? (errors.traits[index] as FormikErrors<{ name: string }>)
													?.name
											: undefined
									}
								/>
								<div style={{ alignSelf: 'stretch', marginTop: '1.5rem' }}>
									<MarkdownTextArea
										id={`traits.${index}.description`}
										label="Description"
										touched={
											clickedSubmit ||
											(touched.traits && touched.traits[index]?.description)
										}
										error={
											errors.traits
												? (
														errors.traits[index] as FormikErrors<{
															description: string;
														}>
												  )?.description
												: undefined
										}
										value={trait.description}
										onChange={value => {
											setFieldValue(
												`traits.${index}.description`,
												value,
												false
											);
										}}
										onBlur={event => {
											if (shouldUseReduxStore) {
												dispatch(
													setTraitDescription({
														index,
														description: event.target.value
													})
												);
											}

											handleBlur(event);
										}}
									/>
									<div className={classes['checkbox-deck']}>
										<Checkbox
											label="Proficiencies"
											checked={!!trait.proficiencies}
											onChange={value => {
												if (value) {
													if (shouldUseReduxStore) {
														dispatch(addTraitProficiencies(index));
													}

													setFieldValue(
														`traits.${index}.proficiencies`,
														[],
														false
													);
												} else {
													if (shouldUseReduxStore) {
														dispatch(removeTraitProficiencies(index));
													}

													setTraitProficiencySelectedTypes(prev =>
														prev.map((v, i) => (i === index ? null : v))
													);

													setFieldValue(
														`traits.${index}.proficiencies`,
														undefined,
														false
													);
												}
											}}
										/>
										<Checkbox
											label="Proficiency Options"
											checked={!!trait.proficiencyOptions}
											onChange={value => {
												if (value) {
													if (shouldUseReduxStore) {
														dispatch(addTraitProficiencyOptions(index));
													}

													setFieldValue(
														`traits.${index}.proficiencyOptions`,
														{ options: [] },
														false
													);
												} else {
													if (shouldUseReduxStore) {
														dispatch(removeTraitProficiencyOptions(index));
													}

													setTraitProficiencyOptionsSelectedTypes(prev =>
														prev.map((v, i) => (i === index ? null : v))
													);

													setFieldValue(
														`traits.${index}.proficiencyOptions`,
														undefined,
														false
													);
												}
											}}
										/>
										<Checkbox
											label="HP Bonus per Level"
											checked={trait.hpBonusPerLevel !== undefined}
											onChange={value => {
												if (value) {
													if (shouldUseReduxStore) {
														dispatch(addTraitHPBonus(index));
													}

													setFieldValue(
														`traits.${index}.hpBonusPerLevel`,
														null,
														false
													);
												} else {
													if (shouldUseReduxStore) {
														dispatch(removeTraitHPBonus(index));
													}

													setFieldValue(
														`traits.${index}.hpBonusPerLevel`,
														undefined,
														false
													);
												}
											}}
										/>
										<Checkbox
											label="Spell Options"
											checked={!!trait.spellOptions}
											onChange={value => {
												if (value) {
													if (shouldUseReduxStore) {
														dispatch(addTraitSpellOptions(index));
													}

													setFieldValue(
														`traits.${index}.spellOptions`,
														{ options: [] },
														false
													);
												} else {
													if (shouldUseReduxStore) {
														dispatch(removeTraitSpellOptions(index));
													}

													setFieldValue(
														`traits.${index}.spellOptions`,
														undefined,
														false
													);
												}
											}}
										/>
										<Checkbox
											label="Subtraits"
											checked={!!trait.subtraitOptions}
											onChange={value => {
												if (value) {
													if (shouldUseReduxStore) {
														dispatch(addTraitSubtraits(index));
													}

													setFieldValue(
														`traits.${index}.subtraitOptions`,
														{ options: [] },
														false
													);
												} else {
													if (shouldUseReduxStore) {
														dispatch(removeTraitSubtraits(index));
													}

													setFieldValue(
														`traits.${index}.subtraitOptions`,
														undefined,
														false
													);
												}
											}}
										/>
									</div>
									{trait.proficiencies && (
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-around',
												flexWrap: 'wrap',
												border: '2px solid var(--davy)',
												borderRadius: '0.5rem',
												margin: '1rem 0',
												padding: '1rem'
											}}
										>
											<Select
												options={[{ label: '\u2014', value: 'blank' }].concat(
													proficiencyTypes.map(pt => ({
														label: getProficiencyTypeName(pt),
														value: pt
													}))
												)}
												label="Proficiency type"
												id={`traits.${index}.proficiencyType`}
												touched={
													clickedSubmit ||
													(touched.traits &&
														touched.traits[index] &&
														touched.traits[index].proficiencies)
												}
												error={
													errors.traits && errors.traits[index]
														? ((
																errors.traits[index] as FormikErrors<{
																	proficiencies: Item[];
																}>
														  ).proficiencies as string)
														: undefined
												}
												value={traitProficiencySelectedTypes[index] ?? 'blank'}
												onChange={value => {
													const newValue =
														value === 'blank'
															? null
															: (value as ProficiencyType);
													setTraitProficiencySelectedTypes(prev =>
														prev.map((val, i) => (i === index ? newValue : val))
													);

													if ((trait.proficiencies?.length ?? 0) > 0) {
														if (shouldUseReduxStore) {
															dispatch(
																setTraitProficiencies({
																	index,
																	proficiencies: []
																})
															);
														}

														setFieldValue(
															`traits.${index}.proficiencies`,
															[],
															false
														);
													}
												}}
											/>
											{trait.proficiencies &&
												trait.proficiencies.length > 0 && (
													<p style={{ maxWidth: '30rem' }}>
														{trait.proficiencies
															.map(({ name }) => name.replace(/Skill: /g, ''))
															.join(', ')}
													</p>
												)}
											{traitProficiencySelectedTypes[index] && (
												<MultiSelect
													options={proficiencies
														.filter(
															prof =>
																prof.type ===
																	traitProficiencySelectedTypes[index] &&
																!(
																	values.traits
																		.flatMap(t => t.proficiencies ?? [])
																		.concat(
																			values.traits.flatMap(
																				t => t.proficiencyOptions?.options ?? []
																			)
																		)
																		.some(tp => tp.id === prof.index) &&
																	!(trait.proficiencies ?? []).some(
																		tp => tp.id === prof.index
																	)
																)
														)
														.map(prof => ({
															label: prof.name.replace(/Skill: /g, ''),
															value: prof.index
														}))}
													values={(trait.proficiencies ?? []).map(
														({ id }) => id
													)}
													label="Proficiencies"
													id={`traits.${index}.proficiencies`}
													touched={
														clickedSubmit ||
														(touched.traits &&
															touched.traits[index] &&
															touched.traits[index].proficiencies)
													}
													error={
														errors.traits && errors.traits[index]
															? ((
																	errors.traits[index] as FormikErrors<{
																		proficiencies: Item[];
																	}>
															  ).proficiencies as string)
															: undefined
													}
													onSelect={selectedValues => {
														const newProficiencies = proficiencies
															.filter(prof =>
																selectedValues.includes(prof.index)
															)
															.map<Item>(prof => ({
																id: prof.index,
																name: prof.name
															}));

														if (shouldUseReduxStore) {
															dispatch(
																setTraitProficiencies({
																	index,
																	proficiencies: newProficiencies
																})
															);
														}

														setFieldValue(
															`traits.${index}.proficiencies`,
															newProficiencies,
															false
														);
														setFieldTouched(
															`traits.${index}.proficiencies`,
															true,
															false
														);
														setFieldError(
															`traits.${index}.proficiencies`,
															newProficiencies.length === 0
																? 'Must have at least 1 proficiency'
																: undefined
														);
													}}
												/>
											)}
										</div>
									)}
									{trait.proficiencyOptions && (
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-around',
												flexWrap: 'wrap',
												border: '2px solid var(--davy)',
												borderRadius: '0.5rem',
												margin: '1rem 0',
												padding: '1rem'
											}}
										>
											<div className={classes['input-container']}>
												<label
													htmlFor={`traits.${index}.proficiencyOptions.choose`}
													className={classes['input-label']}
												>
													Number of proficiency options
												</label>
												<input
													id={`traits.${index}.proficiencyOptions.choose`}
													className={`${classes.input}${
														(clickedSubmit ||
															(touched.traits &&
																touched.traits[index] &&
																(
																	touched.traits[index]
																		.proficiencyOptions as FormikTouched<{
																		choose: number;
																	}>
																)?.choose)) &&
														errors.traits &&
														errors.traits[index] &&
														(
															errors.traits[index] as FormikErrors<{
																proficiencyOptions: { choose: number };
															}>
														).proficiencyOptions?.choose
															? ` ${classes.error}`
															: ''
													}`}
													placeholder={'\u2014'}
													type="text"
													onChange={event => {
														setFieldValue(
															`traits.${index}.proficiencyOptions.choose`,
															event.target.value,
															false
														);
													}}
													style={{ marginTop: '0.2rem' }}
													value={trait.proficiencyOptions.choose}
													onBlur={event => {
														const parsedValue = parseInt(event.target.value);
														let newValue = !isNaN(parsedValue)
															? parsedValue
															: undefined;
														if (newValue && newValue < 1) {
															newValue = 1;
														}
														if (
															newValue &&
															traitProficiencyOptionsSelectedTypes[index] &&
															(trait.proficiencyOptions?.options ?? []).length >
																0 &&
															newValue >=
																(trait.proficiencyOptions?.options ?? []).length
														) {
															newValue =
																(trait.proficiencyOptions?.options ?? [])
																	.length - 1;
														}

														if (shouldUseReduxStore) {
															dispatch(
																setTraitProficiencyOptionsChoose({
																	index,
																	choose: newValue
																})
															);
														}
														setFieldValue(
															`traits.${index}.proficiencyOptions.choose`,
															newValue,
															false
														);
														setFieldTouched(
															`traits.${index}.proficiencyOptions.choose`,
															true,
															false
														);
														setFieldError(
															`traits.${index}.proficiencyOptions.choose`,
															newValue === 0
																? 'Cannot choose less than 1 proficiency option'
																: !newValue
																? 'Must have number of proficiencies to choose'
																: undefined
														);
													}}
												/>
												{(clickedSubmit ||
													(touched.traits &&
														touched.traits[index] &&
														(
															touched.traits[index]
																.proficiencyOptions as FormikTouched<{
																choose: number;
															}>
														)?.choose)) &&
													errors.traits &&
													errors.traits[index] &&
													(
														errors.traits[index] as FormikErrors<{
															proficiencyOptions: { choose: number };
														}>
													).proficiencyOptions?.choose && (
														<div className={classes['error-message']}>
															{
																(
																	errors.traits[index] as FormikErrors<{
																		proficiencyOptions: { choose: number };
																	}>
																).proficiencyOptions?.choose
															}
														</div>
													)}
											</div>
											<Select
												options={[{ label: '\u2014', value: 'blank' }].concat(
													proficiencyTypes.map(pt => ({
														label: getProficiencyTypeName(pt),
														value: pt
													}))
												)}
												label="Proficiency type"
												id={`traits.${index}.proficiencyOptions.proficiencyType`}
												value={
													traitProficiencyOptionsSelectedTypes[index] ?? 'blank'
												}
												touched={
													clickedSubmit ||
													(touched.traits &&
														touched.traits[index].proficiencyOptions &&
														!!(
															touched.traits[index]
																.proficiencyOptions as FormikTouched<{
																options: Item[];
															}>
														).options)
												}
												error={
													errors.traits &&
													(
														errors.traits[index] as FormikErrors<{
															proficiencyOptions: { options: Item[] };
														}>
													).proficiencyOptions
														? ((
																errors.traits[index] as FormikErrors<{
																	proficiencyOptions: { options: Item[] };
																}>
														  ).proficiencyOptions?.options as string)
														: undefined
												}
												onChange={value => {
													const newValue =
														value === 'blank'
															? null
															: (value as ProficiencyType);
													const changed =
														newValue !==
														traitProficiencyOptionsSelectedTypes[index];
													setTraitProficiencyOptionsSelectedTypes(prev =>
														prev.map((val, i) => (i === index ? newValue : val))
													);

													if (
														(trait.proficiencyOptions?.options?.length ?? 0) >
															0 &&
														changed
													) {
														if (shouldUseReduxStore) {
															dispatch(
																setTraitProficiencyOptionsOptions({
																	index,
																	options: []
																})
															);
														}

														setFieldValue(
															`traits.${index}.proficiencyOptions.options`,
															[],
															false
														);
													}
												}}
											/>
											{trait.proficiencyOptions &&
												trait.proficiencyOptions.options.length > 0 && (
													<p style={{ maxWidth: '10rem' }}>
														{trait.proficiencyOptions.options
															.map(({ name }) => name.replace(/Skill: /g, ''))
															.join(', ')}
													</p>
												)}
											{traitProficiencyOptionsSelectedTypes[index] && (
												<MultiSelect
													options={proficiencies
														.filter(
															prof =>
																prof.type ===
																	traitProficiencyOptionsSelectedTypes[index] &&
																!(
																	values.traits
																		.flatMap(t => t.proficiencies ?? [])
																		.concat(
																			values.traits.flatMap(
																				t => t.proficiencyOptions?.options ?? []
																			)
																		)
																		.some(tp => tp.id === prof.index) &&
																	!(
																		trait.proficiencyOptions?.options ?? []
																	).some(tp => tp.id === prof.index)
																)
														)
														.map(prof => ({
															label: prof.name.replace(/Skill: /g, ''),
															value: prof.index
														}))}
													values={(trait.proficiencyOptions.options ?? []).map(
														({ id }) => id
													)}
													label="Proficiency Options"
													id={`traits.${index}.proficiencyOptions.options`}
													touched={
														clickedSubmit ||
														(touched.traits &&
															touched.traits[index] &&
															touched.traits[index].proficiencyOptions &&
															!!(
																touched.traits[index]
																	.proficiencyOptions as FormikTouched<{
																	options: Item[];
																}>
															).options)
													}
													error={
														errors.traits && errors.traits[index]
															? ((
																	errors.traits[index] as FormikErrors<{
																		proficiencyOptions: { options: Item[] };
																	}>
															  ).proficiencyOptions?.options as string)
															: undefined
													}
													onSelect={selectedValues => {
														const newProficiencies = proficiencies
															.filter(prof =>
																selectedValues.includes(prof.index)
															)
															.map<Item>(prof => ({
																id: prof.index,
																name: prof.name
															}));

														if (shouldUseReduxStore) {
															dispatch(
																setTraitProficiencyOptionsOptions({
																	index,
																	options: newProficiencies
																})
															);
														}

														setFieldValue(
															`traits.${index}.proficiencyOptions.options`,
															newProficiencies,
															false
														);
														setFieldTouched(
															`traits.${index}.proficiencyOptions.options`,
															true,
															false
														);
														setFieldError(
															`traits.${index}.proficiencyOptions.options`,
															newProficiencies.length === 0
																? 'Must have at least 1 proficiency to choose from'
																: undefined
														);

														if (
															(trait.proficiencyOptions?.choose ?? 0) >=
																newProficiencies.length &&
															(trait.proficiencyOptions?.choose ?? 0) > 0
														) {
															const newChoose = newProficiencies.length - 1;
															if (shouldUseReduxStore) {
																dispatch(
																	setTraitProficiencyOptionsChoose({
																		index,
																		choose: newChoose
																	})
																);
															}
															setFieldValue(
																`traits.${index}.proficiencyOptions.choose`,
																newChoose,
																false
															);
															setFieldError(
																`traits.${index}.proficiencyOptions.choose`,
																newChoose === 0
																	? 'Cannot choose less than 1 proficiency option'
																	: undefined
															);
														}
													}}
												/>
											)}
										</div>
									)}
								</div>
							</div>
						))}
						{values.traits.length < 10 && (
							<Button
								positive
								onClick={() => {
									if (shouldUseReduxStore) {
										dispatch(addTrait());
									}

									setTraitProficiencySelectedTypes(prev => [...prev, null]);
									setTraitProficiencyOptionsSelectedTypes(prev => [
										...prev,
										null
									]);
									setFieldValue('traits', [...values.traits, {}], false);
								}}
								style={{ alignSelf: 'center', marginTop: '1rem' }}
							>
								Add trait
							</Button>
						)}
					</div>
					<Button
						positive
						type={ButtonType.submit}
						disabled={isSubmitting}
						size="large"
						style={{ marginTop: '3rem' }}
						onClick={() => {
							setClickedSubmit(true);
						}}
					>
						{`${shouldUseReduxStore ? 'Create' : 'Edit'} Race`}
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default RaceForm;
