'use client';

import { useEffect, useState } from 'react';

import { AbilityItem } from '../../../types/srd';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import SubraceForm from '../../../components/Forms/SubraceForm/SubraceForm';
import { useAppSelector } from '../../../hooks/reduxHooks';
import useGetRaces from '../../../hooks/useGetRaces';

type SubraceProps = {
	abilities: AbilityItem[];
};

const Subrace = ({ abilities }: SubraceProps) => {
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
			/>
		</MainContent>
	);
};

export default Subrace;
