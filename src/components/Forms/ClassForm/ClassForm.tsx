'use client';

import {
	AbilityItem,
	SrdEquipmentItem,
	SrdItem,
	SrdProficiencyItem
} from '../../../types/srd';
import Button, { ButtonType } from '../../Button/Button';
import { Formik, FormikHelpers } from 'formik';

import { EditingClassState } from '../../../redux/features/editingClass';
import Levels from './Levels/Levels';
import NameAndHitDie from './NameAndHitDie/NameAndHitDie';
import Proficiencies from './Proficiencies/Proficiencies';
import ProficiencyChoices from './ProficiencyChoices/ProficiencyChoices';
import SavingThrows from './SavingThrows/SavingThrows';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import Spellcasting from './Spellcasting/Spellcasting';
import StartingEquipmentChoices from './StartingEquipmentChoices/StartingEquipmentChoices';
import StartingEuipment from './StartingEquipment/StartingEquipment';
import classSchema from '../../../yup-schemas/classSchema';
import styles from './ClassForm.module.css';
import { useState } from 'react';

type ClassForm = {
	initialValues: EditingClassState;
	shouldUseReduxStore?: boolean;
	proficiencies: SrdProficiencyItem[];
	abilities: AbilityItem[];
	equipments: SrdEquipmentItem[];
	magicItems: SrdEquipmentItem[];
	equipmentCategories: SrdItem[];
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
	equipments,
	magicItems,
	equipmentCategories,
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
					<Proficiencies
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
						proficiencies={proficiencies}
					/>
					<ProficiencyChoices
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
						proficiencies={proficiencies}
					/>
					<SavingThrows
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
						abilities={abilities}
					/>
					<Spellcasting
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
						abilities={abilities}
						spells={spells}
					/>
					<Levels
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
					/>
					<StartingEuipment
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
						equipments={equipments}
						equipmentCategories={equipmentCategories}
						magicItems={magicItems}
					/>
					<StartingEquipmentChoices
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
						equipments={equipments}
						equipmentCategories={equipmentCategories}
						magicItems={magicItems}
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
						{`${shouldUseReduxStore ? 'Create' : 'Edit'} Class`}
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default ClassForm;
