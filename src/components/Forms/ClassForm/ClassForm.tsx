'use client';

import Button, { ButtonType } from '../../Button/Button';
import { Formik, FormikHelpers } from 'formik';

import { EditingClassState } from '../../../redux/features/editingClass';
import NameAndHitDie from './NameAndHitDie/NameAndHitDie';
import classSchema from '../../../yup-schemas/classSchema';
import styles from './ClassForm.module.css';
import { useState } from 'react';

type ClassForm = {
	initialValues: EditingClassState;
	shouldUseReduxStore?: boolean;
	onSubmit: (
		values: EditingClassState,
		helpers: FormikHelpers<EditingClassState>
	) => Promise<void>;
};

const ClassForm = ({
	initialValues,
	shouldUseReduxStore = false,
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
