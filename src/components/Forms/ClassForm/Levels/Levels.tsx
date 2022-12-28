'use client';

import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react';
import {
	EditingClassState,
	SpellcastingLevel,
	addAbilityScoreBonusLevel,
	removeAbilityScoreBonusLevel,
	setProficiencyBonus,
	setSpellcastingCantripsKnown,
	setSpellcastingNonLeveledSlots,
	setSpellcastingSlotLevel,
	setSpellcastingSpellSlots,
	setSpellcastingSpellsKnown
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';

import Checkbox from '../../../Checkbox/Checkbox';
import NumberTextInput from '../../NumberTextInput/NumberTextInput';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { getOrdinal } from '../../../../services/ordinalService';
import styles from './Levels.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import useMediaQuery from '../../../../hooks/useMediaQuery';

type ProficiencyBonusType = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
};

const slotLevelOptions: Option[] = [
	{ label: '\u2014', value: 'blank' } as Option
].concat(
	[...Array(9).keys()].map<Option>(num => ({
		label: getOrdinal(num + 1),
		value: num + 1
	}))
);

const ProficiencyBonuses = ({
	clickedSubmit,
	shouldUseReduxStore
}: ProficiencyBonusType) => {
	const dispatch = useAppDispatch();
	const {
		values,
		errors,
		touched,
		setFieldValue,
		setFieldTouched,
		setFieldError
	} = useFormikContext<EditingClassState>();

	const [maxWidth, setMaxWidth] = useState<string>();
	const [left, setLeft] = useState<string>();

	const isTripleExtraLarge = useMediaQuery('(min-width: 1792px)');
	const isDoubleExtraLarge = useMediaQuery('(min-width: 1536px)');
	const isExtraLarge = useMediaQuery('(min-width: 1280px)');
	const isLarge = useMediaQuery('(min-width: 1024px)');
	const isMedium = useMediaQuery('(min-width: 768px)');
	const isSmall = useMediaQuery('(min-width: 512px)');

	const spellLevels = useMemo(
		() =>
			[
				...Array(values.spellcasting?.spellSlotStyle === 'full' ? 10 : 6).keys()
			].filter(level =>
				!values.spellcasting?.knowsCantrips ? level > 0 : true
			),
		[values.spellcasting?.spellSlotStyle, values.spellcasting?.knowsCantrips]
	);

	const numberOfColumns = useMemo(
		() =>
			2 +
			(values.spellcasting
				? (values.spellcasting?.spellSlotStyle === 'half'
						? 5
						: values.spellcasting.spellSlotStyle === 'full'
						? 9
						: 2) +
				  (values.spellcasting?.knowsCantrips ? 1 : 0) +
				  (values.spellcasting?.handleSpells === 'spells-known' ? 1 : 0)
				: 0),
		[values.spellcasting]
	);

	useEffect(() => {
		setMaxWidth(numberOfColumns > 3 ? '1000px' : undefined);
	}, [numberOfColumns]);

	useEffect(() => {
		if (numberOfColumns > 3) {
			if (isTripleExtraLarge) {
				setLeft('0');
			} else if (isDoubleExtraLarge) {
				setLeft('4rem');
			} else if (isExtraLarge) {
				setLeft('8rem');
			} else if (isLarge) {
				setLeft('0');
			} else if (isMedium) {
				setLeft('6rem');
			} else if (isSmall) {
				setLeft('10rem');
			} else {
				setLeft('15rem');
			}
		} else {
			setLeft(undefined);
		}
	}, [
		numberOfColumns,
		isDoubleExtraLarge,
		isExtraLarge,
		isLarge,
		isMedium,
		isSmall,
		isTripleExtraLarge
	]);

	const getBonusTouched = useCallback(
		(index: number) =>
			touched.proficiencyBonuses &&
			(touched.proficiencyBonuses as unknown as boolean[])[index],
		[touched.proficiencyBonuses]
	);

	const getBonusError = useCallback(
		(index: number) =>
			errors.proficiencyBonuses &&
			(errors.proficiencyBonuses as unknown as (string | undefined)[])[index],
		[errors.proficiencyBonuses]
	);

	const getHandleBonusChange = useCallback(
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(`proficiencyBonuses.${index}`, event.target.value, false);
			},
		[setFieldValue]
	);

	const getHandleBonusBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : null;

				if (newValue !== null && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setProficiencyBonus({
							classLevel: index + 1,
							proficiencyBonus: newValue
						})
					);
				}

				for (let i = index; i < 20; ++i) {
					if (
						i === index ||
						!values.proficiencyBonuses[i] ||
						(values.proficiencyBonuses[i] ?? 0) < (newValue ?? 0)
					) {
						setFieldValue(`proficiencyBonuses.${i}`, newValue, false);
						setFieldTouched(`proficiencyBonuses.${i}`, true, false);
						setFieldError(
							`proficiencyBonuses.${i}`,
							!newValue ? 'Proficiency bonuses are required' : undefined
						);
					}
				}

				for (let i = index - 1; i >= 0; --i) {
					if ((values.proficiencyBonuses[i] ?? 0) > (newValue ?? 0)) {
						setFieldValue(`proficiencyBonuses.${i}`, newValue, false);
						setFieldTouched(`proficiencyBonuses.${i}`, true, false);
						setFieldError(
							`proficiencyBonuses.${i}`,
							!newValue ? 'Proficiency bonuses are required' : undefined
						);
					}
				}
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError,
			values.proficiencyBonuses
		]
	);

	const getSpellSlotsTouched = useCallback(
		(index: number, level: number): boolean | undefined =>
			touched.spellcasting &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels![index] &&
			(level === 0
				? (
						touched.spellcasting as unknown as FormikTouched<{
							levels: SpellcastingLevel[];
						}>
				  ).levels![index].cantrips
				: //@ts-ignore
				  (
						touched.spellcasting as unknown as FormikTouched<{
							levels: SpellcastingLevel[];
						}>
				  ).levels![index][`level${level}`]),
		[touched.spellcasting]
	);

	const getSpellSlotSlotsError = useCallback(
		(index: number, level: number): string | undefined =>
			errors.spellcasting &&
			(
				errors.spellcasting as unknown as FormikErrors<{
					levels: SpellcastingLevel[];
				}>
			).levels &&
			(
				errors.spellcasting as unknown as FormikErrors<{
					levels: SpellcastingLevel[];
				}>
			).levels![index] &&
			(level === 0
				? (
						(
							errors.spellcasting as unknown as FormikErrors<{
								levels: SpellcastingLevel[];
							}>
						).levels![index] as FormikErrors<{
							cantrips: number;
						}>
				  ).cantrips
				: //@ts-ignore
				  (
						errors.spellcasting as unknown as FormikErrors<{
							levels: SpellcastingLevel[];
						}>
				  ).levels![index][`level${level}`]),
		[errors.spellcasting]
	);

	const getSpellsKnownTouched = useCallback(
		(index: number): boolean | undefined =>
			touched.spellcasting &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels![index] &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels![index].spellsKnown,
		[touched.spellcasting]
	);

	const getSpellsKnownError = useCallback(
		(index: number): string | undefined =>
			errors.spellcasting &&
			(
				errors.spellcasting as unknown as FormikErrors<{
					levels: SpellcastingLevel[];
				}>
			).levels &&
			(
				errors.spellcasting as unknown as FormikErrors<{
					levels: SpellcastingLevel[];
				}>
			).levels![index] &&
			(
				(
					errors.spellcasting as unknown as FormikErrors<{
						levels: SpellcastingLevel[];
					}>
				).levels![index] as FormikErrors<{
					spellsKnown: number;
				}>
			).spellsKnown,
		[errors.spellcasting]
	);

	const getSlotLevelTouched = useCallback(
		(index: number): boolean | undefined =>
			touched.spellcasting &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels![index] &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels![index].slotLevel,
		[touched.spellcasting]
	);

	const getSlotLevelError = useCallback(
		(index: number): string | undefined =>
			errors.spellcasting &&
			(
				errors.spellcasting as unknown as FormikErrors<{
					levels: SpellcastingLevel[];
				}>
			).levels &&
			(
				errors.spellcasting as unknown as FormikErrors<{
					levels: SpellcastingLevel[];
				}>
			).levels![index] &&
			(
				(
					errors.spellcasting as unknown as FormikErrors<{
						levels: SpellcastingLevel[];
					}>
				).levels![index] as FormikErrors<{
					slotLevel: number;
				}>
			).slotLevel,
		[errors.spellcasting]
	);

	const getNonLeveledSlotsTouched = useCallback(
		(index: number): boolean | undefined =>
			touched.spellcasting &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels![index] &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					levels: SpellcastingLevel[];
				}>
			).levels![index].slots,
		[touched.spellcasting]
	);

	const getNonLeveledSlotsError = useCallback(
		(index: number): string | undefined =>
			errors.spellcasting &&
			(
				errors.spellcasting as unknown as FormikErrors<{
					levels: SpellcastingLevel[];
				}>
			).levels &&
			(
				errors.spellcasting as unknown as FormikErrors<{
					levels: SpellcastingLevel[];
				}>
			).levels![index] &&
			(
				(
					errors.spellcasting as unknown as FormikErrors<{
						levels: SpellcastingLevel[];
					}>
				).levels![index] as FormikErrors<{
					slots: number;
				}>
			).slots,
		[errors.spellcasting]
	);

	const getHandleSpellSlotsChange = useCallback(
		(index: number, level: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`spellcasting.levels.${index}.${
						level === 0 ? 'cantrips' : `level${level}`
					}`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleSpellSlotsBlur = useCallback(
		(index: number, level: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : null;

				if ((newValue || newValue === 0) && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					if (level === 0) {
						dispatch(
							setSpellcastingCantripsKnown({
								classLevel: index + 1,
								cantrips: newValue
							})
						);
					} else {
						dispatch(
							setSpellcastingSpellSlots({
								classLevel: index + 1,
								spellLevel: level,
								slots: newValue
							})
						);
					}
				}

				for (let i = index; i < 20; ++i) {
					if (
						level === 0 &&
						(i === index ||
							!values.spellcasting?.levels[i].cantrips ||
							(values.spellcasting.levels[i].cantrips ?? 0) < (newValue ?? 0))
					) {
						setFieldValue(`spellcasting.levels.${i}.cantrips`, newValue, false);

						setFieldTouched(`spellcasting.levels.${i}.cantrips`, true, false);
					} else if (
						i === index ||
						//@ts-ignore
						!values.spellcasting?.levels[i][`level${level}`] ||
						//@ts-ignore
						(values.spellcasting.levels[i][`level${level}`] ?? 0) <
							(newValue ?? 0)
					) {
						setFieldValue(
							`spellcasting.levels.${i}.level${level}`,
							newValue,
							false
						);

						setFieldTouched(
							`spellcasting.levels.${i}.level${level}`,
							true,
							false
						);
					}
				}
				for (let i = index - 1; i >= 0; --i) {
					if (
						level === 0 &&
						(values.spellcasting?.levels[i].cantrips ?? 0) > (newValue ?? 0)
					) {
						setFieldValue(`spellcasting.levels.${i}.cantrips`, newValue, false);

						setFieldTouched(`spellcasting.levels.${i}.cantrips`, true, false);
					} else if (
						//@ts-ignore
						(values.spellcasting.levels[i][`level${level}`] ?? 0) >
						(newValue ?? 0)
					) {
						setFieldValue(
							`spellcasting.levels.${i}.level${level}`,
							newValue,
							false
						);

						setFieldTouched(
							`spellcasting.levels.${i}.level${level}`,
							true,
							false
						);
					}
				}
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldTouched,
			setFieldValue,
			values.spellcasting?.levels
		]
	);

	const getHandleSpellsKnownChange = useCallback(
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`spellcasting.levels.${index}.spellsKnown`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleSpellsKnownBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : null;

				if ((newValue || newValue === 0) && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setSpellcastingSpellsKnown({
							classLevel: index + 1,
							spellsKnown: newValue
						})
					);
				}

				for (let i = index; i < 20; ++i) {
					if (
						i === index ||
						!values.spellcasting?.levels[i].spellsKnown ||
						(values.spellcasting.levels[i].spellsKnown ?? 0) < (newValue ?? 0)
					) {
						setFieldValue(
							`spellcasting.levels.${i}.spellsKnown`,
							newValue,
							false
						);

						setFieldTouched(
							`spellcasting.levels.${i}.spellsKnown`,
							true,
							false
						);
					}
				}

				for (let i = index - 1; i >= 0; --i) {
					if (
						(values.spellcasting?.levels[i].spellsKnown ?? 0) > (newValue ?? 0)
					) {
						setFieldValue(
							`spellcasting.levels.${i}.spellsKnown`,
							newValue,
							false
						);

						setFieldTouched(
							`spellcasting.levels.${i}.spellsKnown`,
							true,
							false
						);
					}
				}
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldTouched,
			setFieldValue,
			values.spellcasting?.levels
		]
	);

	const getHandleSlotLevelChange = useCallback(
		(index: number) => (value: string | number) => {
			const newValue = value !== 'blank' ? (value as number) : null;

			if (shouldUseReduxStore) {
				dispatch(
					setSpellcastingSlotLevel({
						classLevel: index + 1,
						slotLevel: newValue
					})
				);
			}

			for (let i = index; i < 20; ++i) {
				if (
					i === index ||
					!values.spellcasting?.levels[i].slotLevel ||
					(values.spellcasting.levels[i].slotLevel ?? 0) < (newValue ?? 0)
				) {
					setFieldValue(`spellcasting.levels.${i}.slotLevel`, newValue, false);

					setFieldTouched(`spellcasting.levels.${i}.slotLevel`, true, false);
				}
			}

			for (let i = index - 1; i >= 0; --i) {
				if ((values.spellcasting?.levels[i].slotLevel ?? 0) > (newValue ?? 0)) {
					setFieldValue(`spellcasting.levels.${i}.slotLevel`, newValue, false);

					setFieldTouched(`spellcasting.levels.${i}.slotLevel`, true, false);
				}
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldTouched,
			setFieldValue,
			values.spellcasting?.levels
		]
	);

	const getHandleNonLeveledSlotsChange = useCallback(
		(index: number): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`spellcasting.levels.${index}.slots`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getHandleNonLeveledSlotsBlur = useCallback(
		(index: number): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : null;

				if (newValue !== null && newValue < 1) {
					newValue = 1;
				}

				if (shouldUseReduxStore) {
					dispatch(
						setSpellcastingNonLeveledSlots({
							classLevel: index + 1,
							slots: newValue
						})
					);
				}

				for (let i = index; i < 20; ++i) {
					if (
						i === index ||
						!values.spellcasting?.levels[i].slots ||
						(values.spellcasting.levels[i].slots ?? 0) < (newValue ?? 0)
					) {
						setFieldValue(`spellcasting.levels.${i}.slots`, newValue, false);

						setFieldTouched(`spellcasting.levels.${i}.slots`, true, false);
					}
				}

				for (let i = index - 1; i >= 0; --i) {
					if ((values.spellcasting?.levels[i].slots ?? 0) > (newValue ?? 0)) {
						setFieldValue(`spellcasting.levels.${i}.slots`, newValue, false);

						setFieldTouched(`spellcasting.levels.${i}.slots`, true, false);
					}
				}
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			values.spellcasting?.levels
		]
	);

	const getHandleAbilityScoreBonusChange = useCallback(
		(level: number) => (value: boolean) => {
			if (value) {
				if (shouldUseReduxStore) {
					dispatch(addAbilityScoreBonusLevel(level));
				}

				setFieldValue(
					'abilityScoreBonusLevels',
					[...values.abilityScoreBonusLevels, level],
					false
				);
			} else {
				if (shouldUseReduxStore) {
					dispatch(removeAbilityScoreBonusLevel(level));
				}

				setFieldValue(
					'abilityScoreBonusLevels',
					values.abilityScoreBonusLevels.filter(l => l !== level),
					false
				);
			}
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			values.abilityScoreBonusLevels
		]
	);

	return (
		<section className={styles.container}>
			<h2>Levels</h2>
			<table className={styles.levels} style={{ maxWidth, left }}>
				<thead>
					<tr>
						<th>Class Level</th>
						<th>Proficiency Bonus</th>
						<th>Ability Score Bonus</th>
						{values.spellcasting?.handleSpells === 'spells-known' && (
							<th>Spells Known</th>
						)}
						{values.spellcasting && (
							<>
								{values.spellcasting.spellSlotStyle !== 'warlock' &&
									spellLevels.map(level => (
										<th key={level}>
											{level === 0
												? 'Cantrips Known'
												: `${getOrdinal(level)} Level Spell Slots`}
										</th>
									))}
								{values.spellcasting.spellSlotStyle === 'warlock' && (
									<>
										<th>Spell Slots</th>
										<th>Slot Level</th>
									</>
								)}
							</>
						)}
					</tr>
				</thead>
				<tbody>
					{values.proficiencyBonuses.map((bonus, i) => (
						<tr key={i} className={styles.level}>
							<th>{i + 1}</th>
							<td>
								<NumberTextInput
									id={`proficiencyBonuses.${i}`}
									label={`Level ${i + 1} Proficiency Bonus`}
									error={getBonusError(i)}
									touched={clickedSubmit || getBonusTouched(i)}
									value={bonus}
									onChange={getHandleBonusChange(i)}
									onBlur={getHandleBonusBlur(i)}
									hideLabel
									errorStyle={{ fontSize: '0.7rem' }}
								/>
							</td>
							<td className={styles.bonus}>
								<Checkbox
									label={`Enable Ability Score Bonus for Level ${i + 1}`}
									checked={values.abilityScoreBonusLevels.includes(i + 1)}
									onChange={getHandleAbilityScoreBonusChange(i + 1)}
									hideLabel
								/>
							</td>
							{values.spellcasting?.handleSpells === 'spells-known' && (
								<td>
									<NumberTextInput
										id={`spellcasting.levels.${i}.spellsKnown`}
										label={`Level ${i + 1} Spells Known`}
										error={getSpellsKnownError(i)}
										touched={clickedSubmit || getSpellsKnownTouched(i)}
										value={values.spellcasting.levels[i].spellsKnown}
										onChange={getHandleSpellsKnownChange(i)}
										onBlur={getHandleSpellsKnownBlur(i)}
										hideLabel
										errorStyle={{ fontSize: '0.7rem' }}
									/>
								</td>
							)}
							{values.spellcasting && (
								<>
									{values.spellcasting.spellSlotStyle !== 'warlock' &&
										spellLevels.map(level => (
											<td key={level}>
												<NumberTextInput
													id={`spellcasting.levels.${i}.${
														level === 0 ? 'cantrips' : `level${level}`
													}`}
													label={`Level ${i + 1} ${
														level === 0
															? 'Cantrips Known'
															: `${getOrdinal(level)} Level Spell Slots`
													}`}
													error={getSpellSlotSlotsError(i, level)}
													touched={
														clickedSubmit || getSpellSlotsTouched(i, level)
													}
													value={
														level === 0
															? values.spellcasting!.levels[i].cantrips //@ts-ignore
															: values.spellcasting.levels[i][`level${level}`]
													}
													onChange={getHandleSpellSlotsChange(i, level)}
													onBlur={getHandleSpellSlotsBlur(i, level)}
													hideLabel
													errorStyle={{ fontSize: '0.7rem' }}
												/>
											</td>
										))}
									{values.spellcasting.spellSlotStyle === 'warlock' && (
										<>
											<td>
												<NumberTextInput
													id={`spellcasting.levels.${i}.slots`}
													label={`Level ${i + 1} Spell Slots`}
													error={getNonLeveledSlotsError(i)}
													touched={
														clickedSubmit || getNonLeveledSlotsTouched(i)
													}
													value={values.spellcasting!.levels[i].slots}
													onChange={getHandleNonLeveledSlotsChange(i)}
													onBlur={getHandleNonLeveledSlotsBlur(i)}
													hideLabel
												/>
											</td>
											<td>
												<Select
													id={`spellcasting.levels.${i}.slotLevel`}
													label={`Level ${i + 1} Slot Level`}
													error={getSlotLevelError(i)}
													touched={clickedSubmit || getSlotLevelTouched(i)}
													value={
														values.spellcasting!.levels[i].slotLevel ?? 'blank'
													}
													options={slotLevelOptions}
													onChange={getHandleSlotLevelChange(i)}
													errorFontSize="0.7rem"
													hideLabel
												/>
											</td>
										</>
									)}
								</>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
};

export default ProficiencyBonuses;
