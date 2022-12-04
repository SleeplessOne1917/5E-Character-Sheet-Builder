'use client';

import BaseLanguages, {
	LanguagesReduxFunctions
} from '../../BaseLanguages/BaseLanguages';
import {
	setLanguages,
	setNumberOfLanguageOptions
} from '../../../../redux/features/editingRace';

import { SrdItem } from '../../../../types/srd';

type LanguagesProps = {
	languages: SrdItem[];
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
};

const reduxFunctions: LanguagesReduxFunctions = {
	setLanguages,
	setNumberOfLanguageOptions
};

const Languages = ({
	languages,
	clickedSubmit,
	shouldUseReduxStore
}: LanguagesProps) => (
	<BaseLanguages
		clickedSubmit={clickedSubmit}
		languages={languages}
		shouldUseReduxStore={shouldUseReduxStore}
		reduxFunctions={reduxFunctions}
	/>
);

export default Languages;
