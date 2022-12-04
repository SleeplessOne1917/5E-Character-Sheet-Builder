'use client';

import { AbilityItem, SrdItem, SrdProficiencyItem } from '../../../types/srd';
import Button, { ButtonType } from '../../Button/Button';
import {
	EditingSubraceState,
	removeAbilityBonus,
	removeOmittedRaceTraits,
	setLanguages
} from '../../../redux/features/editingSubrace';
import { Formik, useFormikContext } from 'formik';
import { Race, SpellItem } from '../../../types/characterSheetBuilderAPI';
import { useCallback, useEffect, useState } from 'react';

import Abilities from './Abilities/Abilities';
import IncludeOmitTraits from './IncludeOmitTraits/IncludeOmitTraits';
import { Item } from '../../../types/db/item';
import Languages from './Languages/Languages';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import NameRaceAndOverrides from './NameRaceAndOverrides/NameRaceAndOverrides';
import SizeAndSpeed from './SizeAndSpeed/SizeAndSpeed';
import Traits from './Traits/Traits';
import classes from './SubraceForm.module.css';
import subraceSchema from '../../../yup-schemas/subraceSchema';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import useGetRace from '../../../hooks/useGetRace';

type SubraceFormProps = {
	initialValues: EditingSubraceState;
	shouldUseReduxStore?: boolean;
	races: Item[];
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
};

type RaceResetterProps = {
	race?: Race;
	shouldUseReduxStore: boolean;
};

const RaceResetter = ({ race, shouldUseReduxStore }: RaceResetterProps) => {
	const { values, setFieldValue } = useFormikContext<EditingSubraceState>();
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (race) {
			if (!values.overrides?.abilityBonuses) {
				values.abilityBonuses?.forEach((abilityBonus, index) => {
					if (
						race.abilityBonuses.some(
							ab => ab.abilityScore.id === abilityBonus.abilityScore?.id
						)
					) {
						if (shouldUseReduxStore) {
							dispatch(removeAbilityBonus(index));
						}

						setFieldValue(
							'abilityBonuses',
							values.abilityBonuses?.filter((ab, i) => i !== index)
						);
					}
				});
			}

			if (!values.overrides?.languages) {
				values.languages?.forEach(language => {
					if (race.languages.some(l => l.id === language.id)) {
						const newLanguages = values.languages?.filter(
							l => l.id !== language.id
						);

						if (shouldUseReduxStore) {
							dispatch(setLanguages(newLanguages));
						}

						setFieldValue('languages', newLanguages, false);
					}
				});
			}

			if (shouldUseReduxStore) {
				dispatch(removeOmittedRaceTraits());
			}

			setFieldValue('omittedRaceTraits', undefined, false);
		}
	}, [
		race,
		dispatch,
		setFieldValue,
		values.abilityBonuses,
		shouldUseReduxStore,
		values.overrides?.abilityBonuses,
		values.languages,
		values.overrides?.languages
	]);

	return <></>;
};

const SubraceForm = ({
	initialValues,
	shouldUseReduxStore = false,
	races,
	abilities,
	languages,
	proficiencies,
	spells
}: SubraceFormProps) => {
	const [clickedSubmit, setClickedSubmit] = useState(false);
	const [raceId, setRaceId] = useState<string | undefined>(
		initialValues.race?.id
	);
	const raceResult = useGetRace(raceId);

	const handleRaceChange = useCallback((id?: string) => {
		setRaceId(id);
	}, []);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={(val, { resetForm }) => {
				resetForm();
			}}
			validationSchema={subraceSchema}
		>
			{({ isSubmitting, handleSubmit }) => (
				<form className={classes.form} onSubmit={handleSubmit}>
					<RaceResetter
						race={raceResult.race}
						shouldUseReduxStore={shouldUseReduxStore}
					/>
					<NameRaceAndOverrides
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
						races={races}
						onRaceChange={handleRaceChange}
						race={raceResult.race}
					/>
					<SizeAndSpeed
						clickedSubmit={clickedSubmit}
						shouldUseReduxStore={shouldUseReduxStore}
					/>
					{raceResult.fetching && !(raceResult.race || raceResult.error) && (
						<LoadingSpinner />
					)}
					{raceResult.race && (
						<>
							<Abilities
								abilities={abilities}
								clickedSubmit={clickedSubmit}
								shouldUseReduxStore={shouldUseReduxStore}
								race={raceResult.race}
							/>
							<Languages
								clickedSubmit={clickedSubmit}
								shouldUseReduxStore={shouldUseReduxStore}
								race={raceResult.race}
								languages={languages}
							/>
							{raceResult.race.traits && raceResult.race.traits.length > 0 && (
								<IncludeOmitTraits
									race={raceResult.race}
									shouldUseReduxStore={shouldUseReduxStore}
								/>
							)}
						</>
					)}
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
						{`${shouldUseReduxStore ? 'Create' : 'Edit'} Subrace`}
					</Button>
				</form>
			)}
		</Formik>
	);
};

export default SubraceForm;
