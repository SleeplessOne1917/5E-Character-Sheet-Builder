'use client';

import { AbilityItem, MonsterType } from '../../../../types/srd';
import { DeepError, DeepPartial, DeepTouched } from '../../../../types/helpers';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import Button from '../../../Button/Button';
import { MONSTER_TYPES } from '../../../../constants/monsterTypeConstants';
import { SIZES } from '../../../../constants/sizeConstants';
import Select from '../../../Select/Select/Select';
import Size from '../../../../types/size';
import { Summon } from '../../../../types/summon';
import SummonActions from '../SummonActions/SummonActions';
import TextInput from '../../../TextInput/TextInput';
import { capitalize } from '../../../../services/capitalizeService';
import classes from './SummonFormFields.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useCallback } from 'react';

type SummonFormFieldsProps = {
	summons?: DeepPartial<Summon>[];
	touched: DeepTouched<Summon>[];
	errors: DeepError<Summon>[];
	setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
	setFieldTouched: (
		field: string,
		isTouched?: boolean,
		shouldValidate?: boolean
	) => void;
	setFieldError: (field: string, message: string | undefined) => void;
	actions: {
		add: ActionCreatorWithPayload<any, string>;
		set: ActionCreatorWithPayload<any, string>;
		delete: ActionCreatorWithPayload<any, string>;
	};
	abilities: AbilityItem[];
};

const MAX_SUMMONS = 5;

const SummonFormFields = ({
	summons,
	touched,
	errors,
	setFieldValue,
	setFieldTouched,
	setFieldError,
	actions,
	abilities
}: SummonFormFieldsProps) => {
	const dispatch = useAppDispatch();

	const handleAddSummon = useCallback(() => {
		dispatch(actions.add(undefined));
	}, [dispatch, actions]);

	const handleSetSummonProperties = useCallback(
		(index: number, overrideProps: DeepPartial<Summon>) => {
			dispatch(actions.set({ index, overrideProps }));
		},
		[dispatch, actions]
	);

	const handleRemoveSummon = useCallback(
		(index: number) => {
			dispatch(actions.delete(index));
		},
		[dispatch, actions]
	);

	const handleChangeAbility = (
		abilityName: string,
		summonIndex: number,
		value: string
	) => {
		const parsedValue = parseInt(value);
		setFieldValue(
			`summons.${summonIndex}.${abilityName.toLowerCase()}`,
			!isNaN(parsedValue) ? parsedValue : undefined,
			false
		);
	};

	return (
		<div className={classes.summons} data-testid="summon-form-fields">
			{summons && summons.length > 0 ? (
				<>
					<h2>Summons</h2>
					{summons.map((summon, index) => (
						<div className={classes.summon} key={index} data-testid="summon">
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
									if (touched && touched[index]) {
										const newTouched = Object.keys(touched[index]).reduce<
											Partial<DeepTouched<Summon>>
										>((acc, key) => ({ ...acc, [key]: false }), {});

										setFieldTouched(
											`summons.${index}`,
											newTouched as unknown as boolean
										);
									}

									setFieldValue(
										'summons',
										summons.length <= 1
											? undefined
											: summons.filter((s, i) => i !== index),
										summons.length <= 1
									);
								}}
							>
								<XMarkIcon className={classes['close-button-icon']} /> Remove
								Summon
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
									value={summon?.name ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											name: event.target.value
										});
										setFieldTouched(`summons.${index}.name`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].name
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].name
												: undefined
											: undefined
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
									options={[{ label: '\u2014', value: 'blank' }].concat(
										SIZES.map(size => ({
											label: capitalize(size),
											value: size
										}))
									)}
									value={summon?.size ?? 'blank'}
									onChange={value => {
										const newVal =
											value !== 'blank' ? (value as Size) : undefined;
										handleSetSummonProperties(index, {
											size: newVal
										});
										setFieldValue(`summons.${index}.size`, newVal, false);
										setFieldTouched(`summons.${index}.size`, true, false);
										setFieldError(
											`summons.${index}.size`,
											newVal ? undefined : 'Summon size is required'
										);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].size
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].size
												: undefined
											: undefined
									}
								/>
								<Select
									id={`summon-${index}-type`}
									label="Type"
									options={[{ label: '\u2014', value: 'blank' }].concat(
										MONSTER_TYPES.map(monsterType => ({
											label: capitalize(monsterType),
											value: monsterType
										}))
									)}
									value={summon?.type ?? 'blank'}
									onChange={value => {
										const newVal =
											value !== 'blank' ? (value as MonsterType) : undefined;
										handleSetSummonProperties(index, {
											type: newVal
										});
										setFieldValue(`summons.${index}.type`, newVal, false);
										setFieldTouched(`summons.${index}.type`, true, false);
										setFieldError(
											`summons.${index}.type`,
											newVal ? undefined : 'Summon type is required'
										);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].type
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].type
												: undefined
											: undefined
									}
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
											htmlFor={`summon-${index}-${ability.full_name.toLowerCase()}`}
										>
											{ability.full_name}
										</label>
										<input
											id={`summon-${index}-${ability.full_name.toLowerCase()}`}
											type="text"
											placeholder={'\u2014'}
											className={`${classes['ability-input']}${
												touched &&
												touched[index] &&
												(touched as Record<string, boolean>[])[index][
													ability.full_name.toLowerCase()
												] &&
												errors &&
												errors[index] &&
												(errors as Record<string, string>[])[index][
													ability.full_name.toLowerCase()
												]
													? ` ${classes.error}`
													: ''
											}`}
											onChange={event =>
												handleChangeAbility(
													ability.full_name,
													index,
													event.target.value
												)
											}
											value={
												summon
													? (summon as Record<string, number>)[
															ability.full_name.toLowerCase()
													  ]
													: undefined
											}
											onBlur={event => {
												let value: number | undefined = parseInt(
													event.target.value
												);
												if (value < 3) {
													value = 3;
												}
												if (value > 30) {
													value = 30;
												}
												if (isNaN(value)) {
													value = undefined;
												}

												setFieldValue(
													`summons.${index}.${ability.full_name.toLowerCase()}`,
													value,
													false
												);
												handleSetSummonProperties(index, {
													[ability.full_name.toLowerCase()]: value
												});
												setFieldTouched(
													`summons.${index}.${ability.full_name.toLowerCase()}`
												);
											}}
										/>
										{touched &&
											touched[index] &&
											(touched as Record<string, boolean>[])[index][
												ability.full_name.toLowerCase()
											] &&
											errors &&
											errors[index] &&
											(errors as Record<string, string>[])[index][
												ability.full_name.toLowerCase()
											] && (
												<div className={classes['error-message']}>
													{
														(errors as Record<string, string>[])[index][
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
									id={`summon-${index}-armor-class`}
									label="Armor Class"
									onChange={event => {
										setFieldValue(
											`summons.${index}.armorClass`,
											event.target.value,
											false
										);
									}}
									value={summon?.armorClass ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											armorClass: event.target.value
										});
										setFieldTouched(`summons.${index}.armorClass`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].armorClass
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].armorClass
												: undefined
											: undefined
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
									value={summon?.hitPoints ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											hitPoints: event.target.value
										});
										setFieldTouched(`summons.${index}.hitPoints`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].hitPoints
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].hitPoints
												: undefined
											: undefined
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
									value={summon?.speed ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											speed: event.target.value
										});
										setFieldTouched(`summons.${index}.speed`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].speed
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].speed
												: undefined
											: undefined
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
									value={summon?.conditionImmunities ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											conditionImmunities: event.target.value
										});
										setFieldTouched(`summons.${index}.conditionImmunities`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].conditionImmunities
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].conditionImmunities
												: undefined
											: undefined
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
									value={summon?.damageResistances ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											damageResistances: event.target.value
										});
										setFieldTouched(`summons.${index}.damageResistances`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].damageResistances
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].damageResistances
												: undefined
											: undefined
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
									value={summon?.damageImmunities ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											damageImmunities: event.target.value
										});
										setFieldTouched(`summons.${index}.damageImmunities`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].damageImmunities
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].damageImmunities
												: undefined
											: undefined
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
									value={summon?.savingThrows ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											savingThrows: event.target.value
										});
										setFieldTouched(`summons.${index}.savingThrows`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].savingThrows
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].savingThrows
												: undefined
											: undefined
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
									value={summon?.skills ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											skills: event.target.value
										});
										setFieldTouched(`summons.${index}.skills`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].skills
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].skills
												: undefined
											: undefined
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
									value={summon?.senses ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											senses: event.target.value
										});
										setFieldTouched(`summons.${index}.senses`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].senses
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].senses
												: undefined
											: undefined
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
									value={summon?.languages ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											languages: event.target.value
										});
										setFieldTouched(`summons.${index}.languages`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].languages
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].languages
												: undefined
											: undefined
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
									value={summon?.proficiencyBonus ?? ''}
									onBlur={event => {
										handleSetSummonProperties(index, {
											proficiencyBonus: event.target.value
										});
										setFieldTouched(`summons.${index}.proficiencyBonus`);
									}}
									touched={
										touched
											? touched[index]
												? touched[index].proficiencyBonus
												: undefined
											: undefined
									}
									error={
										errors
											? errors[index]
												? errors[index].proficiencyBonus
												: undefined
											: undefined
									}
								/>
							</div>
							<div>
								<SummonActions
									id="actions"
									index={index}
									summon={summon}
									errors={errors}
									touched={touched}
									labelPlural="Actions"
									labelSingular="Action"
									handleSetSummonProperties={handleSetSummonProperties}
									setFieldTouched={setFieldTouched}
									setFieldValue={setFieldValue}
								/>
								<SummonActions
									id="specialAbilities"
									index={index}
									summon={summon}
									errors={errors}
									touched={touched}
									labelPlural="Special Abilities"
									labelSingular="Special Ability"
									handleSetSummonProperties={handleSetSummonProperties}
									setFieldTouched={setFieldTouched}
									setFieldValue={setFieldValue}
								/>
								<SummonActions
									id="bonusActions"
									index={index}
									summon={summon}
									errors={errors}
									touched={touched}
									labelPlural="Bonus Actions"
									labelSingular="Bonus Action"
									handleSetSummonProperties={handleSetSummonProperties}
									setFieldTouched={setFieldTouched}
									setFieldValue={setFieldValue}
								/>
								<SummonActions
									id="reactions"
									index={index}
									summon={summon}
									errors={errors}
									touched={touched}
									labelPlural="Reactions"
									labelSingular="Reaction"
									handleSetSummonProperties={handleSetSummonProperties}
									setFieldTouched={setFieldTouched}
									setFieldValue={setFieldValue}
								/>
							</div>
						</div>
					))}
					{summons.length < MAX_SUMMONS && (
						<Button
							positive
							style={{ display: 'flex', alignItems: 'center' }}
							onClick={() => {
								handleAddSummon();
								setFieldValue('summons', [
									...(summons ?? []),
									{
										actions: [{ name: '', description: '' }]
									} as DeepPartial<Summon>
								]);
							}}
						>
							<PlusIcon className={classes['button-icon']} /> Add Summon
						</Button>
					)}
				</>
			) : (
				<Button
					positive
					style={{ display: 'flex', alignItems: 'center' }}
					onClick={() => {
						handleAddSummon();
						setFieldValue('summons', [
							...(summons ?? []),
							{
								actions: [{ name: '', description: '' }]
							} as DeepPartial<Summon>
						]);
					}}
				>
					<PlusIcon className={classes['button-icon']} /> Add Summon
				</Button>
			)}
		</div>
	);
};

export default SummonFormFields;
