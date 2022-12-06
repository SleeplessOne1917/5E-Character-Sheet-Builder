'use client';

import { AbilityItem, MonsterType } from '../../../../types/srd';
import {
	FocusEventHandler,
	MouseEventHandler,
	useCallback,
	useMemo
} from 'react';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';

import Button from '../../../Button/Button';
import { DeepPartial } from '../../../../types/helpers';
import { MONSTER_TYPES } from '../../../../constants/monsterTypeConstants';
import Option from '../../../Select/Option';
import { PayloadAction } from '@reduxjs/toolkit';
import { SIZES } from '../../../../constants/sizeConstants';
import Select from '../../../Select/Select/Select';
import Size from '../../../../types/size';
import SummonActions from '../SummonActions/SummonActions';
import { Summon as SummonType } from '../../../../types/summon';
import TextInput from '../../../TextInput/TextInput';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { capitalize } from '../../../../services/capitalizeService';
import classes from './Summon.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';

type SummonProps = {
	abilities: AbilityItem[];
	summon: DeepPartial<SummonType>;
	index: number;
	reduxSet: (val: {
		index: number;
		overrideProps: DeepPartial<SummonType>;
	}) => PayloadAction<{
		index: number;
		overrideProps: DeepPartial<SummonType>;
	}>;
	reduxDelete: (val: number) => PayloadAction<number>;
};

const sizesOptions: Option[] = [{ label: '\u2014', value: 'blank' }].concat(
	SIZES.map(size => ({
		label: capitalize(size),
		value: size
	}))
);

const monsterTypes: Option[] = [{ label: '\u2014', value: 'blank' }].concat(
	MONSTER_TYPES.map(monsterType => ({
		label: capitalize(monsterType),
		value: monsterType
	}))
);

const Summon = ({
	abilities,
	index,
	reduxSet,
	summon,
	reduxDelete
}: SummonProps) => {
	const {
		touched,
		errors,
		setFieldValue,
		setFieldTouched,
		setFieldError,
		values,
		handleChange,
		handleBlur
	} = useFormikContext<{ summons?: DeepPartial<SummonType>[] }>();
	const dispatch = useAppDispatch();

	const baseStr = `summons.${index}`;
	const baseTouched = touched.summons
		? (touched.summons as unknown as FormikTouched<SummonType>[])[index]
		: undefined;
	const baseErrors = errors.summons
		? (errors.summons as unknown as FormikErrors<SummonType>[])[index]
		: undefined;

	const handleSetSummonProperties = useCallback(
		(overrideProps: DeepPartial<SummonType>) => {
			dispatch(reduxSet({ index, overrideProps }));
		},
		[dispatch, reduxSet, index]
	);

	const handleRemoveSummon: MouseEventHandler<HTMLButtonElement> =
		useCallback(() => {
			dispatch(reduxDelete(index));

			if (baseTouched) {
				const newTouched = Object.keys(baseTouched).reduce<
					FormikTouched<SummonType>
				>((acc, key) => ({ ...acc, [key]: false }), {});

				setFieldTouched(baseStr, newTouched as unknown as boolean);
			}

			setFieldValue(
				'summons',
				(values.summons?.length ?? 0) <= 1
					? undefined
					: values.summons?.filter((s, i) => i !== index),
				(values.summons?.length ?? 0) <= 1
			);
		}, [
			dispatch,
			reduxDelete,
			setFieldValue,
			setFieldTouched,
			baseTouched,
			values.summons,
			baseStr,
			index
		]);

	const getTextBlurHandler = useCallback(
		(key: string): FocusEventHandler<HTMLInputElement> =>
			event => {
				handleSetSummonProperties({
					[key]: event.target.value
				});

				handleBlur(event);
			},
		[handleBlur, handleSetSummonProperties]
	);

	const handleNameBlur = useMemo(
		() => getTextBlurHandler('name'),
		[getTextBlurHandler]
	);

	const handleSizeChange = useCallback(
		(value: string | number) => {
			const newVal = value !== 'blank' ? (value as Size) : undefined;
			handleSetSummonProperties({
				size: newVal
			});

			setFieldValue(`${baseStr}.size`, newVal, false);
			setFieldTouched(`${baseStr}.size`, true, false);
			setFieldError(
				`${baseStr}.size`,
				newVal ? undefined : 'Summon size is required'
			);
		},
		[
			handleSetSummonProperties,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			baseStr
		]
	);

	const handleTypeChange = useCallback(
		(value: string | number) => {
			const newVal = value !== 'blank' ? (value as MonsterType) : undefined;
			handleSetSummonProperties({
				type: newVal
			});

			setFieldValue(`${baseStr}.type`, newVal, false);
			setFieldTouched(`${baseStr}.type`, true, false);
			setFieldError(
				`${baseStr}.type`,
				newVal ? undefined : 'Summon type is required'
			);
		},
		[
			handleSetSummonProperties,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			baseStr
		]
	);

	const getAbilityBlurHandler = useCallback(
		(abilityName: string): FocusEventHandler<HTMLInputElement> =>
			event => {
				let value: number | undefined = parseInt(event.target.value, 10);
				if (value < 3) {
					value = 3;
				}
				if (value > 30) {
					value = 30;
				}
				if (isNaN(value)) {
					value = undefined;
				}

				setFieldValue(`${baseStr}.${abilityName.toLowerCase()}`, value, false);
				handleSetSummonProperties({
					[abilityName.toLowerCase()]: value
				});
				setFieldTouched(`${baseStr}.${abilityName.toLowerCase()}`);
			},
		[setFieldValue, setFieldTouched, handleSetSummonProperties, baseStr]
	);

	const getAbilityError = useCallback(
		(abilityName: string) =>
			baseTouched &&
			(baseTouched as Record<string, boolean>[])[index] &&
			(baseTouched as Record<string, boolean>[])[index][
				abilityName.toLowerCase()
			] &&
			baseErrors &&
			(baseErrors as Record<string, string>[])[index] &&
			(baseErrors as Record<string, string>[])[index][
				abilityName.toLowerCase()
			],
		[baseTouched, baseErrors, index]
	);

	const handleArmorClassBlur = useMemo(
		() => getTextBlurHandler('armorClass'),
		[getTextBlurHandler]
	);

	const handleHitPointsBlur = useMemo(
		() => getTextBlurHandler('hitPoints'),
		[getTextBlurHandler]
	);

	const handleSpeedBlur = useMemo(
		() => getTextBlurHandler('speed'),
		[getTextBlurHandler]
	);

	const handleConditionImmunitiesBlur = useMemo(
		() => getTextBlurHandler('conditionImmunities'),
		[getTextBlurHandler]
	);

	const handleDamageResistancesBlur = useMemo(
		() => getTextBlurHandler('damageResistances'),
		[getTextBlurHandler]
	);

	const handleDamageImmunitiesBlur = useMemo(
		() => getTextBlurHandler('damageImmunities'),
		[getTextBlurHandler]
	);

	const handleSavingThrowsBlur = useMemo(
		() => getTextBlurHandler('savingThrows'),
		[getTextBlurHandler]
	);

	const handleSkillsBlur = useMemo(
		() => getTextBlurHandler('skills'),
		[getTextBlurHandler]
	);

	const handleSensesBlur = useMemo(
		() => getTextBlurHandler('senses'),
		[getTextBlurHandler]
	);

	const handleLanguagesBlur = useMemo(
		() => getTextBlurHandler('languages'),
		[getTextBlurHandler]
	);

	const handleProficiencyBonusBlur = useMemo(
		() => getTextBlurHandler('proficiencyBonus'),
		[getTextBlurHandler]
	);

	return (
		<div className={classes.summon} data-testid="summon">
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
				onClick={handleRemoveSummon}
			>
				<XMarkIcon className={classes['close-button-icon']} /> Remove Summon
			</Button>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center'
				}}
			>
				<TextInput
					id={`${baseStr}.name`}
					label="Name"
					onChange={handleChange}
					value={summon?.name ?? ''}
					onBlur={handleNameBlur}
					touched={baseTouched?.name}
					error={baseErrors?.name}
				/>
			</div>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-evenly'
				}}
			>
				<Select
					id={`${baseStr}.size`}
					label="Size"
					options={sizesOptions}
					value={summon?.size ?? 'blank'}
					onChange={handleSizeChange}
					touched={baseTouched?.size}
					error={baseErrors?.size}
				/>
				<Select
					id={`${baseStr}.type`}
					label="Type"
					options={monsterTypes}
					value={summon?.type ?? 'blank'}
					onChange={handleTypeChange}
					touched={baseTouched?.type}
					error={baseErrors?.type}
				/>
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexWrap: 'wrap',
					justifyContent: 'space-evenly'
				}}
			>
				{abilities.map(ability => (
					<div className={classes['ability']} key={ability.index}>
						<label
							className={classes['ability-label']}
							htmlFor={`${baseStr}.${ability.full_name.toLowerCase()}`}
						>
							{ability.full_name}
						</label>
						<input
							id={`${baseStr}.${ability.full_name.toLowerCase()}`}
							type="text"
							placeholder={'\u2014'}
							className={`${classes['ability-input']}${
								getAbilityError(ability.full_name) ? ` ${classes.error}` : ''
							}`}
							onChange={handleChange}
							value={
								summon
									? (summon as unknown as Record<string, number>)[
											ability.full_name.toLowerCase()
									  ]
									: undefined
							}
							onBlur={getAbilityBlurHandler(ability.full_name)}
						/>
						{getAbilityError(ability.full_name) && (
							<div className={classes['error-message']}>
								{
									(baseErrors as Record<string, string>)[
										ability.full_name.toLowerCase()
									]
								}
							</div>
						)}
					</div>
				))}
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
					id={`${baseStr}.armorClass`}
					label="Armor Class"
					onChange={handleChange}
					value={summon?.armorClass ?? ''}
					onBlur={handleArmorClassBlur}
					touched={baseTouched?.armorClass}
					error={baseErrors?.armorClass}
				/>
				<TextInput
					id={`${baseStr}.hitPoints`}
					label="Hit Points"
					onChange={handleChange}
					value={summon?.hitPoints ?? ''}
					onBlur={handleHitPointsBlur}
					touched={baseTouched?.hitPoints}
					error={baseErrors?.hitPoints}
				/>
				<TextInput
					id={`${baseStr}.speed`}
					label="Speed"
					onChange={handleChange}
					value={summon?.speed ?? ''}
					onBlur={handleSpeedBlur}
					touched={baseTouched?.speed}
					error={baseErrors?.speed}
				/>
				<TextInput
					id={`${baseStr}.conditionImmunities`}
					label="Condition Immunities"
					onChange={handleChange}
					value={summon?.conditionImmunities ?? ''}
					onBlur={handleConditionImmunitiesBlur}
					touched={baseTouched?.conditionImmunities}
					error={baseErrors?.conditionImmunities}
				/>
				<TextInput
					id={`${baseStr}.damageResistances`}
					label="Damage Resistances"
					onChange={handleChange}
					value={summon?.damageResistances ?? ''}
					onBlur={handleDamageResistancesBlur}
					touched={baseTouched?.damageResistances}
					error={baseErrors?.damageResistances}
				/>
				<TextInput
					id={`${baseStr}.damageImmunities`}
					label="Damage Immunities"
					onChange={handleChange}
					value={summon?.damageImmunities ?? ''}
					onBlur={handleDamageImmunitiesBlur}
					touched={baseTouched?.damageImmunities}
					error={baseErrors?.damageImmunities}
				/>
				<TextInput
					id={`${baseStr}.savingThrows`}
					label="Saving Throws"
					onChange={handleChange}
					value={summon?.savingThrows ?? ''}
					onBlur={handleSavingThrowsBlur}
					touched={baseTouched?.savingThrows}
					error={baseErrors?.savingThrows}
				/>
				<TextInput
					id={`${baseStr}.skills`}
					label="Skills"
					onChange={handleChange}
					value={summon?.skills ?? ''}
					onBlur={handleSkillsBlur}
					touched={baseTouched?.skills}
					error={baseErrors?.skills}
				/>
				<TextInput
					id={`${baseStr}.senses`}
					label="Senses"
					onChange={handleChange}
					value={summon?.senses ?? ''}
					onBlur={handleSensesBlur}
					touched={baseTouched?.senses}
					error={baseErrors?.senses}
				/>
				<TextInput
					id={`${baseStr}.languages`}
					label="Languages"
					onChange={handleChange}
					value={summon?.languages ?? ''}
					onBlur={handleLanguagesBlur}
					touched={baseTouched?.languages}
					error={baseErrors?.languages}
				/>
				<TextInput
					id={`${baseStr}.proficiencyBonus`}
					label="Proficiency Bonus"
					onChange={handleChange}
					value={summon?.proficiencyBonus ?? ''}
					onBlur={handleProficiencyBonusBlur}
					touched={baseTouched?.proficiencyBonus}
					error={baseErrors?.proficiencyBonus}
				/>
			</div>
			<div>
				<SummonActions
					id="actions"
					summon={summon}
					baseErrors={baseErrors?.actions}
					baseTouched={baseTouched?.actions}
					labelPlural="Actions"
					labelSingular="Action"
					onSetSummonProperties={handleSetSummonProperties}
					parentBaseStr={baseStr}
				/>
				<SummonActions
					id="specialAbilities"
					summon={summon}
					baseErrors={baseErrors?.specialAbilities}
					baseTouched={baseTouched?.specialAbilities}
					labelPlural="Special Abilities"
					labelSingular="Special Ability"
					onSetSummonProperties={handleSetSummonProperties}
					parentBaseStr={baseStr}
				/>
				<SummonActions
					id="bonusActions"
					summon={summon}
					baseErrors={baseErrors?.bonusActions}
					baseTouched={baseTouched?.bonusActions}
					labelPlural="Bonus Actions"
					labelSingular="Bonus Action"
					onSetSummonProperties={handleSetSummonProperties}
					parentBaseStr={baseStr}
				/>
				<SummonActions
					id="reactions"
					summon={summon}
					baseErrors={baseErrors?.reactions}
					baseTouched={baseTouched?.reactions}
					labelPlural="Reactions"
					labelSingular="Reaction"
					onSetSummonProperties={handleSetSummonProperties}
					parentBaseStr={baseStr}
				/>
			</div>
		</div>
	);
};

export default Summon;
