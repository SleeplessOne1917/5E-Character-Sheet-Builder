'use client';

import { Action, PayloadAction } from '@reduxjs/toolkit';
import { ProficiencyType, SrdProficiencyItem } from '../../../types/srd';
import { useCallback, useState } from 'react';

import Button from '../../Button/Button';
import { EditingSubraceState } from '../../../redux/features/editingSubrace';
import { GenericTraitProps } from './Trait/GenericTrait';
import { Item } from '../../../types/db/item';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import Trait from '../../../types/trait';
import { TraitValues } from './Trait/BaseTrait/BaseTrait';
import classes from './GenericTraits.module.css';
import { useAppDispatch } from '../../../hooks/reduxHooks';
import { useFormikContext } from 'formik';
import { v4 as uuidv4 } from 'uuid';

export type TraitsReduxActions = {
	addTrait: () => Action;
	removeTrait: (index: number) => PayloadAction<number>;
};

type GenericTraitsProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
	initialValues: TraitValues;
	TraitComponent: (
		props: Omit<
			GenericTraitProps,
			'reduxActions' | 'subtraitsReduxActions' | 'SubtraitComponent'
		>
	) => JSX.Element;
	reduxActions: TraitsReduxActions;
};

const GenericTraits = ({
	shouldUseReduxStore,
	proficiencies,
	clickedSubmit,
	initialValues,
	spells,
	TraitComponent,
	reduxActions: { addTrait, removeTrait }
}: GenericTraitsProps) => {
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
				trait.proficiencyOptions &&
				(trait.proficiencyOptions.options?.length ?? 0) > 0
					? proficiencies.find(
							prof =>
								prof.index ===
								(trait.proficiencyOptions?.options as Item[])[0].id
					  )?.type ?? null
					: null
			)
		);
	const { values, setFieldValue } = useFormikContext<EditingSubraceState>();

	const dispatch = useAppDispatch();

	const handleAddTrait = useCallback(() => {
		if (shouldUseReduxStore) {
			dispatch(addTrait());
		}

		setProficienciesSelectedTypes(prev => [...(prev ?? []), null]);
		setProficiencyOptionsSelectedTypes(prev => [...(prev ?? []), null]);
		setFieldValue(
			'traits',
			[...(values.traits ?? []), { uuid: uuidv4() }],
			false
		);
	}, [shouldUseReduxStore, dispatch, setFieldValue, values.traits, addTrait]);

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
				(values.traits ?? []).filter((t, i) => i !== index),
				false
			);
		},
		[shouldUseReduxStore, dispatch, setFieldValue, values.traits, removeTrait]
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
			{(values.traits ?? []).map((trait, index) => (
				<TraitComponent
					index={index}
					trait={trait as Trait}
					clickedSubmit={clickedSubmit}
					shouldUseReduxStore={shouldUseReduxStore}
					key={trait.uuid}
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
			{(values.traits ?? []).length < 10 && (
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

export default GenericTraits;
