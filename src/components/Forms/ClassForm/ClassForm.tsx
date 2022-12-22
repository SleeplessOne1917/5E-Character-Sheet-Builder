'use client';

import { AbilityItem, SrdProficiencyItem } from '../../../types/srd';
import Button, { ButtonType } from '../../Button/Button';
import { Formik, FormikHelpers } from 'formik';

import { EditingClassState } from '../../../redux/features/editingClass';
import Levels from './Levels/Levels';
import NameAndHitDie from './NameAndHitDie/NameAndHitDie';
import ProficienciesAndProficiencyChoices from './ProficienciesAndProficiencyOptions/ProficienciesAndProficiencyChoices';
import SavingThrowsAndSpellcasting from './SavingThrowsAndSpellcasting/SavingThrowsAndSpellcasting';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import classSchema from '../../../yup-schemas/classSchema';
import styles from './ClassForm.module.css';
import { useState } from 'react';

type ClassForm = {
	initialValues: EditingClassState;
	shouldUseReduxStore?: boolean;
	proficiencies: SrdProficiencyItem[];
	abilities: AbilityItem[];
	onSubmit: (
		values: EditingClassState,
		helpers: FormikHelpers<EditingClassState>
	) => Promise<void>;
	spells: SpellItem[];
};

const ClassForm = ({
	initialValues,
	shouldUseReduxStore = false,
	proficiencies,
	abilities,
	spells,
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
					<SavingThrowsAndSpellcasting
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
						abilities={abilities}
						spells={spells}
					/>
					<Levels
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
