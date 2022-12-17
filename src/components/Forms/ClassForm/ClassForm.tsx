'use client';

import Button, { ButtonType } from '../../Button/Button';
import { Formik, FormikHelpers } from 'formik';

import { EditingClassState } from '../../../redux/features/editingClass';
import NameAndHitDie from './NameAndHitDie/NameAndHitDie';
import ProficienciesAndProficiencyChoices from './ProficienciesAndProficiencyOptions/ProficienciesAndProficiencyChoices';
import { SrdProficiencyItem } from '../../../types/srd';
import classSchema from '../../../yup-schemas/classSchema';
import styles from './ClassForm.module.css';
import { useState } from 'react';

type ClassForm = {
	initialValues: EditingClassState;
	shouldUseReduxStore?: boolean;
	proficiencies: SrdProficiencyItem[];
	onSubmit: (
		values: EditingClassState,
		helpers: FormikHelpers<EditingClassState>
	) => Promise<void>;
};

const ClassForm = ({
	initialValues,
	shouldUseReduxStore = false,
	proficiencies,
	onSubmit
}: ClassForm) => {
	const [clickedSubmit, setClickedSubmit] = useState(false);

	return (
		<Formik
			initialValues={initialValues}
			validationSchema={classSchema}
			onSubmit={onSubmit}
		>
			{({ handleSubmit, isSubmitting }) => (
				<form onSubmit={handleSubmit} className={styles.form}>
					<NameAndHitDie
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
					/>
					<ProficienciesAndProficiencyChoices
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
						proficiencies={proficiencies}
					/>
					<Button
						positive
						type={ButtonType.submit}
						disabled={isSubmitting}
						size="large"
						style={{ marginTop: '3rem' }}
						onClick={() => {
							setClickedSubmit(true);
						}}
					>
						{`${shouldUseReduxStore ? 'Create' : 'Edit'} Race`}
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default ClassForm;
