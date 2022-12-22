'use client';

import {
	EditingClassState,
	HandleSpellsType,
	SpellSlotsAndCantrips,
	addSpellcasting,
	addSpellcastingSpell,
	removeSpellcasting,
	removeSpellcastingSpell,
	setHandleSpells,
	setIsHalfCaster,
	setKnowsCantrips,
	setSavingThrow,
	setSpellcastingAbility,
	setSpellcastingCantripsKnown,
	setSpellcastingLevel,
	setSpellcastingSpellSlots,
	setSpellcastingSpellsKnown
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useCallback, useMemo } from 'react';

import { AbilityItem } from '../../../../types/srd';
import Button from '../../../Button/Button';
import Checkbox from '../../../Checkbox/Checkbox';
import { Item } from '../../../../types/db/item';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import { SpellItem } from '../../../../types/characterSheetBuilderAPI';
import SpellsSelector from '../../../Spells/SpellsSelector/SpellsSelector';
import styles from './SavingThrowsAndSpellcasting.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type SavingThrowsAndSpellcastingProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	abilities: AbilityItem[];
	spells: SpellItem[];
};

const savingThrowErrorMessage = 'Saving throws required';

const spellcastingLevelOptions = [...Array(2).keys()].map(level => ({
	value: level + 1,
	label: `${level + 1}`
}));

const spellsErrorMessage = 'Must have at least 1 spell';
const spellcastingAbilityErrorMessage = 'Spellcasting ability required';

const spellcastingHandleSpellsOptions: Option[] = [
	{ label: '\u2014', value: 'blank' },
	{ label: 'Prepare Spells', value: 'prepare' },
	{ label: 'Spells Known', value: 'spells-known' }
];

const SavingThrowsAndSpellcasting = ({
	abilities,
	spells,
	clickedSubmit,
	shouldUseReduxStore
}: SavingThrowsAndSpellcastingProps) => {
	const {
		values,
		errors,
		touched,
		setFieldError,
		setFieldTouched,
		setFieldValue
	} = useFormikContext<EditingClassState>();
	const dispatch = useAppDispatch();

	const spellcastingAbilities = useMemo(
		() =>
			[{ label: '\u2014', value: 'blank' } as Option].concat(
				abilities
					.filter(
						ability =>
							ability.index === 'cha' ||
							ability.index === 'int' ||
							ability.index === 'wis'
					)
					.map<Option>(ability => ({
						value: ability.index,
						label: ability.full_name
					}))
			),
		[abilities]
	);

	const spellcastingAbilityTouched = useMemo(
		() =>
			touched.spellcasting &&
			!!(touched.spellcasting as unknown as FormikTouched<{ ability: Item }>)
				.ability,
		[touched.spellcasting]
	);

	const spellcastingAbilityError = useMemo(
		() =>
			errors.spellcasting &&
			(errors.spellcasting as unknown as FormikErrors<{ ability: string }>)
				.ability
				? spellcastingAbilityErrorMessage
				: undefined,
		[errors.spellcasting]
	);

	const spellcastingLevelTouched = useMemo(
		() =>
			touched.spellcasting &&
			(touched.spellcasting as unknown as FormikTouched<{ level: number }>)
				.level,
		[touched.spellcasting]
	);

	const spellcastingLevelError = useMemo(
		() =>
			errors.spellcasting &&
			(errors.spellcasting as unknown as FormikErrors<{ level: number }>).level,
		[errors.spellcasting]
	);

	const spellLevels = useMemo(
		() =>
			[...new Array(!values.spellcasting?.isHalfCaster ? 10 : 6).keys()].filter(
				level => (!values.spellcasting?.knowsCantrips ? level > 0 : true)
			),
		[values.spellcasting?.isHalfCaster, values.spellcasting?.knowsCantrips]
	);

	const selectedSpells = useMemo(
		() => values.spellcasting?.spells.map(({ id }) => id) ?? [],
		[values.spellcasting?.spells]
	);

	const spellcastingSpellsTouched = useMemo(
		() =>
			touched.spellcasting &&
			!!(touched.spellcasting as unknown as FormikTouched<{ spells: boolean }>)
				.spells,
		[touched.spellcasting]
	);

	const spellcastingSpellsError = useMemo(
		() =>
			errors.spellcasting &&
			(errors.spellcasting as unknown as FormikErrors<{ spells: Item[] }>)
				.spells
				? spellsErrorMessage
				: undefined,
		[errors.spellcasting]
	);

	const handleSpellsTouched = useMemo(
		() =>
			touched.spellcasting &&
			(
				touched.spellcasting as unknown as FormikTouched<{
					handleSpells: string;
				}>
			).handleSpells,
		[touched.spellcasting]
	);

	const handleSpellsError = useMemo(
		() =>
			errors.spellcasting &&
			(
				errors.spellcasting as unknown as FormikErrors<{
					handleSpells: string;
				}>
			).handleSpells,
		[errors.spellcasting]
	);

	const getAbilitiesOptions = useCallback(
		(index: number) =>
			abilities
				.map<Option>(ability => ({
					value: ability.index,
					label: ability.full_name
				}))
				.filter(
					({ value }) =>
						!values.savingThrows.some(savingThrow => savingThrow?.id === value)
				)
				.concat(
					values.savingThrows[index]
						? [
								{
									value: values.savingThrows[index]?.id,
									label: values.savingThrows[index]?.name
								} as Option
						  ]
						: []
				)
				.concat([{ label: '\u2014', value: 'blank' } as Option]),
		[abilities, values.savingThrows]
	);

	const getSavingThrowError = useCallback(
		(index: number) =>
			errors.savingThrows
				? (errors.savingThrows as (string | undefined)[])[index]
					? savingThrowErrorMessage
					: undefined
				: undefined,
		[errors.savingThrows]
	);

	const getSavingThrowTouched = useCallback(
		(index: number) =>
			touched.savingThrows
				? (touched.savingThrows as unknown as boolean[])[index]
				: undefined,
		[touched.savingThrows]
	);

	const getHandleSavingThrowChange = useCallback(
		(index: number) => (value: string | number) => {
			const foundAbility = abilities.find(ability => ability.index === value);
			const newSavingThrow = foundAbility
				? ({ id: foundAbility.index, name: foundAbility.full_name } as Item)
				: null;

			if (shouldUseReduxStore) {
				dispatch(setSavingThrow({ index, savingThrow: newSavingThrow }));
			}

			setFieldValue(`savingThrows.${index}`, newSavingThrow, false);
			setFieldTouched(`savingThrows.${index}`, true, false);
			setFieldError(
				`savingThrows.${index}`,
				!foundAbility ? savingThrowErrorMessage : undefined
			);
		},
		[
			abilities,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			shouldUseReduxStore
		]
	);

	const handleAddSpellcasting = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addSpellcasting());
		}

		setFieldValue(
			'spellcasting',
			{
				level: 1,
				spells: [],
				isHalfCaster: false,
				knowsCantrips: true,
				spellSlotsAndCantripsPerLevel: [
					...Array(20).keys()
				].map<SpellSlotsAndCantrips>(() => ({
					spellsKnown: null,
					cantrips: null,
					level1: null,
					level2: null,
					level3: null,
					level4: null,
					level5: null,
					level6: null,
					level7: null,
					level8: null,
					level9: null
				}))
			},
			false
		);
	}, [dispatch, shouldUseReduxStore, setFieldValue]);

	const handleRemoveSpellcasting = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(removeSpellcasting());
		}

		setFieldValue('spellcasting', undefined, false);
	}, [shouldUseReduxStore, dispatch, setFieldValue]);

	const handleSpellcastingAbilityChange = useCallback(
		(value: string | number) => {
			const foundAbility = abilities.find(ability => ability.index === value);
			const newAbility = foundAbility
				? ({ id: foundAbility.index, name: foundAbility.full_name } as Item)
				: undefined;

			if (shouldUseReduxStore) {
				dispatch(setSpellcastingAbility(newAbility));
			}

			setFieldValue('spellcasting.ability', newAbility, false);
			setFieldTouched('spellcasting.ability', true, false);
			setFieldError(
				'spellcasting.ability',
				!newAbility ? spellcastingAbilityErrorMessage : undefined
			);
		},
		[
			abilities,
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldValue,
			setFieldTouched
		]
	);

	const handleSpellcastingLevelChange = useCallback(
		(value: string | number) => {
			if (shouldUseReduxStore) {
				dispatch(setSpellcastingLevel(value as number));
			}

			if (value === 2) {
				if (shouldUseReduxStore) {
					dispatch(
						setSpellcastingSpellsKnown({ classLevel: 1, spellsKnown: null })
					);
					for (let i = 0; i < 10; ++i) {
						if (i === 0) {
							dispatch(
								setSpellcastingCantripsKnown({
									classLevel: 1,
									cantrips: null
								})
							);
						} else {
							dispatch(
								setSpellcastingSpellSlots({
									classLevel: 1,
									spellLevel: i,
									slots: null
								})
							);
						}
					}
				}

				setFieldValue(
					'spellcasting.spellSlotsAndCantripsPerLevel.0.spellsKnown',
					null,
					false
				);

				for (let i = 0; i < 10; ++i) {
					if (i === 0) {
						setFieldValue(
							'spellcasting.spellSlotsAndCantripsPerLevel.0.cantrips',
							null,
							false
						);
					} else {
						setFieldValue(
							`spellcasting.spellSlotsAndCantripsPerLevel.0.level${i}`,
							null,
							false
						);
					}
				}
			}

			setFieldValue('spellcasting.level', value as number, false);
			setFieldTouched('spellcasting.level', true, false);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, setFieldTouched]
	);

	const handleAddSpellcastingSpell = useCallback(
		(spell: SpellItem) => {
			if (shouldUseReduxStore) {
				dispatch(addSpellcastingSpell(spell));
			}

			setFieldValue(
				'spellcasting.spells',
				[...(values.spellcasting?.spells ?? []), spell],
				false
			);
			setFieldTouched('spellcasting.spells', true, false);
			setFieldError('spellcasting.spells', undefined);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			values.spellcasting?.spells,
			setFieldTouched,
			setFieldError
		]
	);

	const handleRemoveSpellcastingSpell = useCallback(
		(spell: SpellItem) => {
			if (shouldUseReduxStore) {
				dispatch(removeSpellcastingSpell(spell.id));
			}

			const newSpells =
				values.spellcasting?.spells.filter(({ id }) => id !== spell.id) ?? [];

			setFieldValue('spellcasting.spells', newSpells, false);
			setFieldTouched('spellcasting.spells', true, false);
			setFieldError(
				'spellcasting.spells',
				newSpells.length === 0 ? spellsErrorMessage : undefined
			);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			setFieldTouched,
			setFieldError,
			values.spellcasting?.spells
		]
	);

	const filterSpells = useCallback(
		(spell: SpellItem) => spellLevels.includes(spell.level),
		[spellLevels]
	);

	const handleIsHalfCasterChange = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setIsHalfCaster(value));
			}

			if (value) {
				const spellIdsToRemove = (values.spellcasting?.spells ?? [])
					.filter(spell => spells.find(s => s.id === spell.id)!.level > 5)
					.map(({ id }) => id);

				if (shouldUseReduxStore) {
					for (const id of spellIdsToRemove) {
						dispatch(removeSpellcastingSpell(id));
					}

					for (let i = 1; i <= 20; ++i) {
						for (let j = 6; j < 10; ++j) {
							dispatch(
								setSpellcastingSpellSlots({
									classLevel: i,
									spellLevel: j,
									slots: null
								})
							);
						}
					}
				}

				setFieldValue(
					'spellcasting.spells',
					values.spellcasting?.spells.filter(
						spell => !spellIdsToRemove.includes(spell.id)
					) ?? [],
					false
				);

				for (let i = 0; i < 20; ++i) {
					for (let j = 6; j < 10; ++j) {
						setFieldValue(
							`spellcasting.spellSlotsAndCantripsPerLevel.${i}.level${j}`,
							null,
							false
						);
					}
				}
			}

			setFieldValue('spellcasting.isHalfCaster', value, false);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			spells,
			values.spellcasting?.spells
		]
	);

	const handleKnowsCantripsChange = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setKnowsCantrips(value));
			}

			if (!value) {
				const spellIdsToRemove = (values.spellcasting?.spells ?? [])
					.filter(spell => spells.find(s => s.id === spell.id)!.level === 0)
					.map(({ id }) => id);

				if (shouldUseReduxStore) {
					for (const id of spellIdsToRemove) {
						dispatch(removeSpellcastingSpell(id));
					}
				}

				setFieldValue(
					'spellcasting.spells',
					values.spellcasting?.spells.filter(
						spell => !spellIdsToRemove.includes(spell.id)
					) ?? [],
					false
				);

				for (let i = 1; i <= 20; ++i) {
					if (shouldUseReduxStore) {
						dispatch(
							setSpellcastingCantripsKnown({ classLevel: i, cantrips: null })
						);
					}

					setFieldValue(
						`spellcasting.spellSlotsAndCantripsPerLevel.${i - 1}.cantrips`,
						null,
						false
					);
				}
			}

			setFieldValue('spellcasting.knowsCantrips', value, false);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldValue,
			spells,
			values.spellcasting?.spells
		]
	);

	const handleHandleSpellsChange = useCallback(
		(value: string | number) => {
			const newValue =
				value !== 'blank' ? (value as HandleSpellsType) : undefined;

			if (shouldUseReduxStore) {
				dispatch(setHandleSpells(newValue));
			}

			if (newValue !== 'spells-known') {
				for (let i = 1; i <= 20; ++i) {
					if (shouldUseReduxStore) {
						dispatch(
							setSpellcastingSpellsKnown({ classLevel: i, spellsKnown: null })
						);
					}

					setFieldValue(
						`spellcasting.spellSlotsAndCantripsPerLevel.${i - 1}.spellsKnown`,
						null,
						false
					);
				}
			}

			setFieldValue('spellcasting.handleSpells', newValue, false);
			setFieldTouched('spellcasting.handleSpells', true, false);
			setFieldError(
				'spellcasting.handleSpells',
				!newValue ? 'Handle Spells is required' : undefined
			);
		},
		[
			shouldUseReduxStore,
			dispatch,
			setFieldError,
			setFieldTouched,
			setFieldValue
		]
	);

	return (
		<>
			<div className={styles['section-container']}>
				<div className={styles.title}>Saving Throws</div>
				<div className={styles['saving-throws']}>
					{values.savingThrows.map((savingThrow, i) => (
						<Select
							key={i}
							options={getAbilitiesOptions(i)}
							id={`savingThrows.${i}`}
							label={`Saving Throw ${i + 1}`}
							value={savingThrow?.id ?? 'blank'}
							error={getSavingThrowError(i)}
							touched={clickedSubmit || getSavingThrowTouched(i)}
							onChange={getHandleSavingThrowChange(i)}
						/>
					))}
				</div>
			</div>
			<div
				className={styles['section-container']}
				style={{ backgroundColor: 'var(--highlight-light)' }}
			>
				<div className={styles.title}>Spellcasting</div>
				{!values.spellcasting && (
					<Button positive onClick={handleAddSpellcasting}>
						Add Spellcasting
					</Button>
				)}
				{values.spellcasting && (
					<>
						<Button onClick={handleRemoveSpellcasting}>
							Remove Spellcasting
						</Button>
						<div className={styles['ability-level']}>
							<Select
								id="spellcasting.ability"
								label="Ability"
								options={spellcastingAbilities}
								value={values.spellcasting.ability?.id ?? 'blank'}
								touched={clickedSubmit || spellcastingAbilityTouched}
								error={spellcastingAbilityError}
								onChange={handleSpellcastingAbilityChange}
							/>
							<Select
								id="spellcasting.level"
								label="Start Level"
								value={values.spellcasting.level ?? 'blank'}
								options={spellcastingLevelOptions}
								touched={clickedSubmit || spellcastingLevelTouched}
								error={spellcastingLevelError}
								onChange={handleSpellcastingLevelChange}
							/>
							<Checkbox
								label="Half Caster"
								checked={values.spellcasting.isHalfCaster}
								onChange={handleIsHalfCasterChange}
							/>
							<Checkbox
								label="Knows Cantrips"
								checked={values.spellcasting.knowsCantrips}
								onChange={handleKnowsCantripsChange}
							/>
							<Select
								id="spellcasting.handleSpells"
								label="Handle Spells"
								options={spellcastingHandleSpellsOptions}
								value={values.spellcasting.handleSpells ?? 'blank'}
								touched={clickedSubmit || handleSpellsTouched}
								error={handleSpellsError}
								onChange={handleHandleSpellsChange}
							/>
						</div>
						<div
							className={`${styles.spells}${
								(spellcastingSpellsTouched || clickedSubmit) &&
								spellcastingSpellsError
									? ` ${styles.error}`
									: ''
							}`}
						>
							<SpellsSelector
								label="Spells"
								levels={spellLevels}
								selectedSpells={selectedSpells}
								spells={spells}
								onAdd={handleAddSpellcastingSpell}
								onRemove={handleRemoveSpellcastingSpell}
								filterSpell={filterSpells}
							/>
							{(spellcastingSpellsTouched || clickedSubmit) &&
								spellcastingSpellsError && (
									<div className={styles['error-message']}>
										{spellcastingSpellsError}
									</div>
								)}
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default SavingThrowsAndSpellcasting;