'use client';

import BaseTrait, {
	SubtraitActions,
	TraitActions
} from './BaseTrait/BaseTrait';
import { useMemo } from 'react';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { ProficiencyType, SrdProficiencyItem } from '../../../../types/srd';

import { SpellItem } from '../../../../types/characterSheetBuilderAPI';
import GenericTrait from '../../../../types/trait';
import { EditingSubraceState } from '../../../../redux/features/editingSubrace';
import { PayloadAction } from '@reduxjs/toolkit';
import { Item } from '../../../../types/db/item';
import { GenericSubtraitProps } from './Subtrait/GenericSubtrait';

type ActionCreatorType<T extends Record<string, any> | undefined = undefined> =
	(
		val: T extends undefined ? number : { index: number } & T
	) => PayloadAction<T extends undefined ? number : { index: number } & T>;

export type TraitReduxActions = {
	addTraitHPBonus: ActionCreatorType;
	addTraitProficiencies: ActionCreatorType;
	addTraitProficiencyOptions: ActionCreatorType;
	addTraitSpellOptions: ActionCreatorType;
	addTraitSpells: ActionCreatorType;
	removeTraitHPBonus: ActionCreatorType;
	removeTraitProficiencies: ActionCreatorType;
	removeTraitProficiencyOptions: ActionCreatorType;
	removeTraitSpellOptions: ActionCreatorType;
	removeTraitSpells: ActionCreatorType;
	setTraitDescription: ActionCreatorType<{ description: string }>;
	setTraitHPBonus: ActionCreatorType<{ hpBonus: number | null }>;
	setTraitName: ActionCreatorType<{ name: string }>;
	setTraitProficiencies: ActionCreatorType<{ proficiencies: Item[] }>;
	setTraitProficiencyOptionsChoose: ActionCreatorType<{ choose?: number }>;
	setTraitProficiencyOptionsOptions: ActionCreatorType<{ options: Item[] }>;
	setTraitSpellOptionsChoose: ActionCreatorType<{ choose?: number }>;
	setTraitSpellOptionsOptions: ActionCreatorType<{ options: Item[] }>;
	setTraitSpells: ActionCreatorType<{ spells: Item[] }>;
};

export type SubtraitsReduxActions = {
	addTraitSubtrait: ActionCreatorType;
	addTraitSubtraits: ActionCreatorType;
	removeTraitSubtrait: ActionCreatorType<{ parentIndex: number }>;
	removeTraitSubtraits: ActionCreatorType;
	setTraitSubtraitOptionsChoose: ActionCreatorType<{ choose?: number }>;
};

export type GenericTraitProps = {
	index: number;
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	trait: GenericTrait;
	selectedProficienciesType: ProficiencyType | null;
	setSelectedProficienciesType: (value: ProficiencyType | null) => void;
	selectedProficiencyOptionsType: ProficiencyType | null;
	setSelectedProficiencyOptionsType: (value: ProficiencyType | null) => void;
	onRemove: () => void;
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
	reduxActions: TraitReduxActions;
	subtraitsReduxActions: SubtraitsReduxActions;
	SubtraitComponent: (
		props: Omit<GenericSubtraitProps, 'reduxActions'>
	) => JSX.Element;
};

const GenericTrait = ({
	index,
	shouldUseReduxStore,
	clickedSubmit,
	trait,
	onRemove,
	selectedProficienciesType,
	setSelectedProficienciesType,
	selectedProficiencyOptionsType,
	setSelectedProficiencyOptionsType,
	proficiencies,
	spells,
	reduxActions: {
		addTraitHPBonus,
		addTraitProficiencies,
		addTraitProficiencyOptions,
		addTraitSpellOptions,
		addTraitSpells,
		removeTraitHPBonus,
		removeTraitProficiencies,
		removeTraitProficiencyOptions,
		removeTraitSpellOptions,
		removeTraitSpells,
		setTraitDescription,
		setTraitHPBonus,
		setTraitName,
		setTraitProficiencies,
		setTraitProficiencyOptionsChoose,
		setTraitProficiencyOptionsOptions,
		setTraitSpellOptionsChoose,
		setTraitSpellOptionsOptions,
		setTraitSpells
	},
	subtraitsReduxActions: {
		addTraitSubtrait,
		addTraitSubtraits,
		removeTraitSubtrait,
		removeTraitSubtraits,
		setTraitSubtraitOptionsChoose
	},
	SubtraitComponent
}: GenericTraitProps) => {
	const { touched, errors } = useFormikContext<EditingSubraceState>();

	const baseStr = useMemo(() => `traits.${index}`, [index]);

	const baseTouch = useMemo(
		() =>
			clickedSubmit ||
			(touched.traits &&
				(typeof touched.traits === 'boolean'
					? touched.traits
					: (touched.traits as FormikTouched<GenericTrait>[])[index])),
		[index, touched.traits, clickedSubmit]
	);

	const baseError = useMemo(
		() =>
			errors.traits
				? (errors.traits[index] as FormikErrors<GenericTrait>)
				: undefined,
		[errors.traits, index]
	);

	const reduxActions: TraitActions = useMemo(
		() => ({
			addHPBonus: () => addTraitHPBonus(index),
			addProficiencies: () => addTraitProficiencies(index),
			addProficiencyOptions: () => addTraitProficiencyOptions(index),
			addSpellOptions: () => addTraitSpellOptions(index),
			addSpells: () => addTraitSpells(index),
			removeHPBonus: () => removeTraitHPBonus(index),
			removeProficiencies: () => removeTraitProficiencies(index),
			removeProficiencyOptions: () => removeTraitProficiencyOptions(index),
			removeSpellOptions: () => removeTraitSpellOptions(index),
			removeSpells: () => removeTraitSpells(index),
			setDescription: description =>
				setTraitDescription({ index, description }),
			setHPBonus: hpBonus => setTraitHPBonus({ index, hpBonus }),
			setName: name => setTraitName({ index, name }),
			setProficiencies: profs =>
				setTraitProficiencies({ index, proficiencies: profs }),
			setProficiencyOptionsChoose: choose =>
				setTraitProficiencyOptionsChoose({ index, choose }),
			setProficiencyOptionsOptions: options =>
				setTraitProficiencyOptionsOptions({ index, options }),
			setSpellOptionsChoose: choose =>
				setTraitSpellOptionsChoose({ index, choose }),
			setSpellOptionsOptions: options =>
				setTraitSpellOptionsOptions({ index, options }),
			setSpells: spells => setTraitSpells({ index, spells })
		}),
		[
			index,
			addTraitHPBonus,
			addTraitProficiencies,
			addTraitProficiencyOptions,
			addTraitSpellOptions,
			addTraitSpells,
			removeTraitHPBonus,
			removeTraitProficiencies,
			removeTraitProficiencyOptions,
			removeTraitSpellOptions,
			removeTraitSpells,
			setTraitDescription,
			setTraitHPBonus,
			setTraitName,
			setTraitProficiencies,
			setTraitProficiencyOptionsChoose,
			setTraitProficiencyOptionsOptions,
			setTraitSpellOptionsChoose,
			setTraitSpellOptionsOptions,
			setTraitSpells
		]
	);

	const subtraitReduxActions: SubtraitActions = useMemo(
		() => ({
			addSubtrait: () => addTraitSubtrait(index),
			addSubtraits: () => addTraitSubtraits(index),
			removeSubtrait: i =>
				removeTraitSubtrait({ parentIndex: index, index: i }),
			removeSubtraits: () => removeTraitSubtraits(index),
			setChoose: choose => setTraitSubtraitOptionsChoose({ index, choose })
		}),
		[
			index,
			addTraitSubtrait,
			addTraitSubtraits,
			removeTraitSubtrait,
			removeTraitSubtraits,
			setTraitSubtraitOptionsChoose
		]
	);

	return (
		<BaseTrait
			baseStr={baseStr}
			baseError={baseError}
			baseTouch={baseTouch}
			clickedSubmit={clickedSubmit}
			index={index}
			onRemove={onRemove}
			proficiencies={proficiencies}
			selectedProficienciesType={selectedProficienciesType}
			selectedProficiencyOptionsType={selectedProficiencyOptionsType}
			setSelectedProficienciesType={setSelectedProficienciesType}
			setSelectedProficiencyOptionsType={setSelectedProficiencyOptionsType}
			shouldUseReduxStore={shouldUseReduxStore}
			spells={spells}
			trait={trait}
			reduxActions={reduxActions}
			subtraitReduxActions={subtraitReduxActions}
			SubtraitComponent={SubtraitComponent}
		/>
	);
};

export default GenericTrait;
