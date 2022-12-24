'use client';

import {
	AbilityItem,
	SrdEquipmentItem,
	SrdItem,
	SrdProficiencyItem
} from '../../../types/srd';
import { useCallback, useEffect, useState } from 'react';

import ClassForm from '../../../components/Forms/ClassForm/ClassForm';
import { EditingClassState } from '../../../redux/features/editingClass';
import { FormikHelpers } from 'formik';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import { useAppSelector } from '../../../hooks/reduxHooks';
import useGetSpells from '../../../hooks/useGetSpells';

type ClassProps = {
	proficiencies: SrdProficiencyItem[];
	abilities: AbilityItem[];
	equipments: SrdEquipmentItem[];
	equipmentCategories: SrdItem[];
};

const Class = ({
	proficiencies,
	abilities,
	equipments,
	equipmentCategories
}: ClassProps) => {
	const editingClass = useAppSelector(state => state.editingClass);
	const [loading, setLoading] = useState(true);
	const spellsResult = useGetSpells();

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
				abilities={abilities}
				spells={spellsResult.spells}
				equipments={equipments}
				equipmentCategories={equipmentCategories}
			/>
		</MainContent>
	);
};

export default Class;
