import { ChangeEventHandler, FocusEventHandler, useCallback } from 'react';
import {
	EditingRaceState,
	setLanguages,
	setNumberOfLanguageOptions
} from '../../../redux/features/editingRace';
import { FormikErrors, useFormikContext } from 'formik';

import { Item } from '../../../types/db/item';
import MultiSelect from '../../Select/MultiSelect/MultiSelect';
import NumberTextInput from '../NumberTextInput/NumberTextInput';
import { SrdItem } from '../../../types/srd';
import classes from './Languages.module.css';
import { useAppDispatch } from '../../../hooks/reduxHooks';

type LanguagesProps = {
	languages: SrdItem[];
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
};

const Languages = ({
	languages,
	clickedSubmit,
	shouldUseReduxStore
}: LanguagesProps) => {
	const {
		values,
		touched,
		errors,
		setFieldError,
		setFieldTouched,
		setFieldValue
	} = useFormikContext<EditingRaceState>();
	const dispatch = useAppDispatch();

	const handleLanguagesSelect = useCallback(
		(selectValues: (string | number)[]) => {
			const newLanguages = languages
				.filter(language => (selectValues as string[]).includes(language.index))
				.map<Item>(language => ({
					id: language.index,
					name: language.name
				}));

			if (shouldUseReduxStore) {
				dispatch(setLanguages(newLanguages));
			}

			setFieldValue('languages', newLanguages, false);
			setFieldTouched('languages', true, false);
			setFieldError(
				'languages',
				newLanguages.length === 0 ? 'Must have at least 1 language' : ''
			);

			if (
				(values.numberOfLanguageOptions ?? 0) + newLanguages.length >
				languages.length
			) {
				setFieldValue(
					'numberOfLanguageOptions',
					languages.length - newLanguages.length,
					false
				);

				if (shouldUseReduxStore) {
					dispatch(
						setNumberOfLanguageOptions(languages.length - newLanguages.length)
					);
				}
			}
		},
		[
			setFieldError,
			setFieldTouched,
			setFieldValue,
			dispatch,
			languages,
			shouldUseReduxStore,
			values.numberOfLanguageOptions
		]
	);

	const handleNumberOfLanguageOptionsChange: ChangeEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				setFieldValue('numberOfLanguageOptions', event.target.value, false);
			},
			[setFieldValue]
		);

	const handleNumberOfLanguageOptionsBlur: FocusEventHandler<HTMLInputElement> =
		useCallback(
			event => {
				const parsedValue = parseInt(event.target.value);
				let newValue = !isNaN(parsedValue) ? parsedValue : undefined;
				if (newValue && newValue < 0) {
					newValue = 0;
				}
				if (newValue && newValue > languages.length - values.languages.length) {
					newValue = languages.length - values.languages.length;
				}

				if (shouldUseReduxStore) {
					dispatch(setNumberOfLanguageOptions(newValue));
				}
				setFieldValue('numberOfLanguageOptions', newValue, false);
				setFieldTouched('numberOfLanguageOptions', true, false);
			},
			[
				dispatch,
				setFieldValue,
				setFieldTouched,
				shouldUseReduxStore,
				languages.length,
				values.languages.length
			]
		);

	return (
		<div className={classes['languages-container']}>
			<MultiSelect
				id="languages"
				options={languages.map(language => ({
					label: language.name,
					value: language.index
				}))}
				values={values.languages.map(language => language.id)}
				label="Languages Known"
				touched={
					clickedSubmit ||
					(touched.languages?.length !== undefined
						? false
						: !!touched.languages)
				}
				error={
					errors.languages
						? typeof errors.languages === 'string'
							? errors.languages
							: (errors.languages[0] as FormikErrors<Item>).name
						: undefined
				}
				onSelect={handleLanguagesSelect}
			/>
			<NumberTextInput
				id="numberOfLanguageOptions"
				label="Number of language options"
				value={values.numberOfLanguageOptions}
				touched={clickedSubmit || touched.numberOfLanguageOptions}
				error={errors.numberOfLanguageOptions}
				onChange={handleNumberOfLanguageOptionsChange}
				onBlur={handleNumberOfLanguageOptionsBlur}
				errorStyle={{ fontSize: '1rem' }}
			/>
		</div>
	);
};

export default Languages;
