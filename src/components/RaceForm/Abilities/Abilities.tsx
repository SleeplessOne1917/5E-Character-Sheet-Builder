'use client';

import {
	ChangeEvent,
	ChangeEventHandler,
	FocusEvent,
	FocusEventHandler,
	useCallback
} from 'react';
import {
	EditingRaceState,
	addAbilityBonus,
	addAbilityBonusOptions,
	removeAbilityBonus,
	removeAbilityBonusOptions,
	setAbilityBonusAbilityScore,
	setAbilityBonusBonus,
	setAbilityBonusOptionsBonus,
	setAbilityBonusOptionsNumberOfAbilityScores
} from '../../../redux/features/editingRace';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';

import { AbilityItem } from '../../../types/srd';
import Button from '../../Button/Button';
import { Item } from '../../../types/db/item';
import NumberTextInput from '../NumberTextInput/NumberTextInput';
import Select from '../../Select/Select/Select';
import { XMarkIcon } from '@heroicons/react/24/solid';
import classes from './Abilities.module.css';
import { useAppDispatch } from '../../../hooks/reduxHooks';

type AbilitiesProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	abilities: AbilityItem[];
};

const Abilities = ({
	clickedSubmit,
	shouldUseReduxStore,
	abilities
}: AbilitiesProps) => {
	const {
		values,
		errors,
		touched,
		setFieldError,
		setFieldTouched,
		setFieldValue
	} = useFormikContext<EditingRaceState>();

	const dispatch = useAppDispatch();

	const handleRemoveBonus = useCallback(
		(index: number) => {
			if (shouldUseReduxStore) {
				dispatch(removeAbilityBonus(index));
			}

			setFieldValue(
				'abilityBonuses',
				values.abilityBonuses.filter((b, i) => i !== index),
				false
			);
		},
		[shouldUseReduxStore, setFieldValue, values.abilityBonuses, dispatch]
	);

	const handleAddBonus = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addAbilityBonus());
		}

		setFieldValue('abilityBonuses', [...values.abilityBonuses, {}], false);
	}, [shouldUseReduxStore, dispatch, setFieldValue, values.abilityBonuses]);

	const handleAbilityScoreChange = useCallback(
		(value: number | string, index: number) => {
			const newId = value === 'blank' ? undefined : (value as string);
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

			setFieldValue(`abilityBonuses.${index}.abilityScore`, newValue, false);
			setFieldTouched(`abilityBonuses.${index}.abilityScore`, true, false);
			setFieldError(
				`abilityBonuses.${index}.abilityScore`,
				!newValue ? 'Ability bonus must have ability score' : undefined
			);
		},
		[
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			shouldUseReduxStore,
			abilities
		]
	);

	const handleBonusChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>, index: number) => {
			setFieldValue(`abilityBonuses.${index}.bonus`, event.target.value, false);
		},
		[setFieldValue]
	);

	const handleBonusBlur = useCallback(
		(event: FocusEvent<HTMLInputElement>, index: number) => {
			const parsedValue = parseInt(event.target.value);
			let newValue = !isNaN(parsedValue) ? parsedValue : undefined;
			if (newValue && newValue < -10) {
				newValue = -10;
			}
			if (newValue && newValue > 10) {
				newValue = 10;
			}

			if (shouldUseReduxStore) {
				dispatch(setAbilityBonusBonus({ index, bonus: newValue }));
			}

			setFieldValue(`abilityBonuses.${index}.bonus`, newValue, false);
			setFieldTouched(`abilityBonuses.${index}.bonus`, true, false);
			setFieldError(
				`abilityBonuses.${index}.bonus`,
				newValue === undefined ? 'Ability bonus must have bonus' : undefined
			);
		},
		[
			dispatch,
			setFieldError,
			setFieldValue,
			setFieldTouched,
			shouldUseReduxStore
		]
	);

	const handleAbilityOptionsBonusChange: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				setFieldValue('abilityBonusOptions.bonus', event.target.value, false);
			},
			[setFieldValue]
		);

	const handleAbilityOptionsBonusBlur: FocusEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				const parsedValue = parseInt(event.target.value);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;
				if (newValue && newValue < -10) {
					newValue = -10;
				}
				if (newValue && newValue > 10) {
					newValue = 10;
				}

				if (shouldUseReduxStore) {
					dispatch(setAbilityBonusOptionsBonus(newValue));
				}
				setFieldValue('abilityBonusOptions.bonus', newValue, false);
				setFieldTouched('abilityBonusOptions.bonus', true, false);
				setFieldError(
					'abilityBonusOptions.bonus',
					newValue === undefined ? 'Bonus is required' : undefined
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

	const handleAbilityOptionsNumberOfScoresChange: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				setFieldValue(
					'abilityBonusOptions.numberOfAbilityScores',
					event.target.value,
					false
				);
			},
			[setFieldValue]
		);

	const handleAbilityOptionsNumberOfScoresBlur: FocusEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				const parsedValue = parseInt(event.target.value);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;
				if (newValue && newValue < 1) {
					newValue = 1;
				}
				if (
					newValue &&
					newValue > abilities.length - values.abilityBonuses.length
				) {
					newValue = abilities.length - values.abilityBonuses.length;
				}

				if (shouldUseReduxStore) {
					dispatch(setAbilityBonusOptionsNumberOfAbilityScores(newValue));
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
					newValue === undefined ? 'Bonus is required' : undefined
				);
			},
			[
				dispatch,
				setFieldError,
				setFieldTouched,
				setFieldValue,
				shouldUseReduxStore,
				abilities.length,
				values.abilityBonuses.length
			]
		);

	const handleAddAbilityOptions = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addAbilityBonusOptions());
		}

		setFieldValue('abilityBonusOptions', {}, false);
	}, [dispatch, setFieldValue, shouldUseReduxStore]);

	const handleRemoveAbilityOptions = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(removeAbilityBonusOptions());
		}

		setFieldValue('abilityBonusOptions', undefined, false);
	}, [shouldUseReduxStore, dispatch, setFieldValue]);

	return (
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
								onClick={() => handleRemoveBonus(index)}
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
								onChange={value => handleAbilityScoreChange(value, index)}
							/>
							<NumberTextInput
								id={`abilityBonuses.${index}.bonus`}
								label="Bonus"
								value={abilityBonus.bonus}
								touched={
									(touched.abilityBonuses &&
										touched.abilityBonuses[index] &&
										touched.abilityBonuses[index]?.bonus) ||
									clickedSubmit
								}
								error={
									errors.abilityBonuses && errors.abilityBonuses[index]
										? (
												errors.abilityBonuses[index] as FormikErrors<{
													bonus: number;
												}>
										  )?.bonus
										: undefined
								}
								onChange={event => handleBonusChange(event, index)}
								onBlur={event => handleBonusBlur(event, index)}
								errorStyle={{ fontSize: '1rem' }}
							/>
						</div>
					))}
					{values.abilityBonuses.length +
						(values.abilityBonusOptions?.numberOfAbilityScores ?? 0) <
						abilities.length && (
						<Button positive onClick={handleAddBonus}>
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
								<div className={classes['ability-bonus-options-field-input']}>
									<input
										id="abilityBonusOptions.bonus"
										type="text"
										className={`${classes.input}${
											(clickedSubmit ||
												(
													touched as unknown as FormikTouched<{
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
										onChange={handleAbilityOptionsBonusChange}
										onBlur={handleAbilityOptionsBonusBlur}
									/>
									{(clickedSubmit ||
										(
											touched.abilityBonusOptions as unknown as FormikTouched<{
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
								<div className={classes['ability-bonus-options-field-input']}>
									<input
										id="abilityBonusOptions.numberOfAbilityScores"
										type="text"
										className={`${classes.input}${
											(clickedSubmit ||
												(
													touched.abilityBonusOptions as unknown as FormikTouched<{
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
										value={values.abilityBonusOptions.numberOfAbilityScores}
										onChange={handleAbilityOptionsNumberOfScoresChange}
										onBlur={handleAbilityOptionsNumberOfScoresBlur}
									/>
									{(clickedSubmit ||
										(
											touched.abilityBonusOptions as unknown as FormikTouched<{
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
							<Button positive onClick={handleAddAbilityOptions}>
								Add ability bonus options
							</Button>
						)}
					{values.abilityBonusOptions && (
						<Button
							size="small"
							onClick={handleRemoveAbilityOptions}
							style={{ position: 'absolute', top: 0, right: 0 }}
						>
							Remove ability bonus options
						</Button>
					)}
				</div>
			</div>
			{clickedSubmit &&
				values.abilityBonuses.length === 0 &&
				(values.abilityBonusOptions?.numberOfAbilityScores ?? 0) === 0 && (
					<div
						className={classes['error-message']}
						style={{ alignSelf: 'center' }}
					>
						Must select ability bonuses and/or ability bonus options
					</div>
				)}
		</div>
	);
};

export default Abilities;
