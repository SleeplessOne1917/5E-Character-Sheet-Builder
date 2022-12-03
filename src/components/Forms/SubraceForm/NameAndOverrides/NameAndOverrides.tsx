import {
	EditingSubraceState,
	setName,
	setOverridesAbilityBonusOptions,
	setOverridesAbilityBonuses,
	setOverridesLanguages,
	setOverridesNumberOfLanguageOptions,
	setOverridesSize,
	setOverridesSpeed
} from '../../../../redux/features/editingSubrace';
import { FocusEventHandler, useCallback } from 'react';

import Checkbox from '../../../Checkbox/Checkbox';
import TextInput from '../../../TextInput/TextInput';
import classes from './NameAndOverrides.module.css';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type NameAndOverridesProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
};

const NameAndOverrides = ({
	shouldUseReduxStore,
	clickedSubmit
}: NameAndOverridesProps) => {
	const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
		useFormikContext<EditingSubraceState>();
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

			prepOverrides();
			setFieldValue('overrides.abilityBonuses', value, false);
		},
		[prepOverrides, setFieldValue, dispatch, shouldUseReduxStore]
	);

	const handleCheckOverridesAbilityBonusOptions = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setOverridesAbilityBonusOptions(value));
			}

			prepOverrides();
			setFieldValue('overrides.abilityBonusOptions', value, false);
		},
		[prepOverrides, setFieldValue, dispatch, shouldUseReduxStore]
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

			prepOverrides();
			setFieldValue('overrides.size', value, false);
		},
		[prepOverrides, setFieldValue, dispatch, shouldUseReduxStore]
	);

	const handleCheckOverridesSpeed = useCallback(
		(value: boolean) => {
			if (shouldUseReduxStore) {
				dispatch(setOverridesSpeed(value));
			}

			prepOverrides();
			setFieldValue('overrides.speed', value, false);
		},
		[prepOverrides, setFieldValue, dispatch, shouldUseReduxStore]
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

export default NameAndOverrides;
