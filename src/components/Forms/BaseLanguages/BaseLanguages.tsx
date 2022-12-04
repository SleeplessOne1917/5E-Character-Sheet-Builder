'use client';

import {
	ChangeEventHandler,
	FocusEventHandler,
	useCallback,
	useMemo
} from 'react';
import { FormikErrors, useFormikContext } from 'formik';

import { EditingSubraceState } from '../../../redux/features/editingSubrace';
import { Item } from '../../../types/db/item';
import MultiSelect from '../../Select/MultiSelect/MultiSelect';
import NumberTextInput from '../NumberTextInput/NumberTextInput';
import Option from '../../Select/Option';
import { PayloadAction } from '@reduxjs/toolkit';
import { SrdItem } from '../../../types/srd';
import classes from './BaseLanguages.module.css';
import { useAppDispatch } from '../../../hooks/reduxHooks';

export type LanguagesReduxFunctions = {
	setLanguages: (languages?: Item[]) => PayloadAction<Item[] | undefined>;
	setNumberOfLanguageOptions: (
		optionsNum?: number
	) => PayloadAction<number | undefined>;
};

type BaseLanguagesProps = {
	languages: SrdItem[];
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	showNumberOfLanguageOptions?: boolean;
	shouldRequireLanguages?: boolean;
	reduxFunctions: LanguagesReduxFunctions;
};

const BaseLanguages = ({
	languages,
	clickedSubmit,
	shouldUseReduxStore,
	showNumberOfLanguageOptions = true,
	shouldRequireLanguages = true,
	reduxFunctions: { setLanguages, setNumberOfLanguageOptions }
}: BaseLanguagesProps) => {
	const {
		values,
		touched,
		errors,
		setFieldError,
		setFieldTouched,
		setFieldValue
	} = useFormikContext<EditingSubraceState>();
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

			if (shouldRequireLanguages) {
				setFieldError(
					'languages',
					newLanguages.length === 0 ? 'Must have at least 1 language' : ''
				);
			}

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
			values.numberOfLanguageOptions,
			shouldRequireLanguages,
			setLanguages,
			setNumberOfLanguageOptions
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
				if (
					newValue &&
					newValue > languages.length - (values.languages?.length ?? 0)
				) {
					newValue = languages.length - (values.languages?.length ?? 0);
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
				values.languages?.length,
				setNumberOfLanguageOptions
			]
		);

	const languageOptions = useMemo(
		() =>
			languages.map<Option>(language => ({
				label: language.name,
				value: language.index
			})),
		[languages]
	);

	return (
		<div className={classes.container}>
			<MultiSelect
				id="languages"
				options={languageOptions}
				values={values.languages?.map(language => language.id)}
				label="Languages Known"
				touched={clickedSubmit || !!touched.languages}
				error={
					errors.languages
						? typeof errors.languages === 'string'
							? errors.languages
							: (errors.languages[0] as FormikErrors<Item>).name
						: undefined
				}
				onSelect={handleLanguagesSelect}
			/>
			{showNumberOfLanguageOptions && (
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
			)}
		</div>
	);
};

export default BaseLanguages;
