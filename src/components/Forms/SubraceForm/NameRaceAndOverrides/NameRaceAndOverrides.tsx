import {
	EditingSubraceState,
	removeAbilityBonus,
	removeAbilityBonusOptions,
	setName,
	setOverridesAbilityBonusOptions,
	setOverridesAbilityBonuses,
	setOverridesLanguages,
	setOverridesNumberOfLanguageOptions,
	setOverridesSize,
	setOverridesSpeed,
	setRace,
	setSize,
	setSpeed
} from '../../../../redux/features/editingSubrace';
import { FocusEventHandler, useCallback, useMemo } from 'react';

import Checkbox from '../../../Checkbox/Checkbox';
import { Item } from '../../../../types/db/item';
import Option from '../../../Select/Option';
import { Race } from '../../../../types/characterSheetBuilderAPI';
import Select from '../../../Select/Select/Select';
import TextInput from '../../../TextInput/TextInput';
import classes from './NameRaceAndOverrides.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type NameAndOverridesProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	races: Item[];
	onRaceChange: (id?: string) => void;
	race?: Race;
};

const NameRaceAndOverrides = ({
	shouldUseReduxStore,
	clickedSubmit,
	races,
	race,
	onRaceChange
}: NameAndOverridesProps) => {
	const {
		values,
		errors,
		touched,
		handleChange,
		handleBlur,
		setFieldValue,
		setFieldError,
		setFieldTouched
	} = useFormikContext<EditingSubraceState>();
	const dispatch = useAppDispatch();

	const prepOverrides = useCallback(() => {
		if (!values.overrides) {
			setFieldValue('overrides', {}, false);
		}
	}, [values.overrides, setFieldValue]);

	const handleNameBlur: FocusEventHandler<HTMLInputElement> = useCallback(
		event => {
			if (shouldUseReduxStore) {
				dispatch(setName(event.target.value));
			}

			handleBlur(event);
		},
		[handleBlur, shouldUseReduxStore, dispatch]
	);

	const handleCheckOverridesAbilityBonuses = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setOverridesAbilityBonuses(value));
			}

			if (!value) {
				values.abilityBonuses?.forEach((abilityBonus, index) => {
					if (
						race?.abilityBonuses.some(
							ab => ab.abilityScore.id === abilityBonus.abilityScore?.id
						)
					) {
						if (shouldUseReduxStore) {
							dispatch(removeAbilityBonus(index));
						}

						setFieldValue(
							'abilityBonuses',
							values.abilityBonuses?.filter((ab, i) => i !== index),
							false
						);
					}
				});
			}

			prepOverrides();
			setFieldValue('overrides.abilityBonuses', value, false);
		},
		[
			prepOverrides,
			setFieldValue,
			dispatch,
			shouldUseReduxStore,
			race?.abilityBonuses,
			values.abilityBonuses
		]
	);

	const handleCheckOverridesAbilityBonusOptions = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setOverridesAbilityBonusOptions(value));
			}

			if (!value && race?.abilityBonusOptions) {
				if (shouldUseReduxStore) {
					dispatch(removeAbilityBonusOptions());
				}

				setFieldValue('abilityBonusOptions', undefined, false);
				setFieldTouched('abilityBonusOptions', false, false);
			}

			prepOverrides();
			setFieldValue('overrides.abilityBonusOptions', value, false);
		},
		[
			prepOverrides,
			setFieldValue,
			dispatch,
			shouldUseReduxStore,
			race?.abilityBonusOptions,
			setFieldTouched
		]
	);

	const handleCheckOverridesLanguages = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setOverridesLanguages(value));
			}

			prepOverrides();
			setFieldValue('overrides.languages', value, false);
		},
		[prepOverrides, setFieldValue, dispatch, shouldUseReduxStore]
	);

	const handleCheckOverridesNumberOfLanguageOptions = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setOverridesNumberOfLanguageOptions(value));
			}

			prepOverrides();
			setFieldValue('overrides.numberOfLanguageOptions', value, false);
		},
		[prepOverrides, setFieldValue, dispatch, shouldUseReduxStore]
	);

	const handleCheckOverridesSize = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setOverridesSize(value));
			}

			if (!value) {
				if (shouldUseReduxStore) {
					dispatch(setSize(undefined));
				}

				setFieldValue('size', undefined, false);
				setFieldTouched('size', false, false);
				setFieldError('size', undefined);
			}

			prepOverrides();
			setFieldValue('overrides.size', value, false);
		},
		[
			prepOverrides,
			setFieldValue,
			dispatch,
			shouldUseReduxStore,
			setFieldTouched,
			setFieldError
		]
	);

	const handleCheckOverridesSpeed = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setOverridesSpeed(value));
			}

			if (!value) {
				if (shouldUseReduxStore) {
					dispatch(setSpeed(undefined));
				}

				setFieldValue('speed', undefined, false);
				setFieldTouched('speed', false, false);
				setFieldError('speed', undefined);
			}

			prepOverrides();
			setFieldValue('overrides.speed', value, false);
		},
		[
			prepOverrides,
			setFieldValue,
			dispatch,
			shouldUseReduxStore,
			setFieldTouched,
			setFieldError
		]
	);

	const handleRaceSelect = useCallback(
		(id: string | number) => {
			const newRace = id === 'blank' ? undefined : races.find(r => r.id === id);

			if (shouldUseReduxStore) {
				dispatch(setRace(newRace));
			}

			onRaceChange(newRace?.id);

			setFieldValue('race', newRace, false);
			setFieldTouched('race', true, false);
			setFieldError('race', !newRace ? 'Race is required' : undefined);
		},
		[
			races,
			dispatch,
			shouldUseReduxStore,
			setFieldError,
			setFieldTouched,
			setFieldValue,
			onRaceChange
		]
	);

	const raceOptions = useMemo(
		() => [
			{ label: '\u2014', value: 'blank' },
			...races.map<Option>(r => ({ label: r.name, value: r.id }))
		],
		[races]
	);

	return (
		<div className={classes.container}>
			<div className={classes.name}>
				<TextInput
					id="name"
					label="Name"
					value={values.name}
					error={errors.name}
					touched={clickedSubmit || touched.name}
					onChange={handleChange}
					onBlur={handleNameBlur}
				/>
				<Select
					id="race"
					options={raceOptions}
					value={values.race?.id ?? 'blank'}
					error={errors.race}
					touched={clickedSubmit || touched.race}
					label="Race"
					onChange={handleRaceSelect}
				/>
			</div>
			<div className={classes['overrides-container']}>
				<div className={classes['overrides-text']}>Overrides</div>
				<p>
					Toggle these checkboxes to override the base class&apos;s attributes.
				</p>
				<div className={classes.overrides}>
					<Checkbox
						checked={values.overrides?.abilityBonuses}
						label="Ability Bonuses"
						onChange={handleCheckOverridesAbilityBonuses}
					/>
					<Checkbox
						checked={values.overrides?.abilityBonusOptions}
						label="Ability Bonus Options"
						onChange={handleCheckOverridesAbilityBonusOptions}
					/>
					<Checkbox
						checked={values.overrides?.languages}
						label="Languages"
						onChange={handleCheckOverridesLanguages}
					/>
					<Checkbox
						checked={values.overrides?.numberOfLanguageOptions}
						label="Language Options"
						onChange={handleCheckOverridesNumberOfLanguageOptions}
					/>
					<Checkbox
						checked={values.overrides?.size}
						label="Size"
						onChange={handleCheckOverridesSize}
					/>
					<Checkbox
						checked={values.overrides?.speed}
						label="Speed"
						onChange={handleCheckOverridesSpeed}
					/>
				</div>
			</div>
		</div>
	);
};

export default NameRaceAndOverrides;
