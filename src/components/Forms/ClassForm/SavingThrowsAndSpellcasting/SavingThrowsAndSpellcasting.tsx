'use client';

import {
	EditingClassState,
	addSpellcasting,
	removeSpellcasting,
	setSavingThrow,
	setSpellcastingAbility,
	setSpellcastingLevel
} from '../../../../redux/features/editingClass';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useCallback, useMemo } from 'react';

import { AbilityItem } from '../../../../types/srd';
import Button from '../../../Button/Button';
import { Item } from '../../../../types/db/item';
import Option from '../../../Select/Option';
import Select from '../../../Select/Select/Select';
import styles from './SavingThrowsAndSpellcasting.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type SavingThrowsAndSpellcastingProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	abilities: AbilityItem[];
};

const savingThrowErrorMessage = 'Saving throws required';

const spellcastingLevelOptions = [...Array(2).keys()].map(level => ({
	value: level + 1,
	label: `${level + 1}`
}));

const SavingThrowsAndSpellcasting = ({
	abilities,
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
			abilities
				.map<Option>(ability => ({
					value: ability.index,
					label: ability.full_name
				}))
				.concat([{ label: '\u2014', value: 'blank' } as Option]),
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
				.ability,
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

		setFieldValue('spellcasting', { level: 1 }, false);
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
				!newAbility ? 'Spellcasting ability required' : undefined
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

	const handleSpellcastingLevleChange = useCallback(
		(value: string | number) => {
			if (shouldUseReduxStore) {
				dispatch(setSpellcastingLevel(value as number));
			}

			setFieldValue('spellcasting.level', value as number, false);
			setFieldTouched('spellcasting.level', true, false);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, setFieldTouched]
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
			<div className={styles['section-container']}>
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
								onChange={handleSpellcastingLevleChange}
							/>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default SavingThrowsAndSpellcasting;
