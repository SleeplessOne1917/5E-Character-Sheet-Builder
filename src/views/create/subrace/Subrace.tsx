'use client';

import { AbilityItem, SrdItem } from '../../../types/srd';
import { useEffect, useState } from 'react';

import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import SubraceForm from '../../../components/Forms/SubraceForm/SubraceForm';
import { useAppSelector } from '../../../hooks/reduxHooks';
import useGetRaces from '../../../hooks/useGetRaces';

type SubraceProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
};

const Subrace = ({ abilities, languages }: SubraceProps) => {
	const editingSubrace = useAppSelector(state => state.editingSubrace);
	const [loading, setLoading] = useState(true);
	const racesResult = useGetRaces();

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
			/>
		</MainContent>
	);
};

export default Subrace;
