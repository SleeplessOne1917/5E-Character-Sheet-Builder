'use client';

import { AbilityItem, SrdItem } from '../../../types/srd';
import Button, { ButtonType } from '../../Button/Button';
import {
	EditingSubraceState,
	removeAbilityBonus,
	setLanguages
} from '../../../redux/features/editingSubrace';
import { Formik, useFormikContext } from 'formik';
import { useCallback, useEffect, useState } from 'react';

import Abilities from './Abilities/Abilities';
import { Item } from '../../../types/db/item';
import Languages from './Languages/Languages';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import NameRaceAndOverrides from './NameRaceAndOverrides/NameRaceAndOverrides';
import { Race } from '../../../types/characterSheetBuilderAPI';
import SizeAndSpeed from './SizeAndSpeed/SizeAndSpeed';
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
	languages
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
			{({ isSubmitting, handleSubmit, errors }) => (
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
						</>
					)}
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
