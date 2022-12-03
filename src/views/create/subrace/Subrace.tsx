'use client';

import { useEffect, useState } from 'react';

import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import SubraceForm from '../../../components/Forms/SubraceForm/SubraceForm';
import { useAppSelector } from '../../../hooks/reduxHooks';
import useGetRaces from '../../../hooks/useGetRaces';

const Subrace = () => {
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
			/>
		</MainContent>
	);
};

export default Subrace;
