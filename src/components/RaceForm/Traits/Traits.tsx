import {
	EditingRaceState,
	addTrait,
	removeTrait
} from '../../../redux/features/editingRace';
import { ProficiencyType, SrdProficiencyItem } from '../../../types/srd';
import { Race, SpellItem } from '../../../types/characterSheetBuilderAPI';
import { useCallback, useState } from 'react';

import Button from '../../Button/Button';
import { Item } from '../../../types/db/item';
import { PartialBy } from '../../../types/helpers';
import Trait from './Trait/Trait';
import classes from './Traits.module.css';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';

type TraitsProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
	initialValues: PartialBy<Race, 'id'>;
};

const Traits = ({
	shouldUseReduxStore,
	proficiencies,
	clickedSubmit,
	initialValues,
	spells
}: TraitsProps) => {
	const [proficienciesSelectedTypes, setProficienciesSelectedTypes] = useState(
		initialValues.traits?.map(trait =>
			trait.proficiencies && trait.proficiencies.length > 0
				? proficiencies.find(
						prof => prof.index === (trait.proficiencies as Item[])[0].id
				  )?.type ?? null
				: null
		)
	);
	const [proficiencyOptionsSelectedTypes, setProficiencyOptionsSelectedTypes] =
		useState(
			initialValues.traits?.map(trait =>
				trait.proficiencyOptions && trait.proficiencyOptions.options.length > 0
					? proficiencies.find(
							prof =>
								prof.index ===
								(trait.proficiencyOptions?.options as Item[])[0].id
					  )?.type ?? null
					: null
			)
		);
	const { values, setFieldValue } = useFormikContext<EditingRaceState>();

	const dispatch = useAppDispatch();

	const handleAddTrait = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addTrait());
		}

		setProficienciesSelectedTypes(prev => [...(prev ?? []), null]);
		setProficiencyOptionsSelectedTypes(prev => [...(prev ?? []), null]);
		setFieldValue('traits', [...values.traits, {}], false);
	}, [shouldUseReduxStore, dispatch, setFieldValue, values.traits]);

	const handleRemoveTrait = useCallback(
		(index: number) => {
			if (shouldUseReduxStore) {
				dispatch(removeTrait(index));
			}

			setProficienciesSelectedTypes(prev =>
				(prev ?? []).filter((val, i) => i !== index)
			);

			setProficiencyOptionsSelectedTypes(prev =>
				(prev ?? []).filter((val, i) => i !== index)
			);

			setFieldValue(
				'traits',
				values.traits.filter((t, i) => i !== index),
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.traits]
	);

	const handleSetSelectedProficienciesType = useCallback(
		(value: ProficiencyType | null, index: number) => {
			setProficienciesSelectedTypes(prev =>
				(prev ?? []).map((v, i) => (i === index ? value : v))
			);
		},
		[]
	);

	const handleSetSelectedProficiencyOptionsType = useCallback(
		(value: ProficiencyType | null, index: number) => {
			setProficiencyOptionsSelectedTypes(prev =>
				(prev ?? []).map((v, i) => (i === index ? value : v))
			);
		},
		[]
	);

	return (
		<div className={classes['traits-container']}>
			{values.traits.map((trait, index) => (
				<Trait
					index={index}
					trait={trait}
					clickedSubmit={clickedSubmit}
					shouldUseReduxStore={shouldUseReduxStore}
					key={index}
					onRemove={() => handleRemoveTrait(index)}
					selectedProficienciesType={
						proficienciesSelectedTypes
							? proficienciesSelectedTypes[index]
							: null
					}
					selectedProficiencyOptionsType={
						proficiencyOptionsSelectedTypes
							? proficiencyOptionsSelectedTypes[index]
							: null
					}
					setSelectedProficienciesType={value =>
						handleSetSelectedProficienciesType(value, index)
					}
					setSelectedProficiencyOptionsType={value =>
						handleSetSelectedProficiencyOptionsType(value, index)
					}
					proficiencies={proficiencies}
					spells={spells}
				/>
			))}
			{values.traits.length < 10 && (
				<Button
					positive
					onClick={handleAddTrait}
					style={{ alignSelf: 'center', marginTop: '1rem' }}
				>
					Add trait
				</Button>
			)}
		</div>
	);
};

export default Traits;
