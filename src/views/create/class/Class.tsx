'use client';

import { useCallback, useEffect, useState } from 'react';

import ClassForm from '../../../components/Forms/ClassForm/ClassForm';
import { EditingClassState } from '../../../redux/features/editingClass';
import { FormikHelpers } from 'formik';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import { useAppSelector } from '../../../hooks/reduxHooks';

const Class = () => {
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
			/>
		</MainContent>
	);
};

export default Class;
