'use client';

import BaseLanguages, {
	LanguagesReduxFunctions
} from '../../BaseLanguages/BaseLanguages';
import {
	EditingSubraceState,
	setLanguages,
	setNumberOfLanguageOptions
} from '../../../../redux/features/editingSubrace';

import { Race } from '../../../../types/characterSheetBuilderAPI';
import { SrdItem } from '../../../../types/srd';
import { useFormikContext } from 'formik';
import { useMemo } from 'react';

type LanguagesProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	race: Race;
	languages: SrdItem[];
};

const reduxFunctions: LanguagesReduxFunctions = {
	setLanguages,
	setNumberOfLanguageOptions
};

const Languages = ({
	clickedSubmit,
	shouldUseReduxStore,
	race,
	languages
}: LanguagesProps) => {
	const { values } = useFormikContext<EditingSubraceState>();

	const availableLanguages = useMemo(
		() =>
			values.overrides?.languages
				? languages
				: languages.filter(
						language => !race.languages.some(l => l.id === language.index)
				  ),
		[languages, values.overrides?.languages, race.languages]
	);

	const showNumberOfLanguageOptions = useMemo(
		() =>
			!!values.overrides?.numberOfLanguageOptions ||
			!race.numberOfLanguageOptions,
		[values.overrides?.numberOfLanguageOptions, race.numberOfLanguageOptions]
	);

	return (
		<BaseLanguages
			clickedSubmit={clickedSubmit}
			shouldUseReduxStore={shouldUseReduxStore}
			languages={availableLanguages}
			reduxFunctions={reduxFunctions}
			shouldRequireLanguages={values.overrides?.languages ?? false}
			showNumberOfLanguageOptions={showNumberOfLanguageOptions}
		/>
	);
};

export default Languages;
