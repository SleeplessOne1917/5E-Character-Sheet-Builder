'use client';

import { AbilityItem, SrdItem } from '../../../types/srd';
import Button, { ButtonType } from '../../Button/Button';
import { DeepPartial, PartialBy } from '../../../types/helpers';
import { Formik, FormikHelpers } from 'formik';
import {
	addSummon,
	deleteSummon,
	setSummonProperties
} from '../../../redux/features/editingSpell';

import CastingTimeDurationRange from './CastingTimeDurationRange/CastingTimeDurationRange';
import ClassesDamageType from './ClassesDamageType/ClassesDamageType';
import ComponentsSchoolRitualConcentration from './ComponentsSchoolRitualConcentration/ComponentsSchoolRitualConcentration';
import DescriptionHigherLevels from './DescriptionHigherLevels/DescriptionHigherLevels';
import NameAndLevel from './NameAndLevel/NameAndLevel';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import { Summon } from '../../../types/summon';
import Summons from '../Summons/Summons/Summons';
import classes from './SpellForm.module.css';
import { doNothing } from '../../../redux/features/editingCharacter';
import spellSchema from '../../../yup-schemas/spellSchema';

type SpellFormProps = {
	damageTypes: SrdItem[];
	magicSchools: SrdItem[];
	abilities: AbilityItem[];
	srdClasses: SrdItem[];
	shouldUseReduxStore: boolean;
	initialValues: PartialBy<Spell, 'id'>;
	onSubmit: (
		values: PartialBy<Spell, 'id'>,
		helpers: FormikHelpers<PartialBy<Spell, 'id'>>
	) => Promise<void>;
};

const SpellForm = ({
	abilities,
	initialValues,
	onSubmit,
	magicSchools,
	srdClasses,
	damageTypes,
	shouldUseReduxStore
}: SpellFormProps) => {
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={spellSchema}
		>
			{({ handleSubmit, isSubmitting }) => (
				<form onSubmit={handleSubmit} className={classes.form}>
					<NameAndLevel shouldUseReduxStore={shouldUseReduxStore} />
					<CastingTimeDurationRange shouldUseReduxStore={shouldUseReduxStore} />
					<ComponentsSchoolRitualConcentration
						shouldUseReduxStore={shouldUseReduxStore}
						magicSchools={magicSchools}
					/>
					<ClassesDamageType
						shouldUseReduxStore={shouldUseReduxStore}
						damageTypes={damageTypes}
						srdClasses={srdClasses}
					/>
					<Summons
						actions={
							shouldUseReduxStore
								? {
										add: () => addSummon(),
										set: setSummonProperties,
										delete: deleteSummon
								  }
								: {
										add: doNothing,
										set: (_: {
											index: number;
											overrideProps: DeepPartial<Summon>;
										}) => doNothing,
										delete: (_: number) => doNothing
								  }
						}
						abilities={abilities}
					/>
					<DescriptionHigherLevels shouldUseReduxStore={shouldUseReduxStore} />
					<Button
						positive
						type={ButtonType.submit}
						disabled={isSubmitting}
						size="large"
						style={{ marginTop: '3rem' }}
					>
						{`${shouldUseReduxStore ? 'Create' : 'Edit'} Spell`}
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default SpellForm;
