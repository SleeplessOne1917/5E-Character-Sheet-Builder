import { Formik, FormikHelpers } from 'formik';
import { FocusEventHandler, useCallback, useState } from 'react';
import { SIZES } from '../../constants/sizeConstants';
import { useAppDispatch } from '../../hooks/reduxHooks';
import {
	EditingRaceState,
	setName,
	setSize,
	setSpeed
} from '../../redux/features/editingRace';
import { capitalize } from '../../services/capitalizeService';
import Size from '../../types/size';
import { AbilityItem, SrdItem } from '../../types/srd';
import raceSchema from '../../yup-schemas/raceSchema';
import Button, { ButtonType } from '../Button/Button';
import Select from '../Select/Select/Select';
import TextInput from '../TextInput/TextInput';
import classes from './RaceForm.module.css';

type RaceFormProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
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
	shouldUseReduxStore,
	initialValues,
	handleFormikSubmit
}: RaceFormProps) => {
	const dispatch = useAppDispatch();
	const [clickedSubmit, setClickedSubmit] = useState(false);

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
