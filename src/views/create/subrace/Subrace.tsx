'use client';

import { AbilityItem, SrdItem, SrdProficiencyItem } from '../../../types/srd';
import { useEffect, useState } from 'react';

import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import SubraceForm from '../../../components/Forms/SubraceForm/SubraceForm';
import { useAppSelector } from '../../../hooks/reduxHooks';
import useGetRaces from '../../../hooks/useGetRaces';
import useGetSpells from '../../../hooks/useGetSpells';

type SubraceProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
};

const Subrace = ({ abilities, languages, proficiencies }: SubraceProps) => {
	const editingSubrace = useAppSelector(state => state.editingSubrace);
	const [loading, setLoading] = useState(true);
	const racesResult = useGetRaces();
	const spellsResult = useGetSpells();

	useEffect(() => {
		if (editingSubrace) {
			setLoading(false);
		}
	}, [editingSubrace]);

	return loading || racesResult.fetching ? (
		<LoadingPageContent />
	) : (
		<MainContent>
			<h1>Create Subrace</h1>
			<SubraceForm
				initialValues={editingSubrace}
				shouldUseReduxStore
				races={racesResult.races}
				abilities={abilities}
				languages={languages}
				spells={spellsResult.spells}
				proficiencies={proficiencies}
			/>
		</MainContent>
	);
};

export default Subrace;
