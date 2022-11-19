import { AbilityItem, SrdItem, SrdProficiencyItem } from '../../types/srd';
import Button, { ButtonType } from '../Button/Button';
import { Formik, FormikHelpers } from 'formik';

import Abilities from './Abilities/Abilities';
import { EditingRaceState } from '../../redux/features/editingRace';
import Languages from './Languages/Languages';
import NameSizeSpeed from './NameSizeSpeed/NameSizseSpeed';
import { SpellItem } from '../../types/characterSheetBuilderAPI';
import Traits from './Traits/Traits';
import classes from './RaceForm.module.css';
import raceSchema from '../../yup-schemas/raceSchema';
import { useState } from 'react';

type RaceFormProps = {
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	shouldUseReduxStore: boolean;
	initialValues: EditingRaceState;
	handleFormikSubmit: (
		values: EditingRaceState,
		helpers: FormikHelpers<EditingRaceState>
	) => Promise<void>;
	spells: SpellItem[];
};

const RaceForm = ({
	abilities,
	languages,
	proficiencies,
	shouldUseReduxStore,
	initialValues,
	spells,
	handleFormikSubmit
}: RaceFormProps) => {
	const [clickedSubmit, setClickedSubmit] = useState(false);

	return (
		<Formik
			onSubmit={handleFormikSubmit}
			initialValues={initialValues}
			validationSchema={raceSchema}
		>
			{({ handleSubmit, isSubmitting }) => (
				<form onSubmit={handleSubmit} className={classes.form}>
					<NameSizeSpeed
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
					/>
					<Abilities
						abilities={abilities}
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
					/>
					<Languages
						languages={languages}
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
					/>
					<Traits
						clickedSubmit={clickedSubmit}
						initialValues={initialValues}
						proficiencies={proficiencies}
						shouldUseReduxStore={shouldUseReduxStore}
						spells={spells}
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

export default RaceForm;
