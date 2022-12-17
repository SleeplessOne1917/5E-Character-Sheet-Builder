'use client';

import { useCallback, useEffect, useState } from 'react';

import ClassForm from '../../../components/Forms/ClassForm/ClassForm';
import { EditingClassState } from '../../../redux/features/editingClass';
import { FormikHelpers } from 'formik';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import { SrdProficiencyItem } from '../../../types/srd';
import { useAppSelector } from '../../../hooks/reduxHooks';

type ClassProps = {
	proficiencies: SrdProficiencyItem[];
};

const Class = ({ proficiencies }: ClassProps) => {
	const editingClass = useAppSelector(state => state.editingClass);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (editingClass) {
			setLoading(false);
		}
	}, [editingClass]);

	const handleSubmit = useCallback(
		async (
			values: EditingClassState,
			{ resetForm }: FormikHelpers<EditingClassState>
		) => {},
		[]
	);

	return loading ? (
		<LoadingPageContent />
	) : (
		<MainContent testId="create-class">
			<h1>Create Class</h1>
			<ClassForm
				onSubmit={handleSubmit}
				initialValues={editingClass}
				shouldUseReduxStore
				proficiencies={proficiencies}
			/>
		</MainContent>
	);
};

export default Class;
