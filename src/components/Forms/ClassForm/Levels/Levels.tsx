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
	setFeaturePerLevelBonusLevel,
	setFeaturePerLevelDiceLevel,
	setFeaturePerLevelDistanceLevel,
	setFeaturePerLevelMultiDiceLevelCount,
	setFeaturePerLevelMultiDiceLevelDie,
	setFeaturePerLevelNumberLevel,
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

const diceOptions: Option[] = [
	{ label: '\u2014', value: 'blank' },
	{ label: 'd4', value: 4 },
	{ label: 'd6', value: 6 },
	{ label: 'd8', value: 8 },
	{ label: 'd10', value: 10 },
	{ label: 'd12', value: 12 }
];

const proficiencyBonusErrorMessage = 'Proficiency Bonus is required';

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

	const perLevelNumbers = useMemo(
		() =>
			values.features.reduce<
				{
					level?: number;
					featureIndex: number;
					numberIndex: number;
					name: string;
					levels: (number | null)[];
				}[]
			>(
				(acc, cur, i) =>
					cur.perLevelNumbers
						? [
								...acc,
								...cur.perLevelNumbers.map((pl, j) => ({
									level: cur.level,
									featureIndex: i,
									numberIndex: j,
									name: pl.name,
									levels: pl.levels
								}))
						  ]
						: acc,
				[]
			),
		[values.features]
	);

	const perLevelDice = useMemo(
		() =>
			values.features.reduce<
				{
					level?: number;
					featureIndex: number;
					diceIndex: number;
					name: string;
					levels: (number | null)[];
				}[]
			>(
				(acc, cur, i) =>
					cur.perLevelDice
						? [
								...acc,
								...cur.perLevelDice.map((pl, j) => ({
									level: cur.level,
									featureIndex: i,
									diceIndex: j,
									name: pl.name,
									levels: pl.levels
								}))
						  ]
						: acc,
				[]
			),
		[values.features]
	);

	const perLevelMultiDice = useMemo(
		() =>
			values.features.reduce<
				{
					level?: number;
					name: string;
					featureIndex: number;
					diceIndex: number;
					levels: { count?: number; die?: number }[];
				}[]
			>(
				(acc, cur, i) =>
					cur.perLevelMultiDice
						? [
								...acc,
								...cur.perLevelMultiDice.map((pl, j) => ({
									level: cur.level,
									featureIndex: i,
									diceIndex: j,
									name: pl.name,
									levels: pl.levels
								}))
						  ]
						: acc,
				[]
			),
		[values.features]
	);

	const perLevelBonuses = useMemo(
		() =>
			values.features.reduce<
				{
					level?: number;
					name: string;
					featureIndex: number;
					bonusIndex: number;
					levels: (number | null)[];
				}[]
			>(
				(acc, cur, i) =>
					cur.perLevelBonuses
						? [
								...acc,
								...cur.perLevelBonuses.map((pl, j) => ({
									level: cur.level,
									featureIndex: i,
									bonusIndex: j,
									name: pl.name,
									levels: pl.levels
								}))
						  ]
						: acc,
				[]
			),
		[values.features]
	);

	const perLevelDistances = useMemo(
		() =>
			values.features.reduce<
				{
					level?: number;
					name: string;
					featureIndex: number;
					distanceIndex: number;
					levels: (number | null)[];
				}[]
			>(
				(acc, cur, i) =>
					cur.perLevelDistances
						? [
								...acc,
								...cur.perLevelDistances.map((pl, j) => ({
									level: cur.level,
									featureIndex: i,
									distanceIndex: j,
									name: pl.name,
									levels: pl.levels
								}))
						  ]
						: acc,
				[]
			),
		[values.features]
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
			(errors.proficiencyBonuses as unknown as (string | undefined)[])[index]
				? proficiencyBonusErrorMessage
				: undefined,
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

	const getHandlePerLevelNumberLevelChange = useCallback(
		(
				featureIndex: number,
				numberIndex: number,
				levelIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`features.${featureIndex}.perLevelNumbers.${numberIndex}.levels.${levelIndex}`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getPerLevelNumberLevelTouched = useCallback(
		(featureIndex: number, numberIndex: number, levelIndex: number) =>
			touched.features &&
			touched.features[featureIndex] &&
			touched.features[featureIndex].perLevelNumbers &&
			(
				touched.features[featureIndex]
					.perLevelNumbers as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[numberIndex] &&
			(
				touched.features[featureIndex]
					.perLevelNumbers as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[numberIndex].levels &&
			(
				(
					touched.features[featureIndex]
						.perLevelNumbers as unknown as FormikTouched<{
						levels: (number | null)[];
					}>[]
				)[numberIndex].levels as unknown as (boolean | undefined)[]
			)[levelIndex],
		[touched.features]
	);

	const getPerLevelNumberLevelError = useCallback(
		(featureIndex: number, numberIndex: number, levelIndex: number) =>
			errors.features
				? (errors.features[featureIndex] as unknown as FormikErrors<{
						perLevelNumbers: { levels: (number | null)[] }[];
				  }>)
					? (
							errors.features[featureIndex] as unknown as FormikErrors<{
								perLevelNumbers: { levels: (number | null)[] }[];
							}>
					  ).perLevelNumbers
						? (
								(
									errors.features[featureIndex] as unknown as FormikErrors<{
										perLevelNumbers: { levels: (number | null)[] }[];
									}>
								).perLevelNumbers as unknown as FormikErrors<{
									levels: (number | null)[];
								}>[]
						  )[numberIndex]
							? (
									(
										errors.features[featureIndex] as unknown as FormikErrors<{
											perLevelNumbers: { levels: (number | null)[] }[];
										}>
									).perLevelNumbers as unknown as FormikErrors<{
										levels: (number | null)[];
									}>[]
							  )[numberIndex].levels
								? (
										(
											(
												errors.features[
													featureIndex
												] as unknown as FormikErrors<{
													perLevelNumbers: { levels: (number | null)[] }[];
												}>
											).perLevelNumbers as unknown as FormikErrors<{
												levels: (number | null)[];
											}>[]
										)[numberIndex].levels as unknown as (string | undefined)[]
								  )[levelIndex]
								: undefined
							: undefined
						: undefined
					: undefined
				: undefined,
		[errors.features]
	);

	const getHandlePerLevelNumberLevelBlur = useCallback(
		(
				featureIndex: number,
				numberIndex: number,
				levelIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				const fieldStart = `features.${featureIndex}.perLevelNumbers.${numberIndex}.levels`;
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : null;

				if (newValue !== null && newValue < 1) {
					newValue = 1;
				}

				for (let i = levelIndex + 1; i < 20; ++i) {
					if (
						(values.features[featureIndex].perLevelNumbers![numberIndex].levels[
							i
						] ?? 0) < (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelNumberLevel({
									featureIndex,
									numberIndex,
									levelIndex: i,
									level: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}`, true, false);
					}
				}

				for (let i = levelIndex - 1; i >= 0; --i) {
					if (
						(values.features[featureIndex].perLevelNumbers![numberIndex].levels[
							i
						] ?? 0) > (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelNumberLevel({
									featureIndex,
									numberIndex,
									levelIndex: i,
									level: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}`, true, false);
					}
				}

				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelNumberLevel({
							featureIndex,
							numberIndex,
							levelIndex,
							level: newValue
						})
					);
				}

				const field = `${fieldStart}.${levelIndex}`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			values.features
		]
	);

	const getPerLevelDiceLevelTouched = useCallback(
		(featureIndex: number, diceIndex: number, levelIndex: number) =>
			touched.features &&
			touched.features[featureIndex] &&
			touched.features[featureIndex].perLevelDice &&
			(
				touched.features[featureIndex]
					.perLevelDice as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[diceIndex] &&
			(
				touched.features[featureIndex]
					.perLevelDice as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[diceIndex].levels &&
			(
				(
					touched.features[featureIndex]
						.perLevelDice as unknown as FormikTouched<{
						levels: (number | null)[];
					}>[]
				)[diceIndex].levels as unknown as (boolean | undefined)[]
			)[levelIndex],
		[touched.features]
	);

	const getPerLevelDiceLevelError = useCallback(
		(featureIndex: number, diceIndex: number, levelIndex: number) =>
			errors.features
				? (errors.features[featureIndex] as unknown as FormikErrors<{
						perLevelDice: { levels: (number | null)[] }[];
				  }>)
					? (
							errors.features[featureIndex] as unknown as FormikErrors<{
								perLevelDice: { levels: (number | null)[] }[];
							}>
					  ).perLevelDice
						? (
								(
									errors.features[featureIndex] as unknown as FormikErrors<{
										perLevelDice: { levels: (number | null)[] }[];
									}>
								).perLevelDice as unknown as FormikErrors<{
									levels: (number | null)[];
								}>[]
						  )[diceIndex]
							? (
									(
										errors.features[featureIndex] as unknown as FormikErrors<{
											perLevelDice: { levels: (number | null)[] }[];
										}>
									).perLevelDice as unknown as FormikErrors<{
										levels: (number | null)[];
									}>[]
							  )[diceIndex].levels
								? (
										(
											(
												errors.features[
													featureIndex
												] as unknown as FormikErrors<{
													perLevelDice: { levels: (number | null)[] }[];
												}>
											).perLevelDice as unknown as FormikErrors<{
												levels: (number | null)[];
											}>[]
										)[diceIndex].levels as unknown as (string | undefined)[]
								  )[levelIndex]
								: undefined
							: undefined
						: undefined
					: undefined
				: undefined,
		[errors.features]
	);

	const getHandlePerLevelDiceLevelChange = useCallback(
		(featureIndex: number, diceIndex: number, levelIndex: number) =>
			(value: string | number) => {
				const newValue = value !== 'blank' ? (value as number) : null;
				const fieldStart = `features.${featureIndex}.perLevelDice.${diceIndex}.levels`;

				for (let i = levelIndex + 1; i < 20; ++i) {
					if (
						(values.features[featureIndex].perLevelDice![diceIndex].levels[i] ??
							0) < (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelDiceLevel({
									featureIndex,
									diceIndex,
									levelIndex: i,
									level: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}`, true, false);
					}
				}

				for (let i = levelIndex - 1; i >= 0; --i) {
					if (
						(values.features[featureIndex].perLevelDice![diceIndex].levels[i] ??
							0) > (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelDiceLevel({
									featureIndex,
									diceIndex,
									levelIndex: i,
									level: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}`, true, false);
					}
				}

				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelDiceLevel({
							featureIndex,
							diceIndex,
							levelIndex,
							level: newValue
						})
					);
				}

				const field = `${fieldStart}.${levelIndex}`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			values.features
		]
	);

	const getHandlePerLevelMultiDiceLevelCountChange = useCallback(
		(
				featureIndex: number,
				diceIndex: number,
				levelIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`features.${featureIndex}.perLevelMultiDice.${diceIndex}.levels.${levelIndex}.count`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getPerLevelMultiDiceLevelCountTouched = useCallback(
		(featureIndex: number, diceIndex: number, levelIndex: number) =>
			touched.features &&
			touched.features[featureIndex] &&
			touched.features[featureIndex].perLevelDice &&
			(
				touched.features[featureIndex]
					.perLevelDice as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[diceIndex] &&
			(
				touched.features[featureIndex]
					.perLevelDice as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[diceIndex].levels &&
			(
				(
					touched.features[featureIndex]
						.perLevelDice as unknown as FormikTouched<{
						levels: (number | null)[];
					}>[]
				)[diceIndex].levels as unknown as FormikTouched<{ count: number }>[]
			)[levelIndex] &&
			(
				(
					touched.features[featureIndex]
						.perLevelDice as unknown as FormikTouched<{
						levels: (number | null)[];
					}>[]
				)[diceIndex].levels as unknown as FormikTouched<{ count: number }>[]
			)[levelIndex].count,
		[touched.features]
	);

	const getPerLevelMultiDiceLevelCountError = useCallback(
		(featureIndex: number, diceIndex: number, levelIndex: number) =>
			errors.features
				? (errors.features[featureIndex] as unknown as FormikErrors<{
						perLevelDice: { levels: (number | null)[] }[];
				  }>)
					? (
							errors.features[featureIndex] as unknown as FormikErrors<{
								perLevelDice: { levels: (number | null)[] }[];
							}>
					  ).perLevelDice
						? (
								(
									errors.features[featureIndex] as unknown as FormikErrors<{
										perLevelDice: { levels: (number | null)[] }[];
									}>
								).perLevelDice as unknown as FormikErrors<{
									levels: (number | null)[];
								}>[]
						  )[diceIndex]
							? (
									(
										errors.features[featureIndex] as unknown as FormikErrors<{
											perLevelDice: { levels: (number | null)[] }[];
										}>
									).perLevelDice as unknown as FormikErrors<{
										levels: (number | null)[];
									}>[]
							  )[diceIndex].levels
								? (
										(
											(
												errors.features[
													featureIndex
												] as unknown as FormikErrors<{
													perLevelDice: { levels: (number | null)[] }[];
												}>
											).perLevelDice as unknown as FormikErrors<{
												levels: (number | null)[];
											}>[]
										)[diceIndex].levels as unknown as { count: number }[]
								  )[levelIndex]
									? (
											(
												(
													errors.features[
														featureIndex
													] as unknown as FormikErrors<{
														perLevelDice: { levels: (number | null)[] }[];
													}>
												).perLevelDice as unknown as FormikErrors<{
													levels: (number | null)[];
												}>[]
											)[diceIndex].levels as unknown as FormikErrors<{
												count: number;
											}>[]
									  )[levelIndex].count
									: undefined
								: undefined
							: undefined
						: undefined
					: undefined
				: undefined,
		[errors.features]
	);

	const getHandlePerLevelMultiDiceLevelCountBlur = useCallback(
		(
				featureIndex: number,
				diceIndex: number,
				levelIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;

				if (newValue !== undefined && newValue < 1) {
					newValue = 1;
				}

				const fieldStart = `features.${featureIndex}.perLevelMultiDice.${diceIndex}.levels`;

				for (let i = levelIndex + 1; i < 20; ++i) {
					if (
						(values.features[featureIndex].perLevelMultiDice![diceIndex].levels[
							i
						].count ?? 0) < (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelMultiDiceLevelCount({
									featureIndex,
									diceIndex,
									levelIndex: i,
									count: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}.count`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}.count`, true, false);
					}
				}

				for (let i = levelIndex - 1; i >= 0; --i) {
					if (
						(values.features[featureIndex].perLevelMultiDice![diceIndex].levels[
							i
						].count ?? 0) > (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelMultiDiceLevelCount({
									featureIndex,
									diceIndex,
									levelIndex: i,
									count: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}.count`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}.count`, true, false);
					}
				}

				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelMultiDiceLevelCount({
							featureIndex,
							diceIndex,
							levelIndex,
							count: newValue
						})
					);
				}

				const field = `${fieldStart}.${levelIndex}.count`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			values.features
		]
	);

	const getPerLevelMultiDiceLevelDieTouched = useCallback(
		(featureIndex: number, diceIndex: number, levelIndex: number) =>
			touched.features &&
			touched.features[featureIndex] &&
			touched.features[featureIndex].perLevelDice &&
			(
				touched.features[featureIndex]
					.perLevelDice as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[diceIndex] &&
			(
				touched.features[featureIndex]
					.perLevelDice as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[diceIndex].levels &&
			(
				(
					touched.features[featureIndex]
						.perLevelDice as unknown as FormikTouched<{
						levels: (number | null)[];
					}>[]
				)[diceIndex].levels as unknown as FormikTouched<{ count: number }>[]
			)[levelIndex] &&
			(
				(
					touched.features[featureIndex]
						.perLevelDice as unknown as FormikTouched<{
						levels: (number | null)[];
					}>[]
				)[diceIndex].levels as unknown as FormikTouched<{ die: number }>[]
			)[levelIndex].die,
		[touched.features]
	);

	const getPerLevelMultiDiceLevelDieError = useCallback(
		(featureIndex: number, diceIndex: number, levelIndex: number) =>
			errors.features
				? (errors.features[featureIndex] as unknown as FormikErrors<{
						perLevelDice: { levels: (number | null)[] }[];
				  }>)
					? (
							errors.features[featureIndex] as unknown as FormikErrors<{
								perLevelDice: { levels: (number | null)[] }[];
							}>
					  ).perLevelDice
						? (
								(
									errors.features[featureIndex] as unknown as FormikErrors<{
										perLevelDice: { levels: (number | null)[] }[];
									}>
								).perLevelDice as unknown as FormikErrors<{
									levels: (number | null)[];
								}>[]
						  )[diceIndex]
							? (
									(
										errors.features[featureIndex] as unknown as FormikErrors<{
											perLevelDice: { levels: (number | null)[] }[];
										}>
									).perLevelDice as unknown as FormikErrors<{
										levels: (number | null)[];
									}>[]
							  )[diceIndex].levels
								? (
										(
											(
												errors.features[
													featureIndex
												] as unknown as FormikErrors<{
													perLevelDice: { levels: (number | null)[] }[];
												}>
											).perLevelDice as unknown as FormikErrors<{
												levels: (number | null)[];
											}>[]
										)[diceIndex].levels as unknown as { count: number }[]
								  )[levelIndex]
									? (
											(
												(
													errors.features[
														featureIndex
													] as unknown as FormikErrors<{
														perLevelDice: { levels: (number | null)[] }[];
													}>
												).perLevelDice as unknown as FormikErrors<{
													levels: (number | null)[];
												}>[]
											)[diceIndex].levels as unknown as FormikErrors<{
												die: number;
											}>[]
									  )[levelIndex].die
									: undefined
								: undefined
							: undefined
						: undefined
					: undefined
				: undefined,
		[errors.features]
	);

	const getHandlePerLevelMultiDiceLevelDieChange = useCallback(
		(featureIndex: number, diceIndex: number, levelIndex: number) =>
			(value: string | number) => {
				const newValue = value !== 'blank' ? (value as number) : undefined;
				const fieldStart = `features.${featureIndex}.perLevelMultiDice.${diceIndex}.levels`;

				for (let i = levelIndex + 1; i < 20; ++i) {
					if (
						(values.features[featureIndex].perLevelMultiDice![diceIndex].levels[
							i
						].die ?? 0) < (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelMultiDiceLevelDie({
									featureIndex,
									diceIndex,
									levelIndex: i,
									die: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}.die`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}.die`, true, false);
					}
				}

				for (let i = levelIndex - 1; i >= 0; --i) {
					if (
						(values.features[featureIndex].perLevelMultiDice![diceIndex].levels[
							i
						].die ?? 0) > (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelMultiDiceLevelDie({
									featureIndex,
									diceIndex,
									levelIndex: i,
									die: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}.die`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}.die`, true, false);
					}
				}

				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelMultiDiceLevelDie({
							featureIndex,
							diceIndex,
							levelIndex,
							die: newValue
						})
					);
				}

				const field = `${fieldStart}.${levelIndex}.die`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			values.features
		]
	);

	const getHandlePerLevelBonusLevelChange = useCallback(
		(
				featureIndex: number,
				bonusIndex: number,
				levelIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`features.${featureIndex}.perLevelBonuses.${bonusIndex}.levels.${levelIndex}`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getPerLevelBonusLevelTouched = useCallback(
		(featureIndex: number, bonusIndex: number, levelIndex: number) =>
			touched.features &&
			touched.features[featureIndex] &&
			touched.features[featureIndex].perLevelBonuses &&
			(
				touched.features[featureIndex]
					.perLevelBonuses as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[bonusIndex] &&
			(
				touched.features[featureIndex]
					.perLevelBonuses as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[bonusIndex].levels &&
			(
				(
					touched.features[featureIndex]
						.perLevelBonuses as unknown as FormikTouched<{
						levels: (number | null)[];
					}>[]
				)[bonusIndex].levels as unknown as (boolean | undefined)[]
			)[levelIndex],
		[touched.features]
	);

	const getPerLevelBonusLevelError = useCallback(
		(featureIndex: number, bonusIndex: number, levelIndex: number) =>
			errors.features
				? (errors.features[featureIndex] as unknown as FormikErrors<{
						perLevelBonuses: { levels: (number | null)[] }[];
				  }>)
					? (
							errors.features[featureIndex] as unknown as FormikErrors<{
								perLevelBonuses: { levels: (number | null)[] }[];
							}>
					  ).perLevelBonuses
						? (
								(
									errors.features[featureIndex] as unknown as FormikErrors<{
										perLevelBonuses: { levels: (number | null)[] }[];
									}>
								).perLevelBonuses as unknown as FormikErrors<{
									levels: (number | null)[];
								}>[]
						  )[bonusIndex]
							? (
									(
										errors.features[featureIndex] as unknown as FormikErrors<{
											perLevelBonuses: { levels: (number | null)[] }[];
										}>
									).perLevelBonuses as unknown as FormikErrors<{
										levels: (number | null)[];
									}>[]
							  )[bonusIndex].levels
								? (
										(
											(
												errors.features[
													featureIndex
												] as unknown as FormikErrors<{
													perLevelBonuses: { levels: (number | null)[] }[];
												}>
											).perLevelBonuses as unknown as FormikErrors<{
												levels: (number | null)[];
											}>[]
										)[bonusIndex].levels as unknown as (string | undefined)[]
								  )[levelIndex]
								: undefined
							: undefined
						: undefined
					: undefined
				: undefined,
		[errors.features]
	);

	const getHandlePerLevelBonusLevelBlur = useCallback(
		(
				featureIndex: number,
				bonusIndex: number,
				levelIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : null;

				if (newValue !== null && newValue < 1) {
					newValue = 1;
				}

				const fieldStart = `features.${featureIndex}.perLevelBonuses.${bonusIndex}.levels`;

				for (let i = levelIndex + 1; i < 20; ++i) {
					if (
						(values.features[featureIndex].perLevelBonuses![bonusIndex].levels[
							i
						] ?? 0) < (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelBonusLevel({
									featureIndex,
									bonusIndex,
									levelIndex: i,
									level: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}`, true, false);
					}
				}

				for (let i = levelIndex - 1; i >= 0; --i) {
					if (
						(values.features[featureIndex].perLevelBonuses![bonusIndex].levels[
							i
						] ?? 0) > (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelBonusLevel({
									featureIndex,
									bonusIndex,
									levelIndex: i,
									level: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}`, true, false);
					}
				}

				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelBonusLevel({
							featureIndex,
							bonusIndex,
							levelIndex,
							level: newValue
						})
					);
				}

				const field = `${fieldStart}.${levelIndex}`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			values.features
		]
	);

	const getHandlePerLevelDistanceLevelChange = useCallback(
		(
				featureIndex: number,
				distanceIndex: number,
				levelIndex: number
			): ChangeEventHandler<HTMLInputElement> =>
			event => {
				setFieldValue(
					`features.${featureIndex}.perLevelDistances.${distanceIndex}.levels.${levelIndex}`,
					event.target.value,
					false
				);
			},
		[setFieldValue]
	);

	const getPerLevelDistanceLevelTouched = useCallback(
		(featureIndex: number, distanceIndex: number, levelIndex: number) =>
			touched.features &&
			touched.features[featureIndex] &&
			touched.features[featureIndex].perLevelDistances &&
			(
				touched.features[featureIndex]
					.perLevelDistances as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[distanceIndex] &&
			(
				touched.features[featureIndex]
					.perLevelDistances as unknown as FormikTouched<{
					levels: (number | null)[];
				}>[]
			)[distanceIndex].levels &&
			(
				(
					touched.features[featureIndex]
						.perLevelDistances as unknown as FormikTouched<{
						levels: (number | null)[];
					}>[]
				)[distanceIndex].levels as unknown as (boolean | undefined)[]
			)[levelIndex],
		[touched.features]
	);

	const getPerLevelDistanceLevelError = useCallback(
		(featureIndex: number, distanceIndex: number, levelIndex: number) =>
			errors.features
				? (errors.features[featureIndex] as unknown as FormikErrors<{
						perLevelDistances: { levels: (number | null)[] }[];
				  }>)
					? (
							errors.features[featureIndex] as unknown as FormikErrors<{
								perLevelDistances: { levels: (number | null)[] }[];
							}>
					  ).perLevelDistances
						? (
								(
									errors.features[featureIndex] as unknown as FormikErrors<{
										perLevelDistances: { levels: (number | null)[] }[];
									}>
								).perLevelDistances as unknown as FormikErrors<{
									levels: (number | null)[];
								}>[]
						  )[distanceIndex]
							? (
									(
										errors.features[featureIndex] as unknown as FormikErrors<{
											perLevelDistances: { levels: (number | null)[] }[];
										}>
									).perLevelDistances as unknown as FormikErrors<{
										levels: (number | null)[];
									}>[]
							  )[distanceIndex].levels
								? (
										(
											(
												errors.features[
													featureIndex
												] as unknown as FormikErrors<{
													perLevelDistances: { levels: (number | null)[] }[];
												}>
											).perLevelDistances as unknown as FormikErrors<{
												levels: (number | null)[];
											}>[]
										)[distanceIndex].levels as unknown as (string | undefined)[]
								  )[levelIndex]
								: undefined
							: undefined
						: undefined
					: undefined
				: undefined,
		[errors.features]
	);

	const getHandlePerLevelDistanceLevelBlur = useCallback(
		(
				featureIndex: number,
				distanceIndex: number,
				levelIndex: number
			): FocusEventHandler<HTMLInputElement> =>
			event => {
				const parsedValue = parseInt(event.target.value, 10);
				let newValue = !isNaN(parsedValue) ? parsedValue : null;

				if (newValue !== null && newValue < 1) {
					newValue = 1;
				}

				const fieldStart = `features.${featureIndex}.perLevelDistances.${distanceIndex}.levels`;

				for (let i = levelIndex + 1; i < 20; ++i) {
					if (
						(values.features[featureIndex].perLevelDistances![distanceIndex]
							.levels[i] ?? 0) < (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelDistanceLevel({
									featureIndex,
									distanceIndex,
									levelIndex: i,
									level: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}`, true, false);
					}
				}

				for (let i = levelIndex - 1; i >= 0; --i) {
					if (
						(values.features[featureIndex].perLevelDistances![distanceIndex]
							.levels[i] ?? 0) > (newValue ?? 0)
					) {
						if (shouldUseReduxStore) {
							dispatch(
								setFeaturePerLevelDistanceLevel({
									featureIndex,
									distanceIndex,
									levelIndex: i,
									level: newValue
								})
							);
						}

						setFieldValue(`${fieldStart}.${i}`, newValue, false);
						setFieldTouched(`${fieldStart}.${i}`, true, false);
					}
				}

				if (shouldUseReduxStore) {
					dispatch(
						setFeaturePerLevelDistanceLevel({
							featureIndex,
							distanceIndex,
							levelIndex,
							level: newValue
						})
					);
				}

				const field = `${fieldStart}.${levelIndex}`;

				setFieldValue(field, newValue, false);
				setFieldTouched(field, true, false);
			},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			values.features
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
						{perLevelNumbers.map((pl, i) => (
							<th key={`perLevelNumberHeader${i}`}>{pl.name}</th>
						))}
						{perLevelDice.map((pl, i) => (
							<th key={`perLevelDiceHeader${i}`}>{pl.name}</th>
						))}
						{perLevelMultiDice.map((pl, i) => (
							<th key={`perLevelMultiDiceHeader${i}`}>{pl.name}</th>
						))}
						{perLevelBonuses.map((pl, i) => (
							<th key={`perLevelBonusHeader${i}`}>{pl.name}</th>
						))}
						{perLevelDistances.map((pl, i) => (
							<th key={`perLevelDistanceHeader${i}`}>{pl.name}</th>
						))}
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
							{perLevelNumbers.map((pl, j) => (
								<td key={`perLevelNumber${j}`}>
									{i + 1 < (pl?.level ?? 0) || !pl.level ? (
										'\u2014'
									) : (
										<NumberTextInput
											id={`features.${pl.featureIndex}.perLevelNumbers.${pl.numberIndex}.levels.${i}`}
											label={`Level ${i + 1} ${pl.name}`}
											error={getPerLevelNumberLevelError(
												pl.featureIndex,
												pl.numberIndex,
												i
											)}
											touched={
												clickedSubmit ||
												getPerLevelNumberLevelTouched(
													pl.featureIndex,
													pl.numberIndex,
													i
												)
											}
											value={pl.levels[i]}
											onChange={getHandlePerLevelNumberLevelChange(
												pl.featureIndex,
												pl.numberIndex,
												i
											)}
											onBlur={getHandlePerLevelNumberLevelBlur(
												pl.featureIndex,
												pl.numberIndex,
												i
											)}
											hideLabel
											errorStyle={{ fontSize: '0.7rem' }}
										/>
									)}
								</td>
							))}
							{perLevelDice.map((pl, j) => (
								<td key={`perLevelDice${j}`}>
									{i + 1 < (pl.level ?? 0) || !pl.level ? (
										'\u2014'
									) : (
										<Select
											id={`features.${pl.featureIndex}.perLevelDice.${pl.diceIndex}.levels.${i}`}
											label={`Level ${i + 1} ${pl.name}`}
											error={getPerLevelDiceLevelError(
												pl.featureIndex,
												pl.diceIndex,
												i
											)}
											options={diceOptions}
											touched={
												clickedSubmit ||
												getPerLevelDiceLevelTouched(
													pl.featureIndex,
													pl.diceIndex,
													i
												)
											}
											value={pl.levels[i] ?? 'blank'}
											onChange={getHandlePerLevelDiceLevelChange(
												pl.featureIndex,
												pl.diceIndex,
												i
											)}
											hideLabel
											errorFontSize="0.7rem"
										/>
									)}
								</td>
							))}
							{perLevelMultiDice.map((pl, j) => (
								<td key={`perLevelMultiDice${j}`}>
									{i + 1 < (pl.level ?? 0) || !pl.level ? (
										'\u2014'
									) : (
										<>
											<NumberTextInput
												id={`features.${pl.featureIndex}.perLevelMultiDice.${pl.diceIndex}.levels.${i}.count`}
												label={`Level ${i + 1} ${pl.name} count`}
												error={getPerLevelMultiDiceLevelCountError(
													pl.featureIndex,
													pl.diceIndex,
													i
												)}
												touched={
													clickedSubmit ||
													getPerLevelMultiDiceLevelCountTouched(
														pl.featureIndex,
														pl.diceIndex,
														i
													)
												}
												value={pl.levels[i].count}
												onChange={getHandlePerLevelMultiDiceLevelCountChange(
													pl.featureIndex,
													pl.diceIndex,
													i
												)}
												onBlur={getHandlePerLevelMultiDiceLevelCountBlur(
													pl.featureIndex,
													pl.diceIndex,
													i
												)}
												hideLabel
												errorStyle={{ fontSize: '0.7rem' }}
											/>
											<Select
												id={`features.${pl.featureIndex}.perLevelMultiDice.${pl.diceIndex}.levels.${i}.die`}
												options={diceOptions}
												label={`Level ${i + 1} ${pl.name} die`}
												error={getPerLevelMultiDiceLevelDieError(
													pl.featureIndex,
													pl.diceIndex,
													i
												)}
												touched={
													clickedSubmit ||
													getPerLevelMultiDiceLevelDieTouched(
														pl.featureIndex,
														pl.diceIndex,
														i
													)
												}
												onChange={getHandlePerLevelMultiDiceLevelDieChange(
													pl.featureIndex,
													pl.diceIndex,
													i
												)}
												value={pl.levels[i].die ?? 'blank'}
												hideLabel
												errorFontSize="0.7rem"
											/>
										</>
									)}
								</td>
							))}
							{perLevelBonuses.map((pl, j) => (
								<td key={`perLevelBonus${j}`}>
									{i + 1 < (pl?.level ?? 0) || !pl.level ? (
										'\u2014'
									) : (
										<NumberTextInput
											id={`features.${pl.featureIndex}.perLevelBonuses.${pl.bonusIndex}.levels.${i}`}
											label={`Level ${i + 1} ${pl.name}`}
											error={getPerLevelBonusLevelError(
												pl.featureIndex,
												pl.bonusIndex,
												i
											)}
											touched={
												clickedSubmit ||
												getPerLevelBonusLevelTouched(
													pl.featureIndex,
													pl.bonusIndex,
													i
												)
											}
											value={pl.levels[i]}
											onChange={getHandlePerLevelBonusLevelChange(
												pl.featureIndex,
												pl.bonusIndex,
												i
											)}
											onBlur={getHandlePerLevelBonusLevelBlur(
												pl.featureIndex,
												pl.bonusIndex,
												i
											)}
											hideLabel
											errorStyle={{ fontSize: '0.7rem' }}
										/>
									)}
								</td>
							))}
							{perLevelDistances.map((pl, j) => (
								<td key={`perLevelDistance${j}`}>
									{i + 1 < (pl?.level ?? 0) || !pl.level ? (
										'\u2014'
									) : (
										<NumberTextInput
											id={`features.${pl.featureIndex}.perLevelDistances.${pl.distanceIndex}.levels.${i}`}
											label={`Level ${i + 1} ${pl.name}`}
											error={getPerLevelDistanceLevelError(
												pl.featureIndex,
												pl.distanceIndex,
												i
											)}
											touched={
												clickedSubmit ||
												getPerLevelDistanceLevelTouched(
													pl.featureIndex,
													pl.distanceIndex,
													i
												)
											}
											value={pl.levels[i]}
											onChange={getHandlePerLevelDistanceLevelChange(
												pl.featureIndex,
												pl.distanceIndex,
												i
											)}
											onBlur={getHandlePerLevelDistanceLevelBlur(
												pl.featureIndex,
												pl.distanceIndex,
												i
											)}
											hideLabel
											errorStyle={{ fontSize: '0.7rem' }}
										/>
									)}
								</td>
							))}
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
