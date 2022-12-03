'use client';

import Button, { ButtonType } from '../../Button/Button';
import { useMemo, useState } from 'react';

import { EditingSubraceState } from '../../../redux/features/editingSubrace';
import { Formik } from 'formik';
import NameAndOverrides from './NameAndOverrides/NameAndOverrides';
import classes from './SubraceForm.module.css';
import subraceSchema from '../../../yup-schemas/subraceSchema';

type SubraceFormProps = {
	initialValues: EditingSubraceState;
	shouldUseReduxStore?: boolean;
};

const SubraceForm = ({
	initialValues,
	shouldUseReduxStore = false
}: SubraceFormProps) => {
	const [clickedSubmit, setClickedSubmit] = useState(false);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={() => {}}
			validationSchema={subraceSchema}
		>
			{({ isSubmitting }) => (
				<form className={classes.form}>
					<NameAndOverrides
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
						{`${shouldUseReduxStore ? 'Create' : 'Edit'} Subrace`}
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default SubraceForm;
