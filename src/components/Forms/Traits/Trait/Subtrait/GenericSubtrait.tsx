'use client';

import BaseTrait, { TraitActions, TraitValues } from '../BaseTrait/BaseTrait';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { ProficiencyType, SrdProficiencyItem } from '../../../../../types/srd';

import { Item } from '../../../../../types/db/item';
import { PayloadAction } from '@reduxjs/toolkit';
import { SpellItem } from '../../../../../types/characterSheetBuilderAPI';
import Trait from '../../../../../types/trait';
import { useMemo } from 'react';

type ActionCreatorType<
	T extends Record<string, any> = Record<string, unknown>
> = (
	val: {
		parentIndex: number;
		index: number;
	} & T
) => PayloadAction<{ parentIndex: number; index: number } & T>;

export type SubtraitReduxActions = {
	addSubtraitHPBonus: ActionCreatorType;
	addSubtraitProficiencies: ActionCreatorType;
	addSubtraitProficiencyOptions: ActionCreatorType;
	addSubtraitSpellOptions: ActionCreatorType;
	addSubtraitSpells: ActionCreatorType;
	removeSubtraitHPBonus: ActionCreatorType;
	removeSubtraitProficiencies: ActionCreatorType;
	removeSubtraitProficiencyOptions: ActionCreatorType;
	removeSubtraitSpellOptions: ActionCreatorType;
	removeSubtraitSpells: ActionCreatorType;
	setSubtraitDescription: ActionCreatorType<{ description: string }>;
	setSubtraitHPBonus: ActionCreatorType<{ hpBonus: number | null }>;
	setSubtraitName: ActionCreatorType<{ name: string }>;
	setSubtraitProficiencies: ActionCreatorType<{ proficiencies: Item[] }>;
	setSubtraitProficiencyOptionsChoose: ActionCreatorType<{ choose?: number }>;
	setSubtraitProficiencyOptionsOptions: ActionCreatorType<{ options?: Item[] }>;
	setSubtraitSpellOptionsChoose: ActionCreatorType<{ choose?: number }>;
	setSubtraitSpellOptionsOptions: ActionCreatorType<{ options?: Item[] }>;
	setSubtraitSpells: ActionCreatorType<{ spells: Item[] }>;
};

export type GenericSubtraitProps = {
	onRemove: () => void;
	parentIndex: number;
	index: number;
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	subtrait: Trait;
	selectedProficienciesType: ProficiencyType | null;
	setSelectedProficienciesType: (value: ProficiencyType | null) => void;
	selectedProficiencyOptionsType: ProficiencyType | null;
	setSelectedProficiencyOptionsType: (value: ProficiencyType | null) => void;
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
	reduxActions: SubtraitReduxActions;
};

const GenericSubtrait = ({
	onRemove,
	parentIndex,
	index,
	shouldUseReduxStore,
	clickedSubmit,
	subtrait,
	selectedProficienciesType,
	setSelectedProficienciesType,
	selectedProficiencyOptionsType,
	setSelectedProficiencyOptionsType,
	proficiencies,
	spells,
	reduxActions: {
		addSubtraitHPBonus,
		addSubtraitProficiencies,
		addSubtraitProficiencyOptions,
		addSubtraitSpellOptions,
		addSubtraitSpells,
		removeSubtraitHPBonus,
		removeSubtraitProficiencies,
		removeSubtraitProficiencyOptions,
		removeSubtraitSpellOptions,
		removeSubtraitSpells,
		setSubtraitDescription,
		setSubtraitHPBonus,
		setSubtraitName,
		setSubtraitProficiencies,
		setSubtraitProficiencyOptionsChoose,
		setSubtraitProficiencyOptionsOptions,
		setSubtraitSpellOptionsChoose,
		setSubtraitSpellOptionsOptions,
		setSubtraitSpells
	}
}: GenericSubtraitProps) => {
	const { errors, touched } = useFormikContext<TraitValues>();

	const baseStr = useMemo(
		() => `traits.${parentIndex}.subtraitOptions.options.${index}`,
		[parentIndex, index]
	);

	const baseTouch = useMemo(
		() =>
			clickedSubmit ||
			(touched.traits &&
				(typeof touched.traits === 'boolean'
					? touched.traits
					: (touched.traits as FormikTouched<Trait>[])[parentIndex] &&
					  (touched.traits as FormikTouched<Trait>[])[parentIndex]
							.subtraitOptions &&
					  (
							(touched.traits as FormikTouched<Trait>[])[parentIndex]
								.subtraitOptions as unknown as Required<
								FormikTouched<{
									options: Trait[];
								}>
							>
					  ).options &&
					  (
							(touched.traits as FormikTouched<Trait>[])[parentIndex]
								.subtraitOptions as unknown as Required<
								FormikTouched<{
									options: Trait[];
								}>
							>
					  ).options[index])),
		[parentIndex, index, touched.traits, clickedSubmit]
	);

	const baseError = useMemo(
		() =>
			errors.traits &&
			errors.traits[parentIndex] &&
			(
				errors.traits[parentIndex] as FormikErrors<{
					subtraitOptions: { options: Trait[] };
				}>
			).subtraitOptions &&
			(
				errors.traits[parentIndex] as FormikErrors<{
					subtraitOptions: { options: Trait[] };
				}>
			).subtraitOptions?.options
				? (
						(
							(
								(
									errors as Required<
										FormikErrors<{
											traits: { subtraitOptions: { options: Trait[] } }[];
										}>
									>
								).traits[parentIndex] as FormikErrors<{
									subtraitOptions: { options: Trait[] };
								}>
							).subtraitOptions as FormikErrors<{
								options: Trait[];
							}>
						).options as FormikErrors<Trait[]>
				  )[index]
				: undefined,
		[errors, parentIndex, index]
	);

	const reduxActions: TraitActions = useMemo(
		() => ({
			addHPBonus: () => addSubtraitHPBonus({ parentIndex, index }),
			addProficiencies: () => addSubtraitProficiencies({ parentIndex, index }),
			addProficiencyOptions: () =>
				addSubtraitProficiencyOptions({ parentIndex, index }),
			addSpellOptions: () => addSubtraitSpellOptions({ parentIndex, index }),
			addSpells: () => addSubtraitSpells({ parentIndex, index }),
			removeHPBonus: () => removeSubtraitHPBonus({ parentIndex, index }),
			removeProficiencies: () =>
				removeSubtraitProficiencies({ parentIndex, index }),
			removeProficiencyOptions: () =>
				removeSubtraitProficiencyOptions({ parentIndex, index }),
			removeSpellOptions: () =>
				removeSubtraitSpellOptions({ parentIndex, index }),
			removeSpells: () => removeSubtraitSpells({ parentIndex, index }),
			setDescription: description =>
				setSubtraitDescription({ parentIndex, index, description }),
			setHPBonus: hpBonus =>
				setSubtraitHPBonus({ parentIndex, index, hpBonus }),
			setName: name => setSubtraitName({ parentIndex, index, name }),
			setProficiencies: profs =>
				setSubtraitProficiencies({ parentIndex, index, proficiencies: profs }),
			setProficiencyOptionsChoose: choose =>
				setSubtraitProficiencyOptionsChoose({ parentIndex, index, choose }),
			setProficiencyOptionsOptions: options =>
				setSubtraitProficiencyOptionsOptions({ parentIndex, index, options }),
			setSpellOptionsChoose: choose =>
				setSubtraitSpellOptionsChoose({ parentIndex, index, choose }),
			setSpellOptionsOptions: options =>
				setSubtraitSpellOptionsOptions({ parentIndex, index, options }),
			setSpells: spells => setSubtraitSpells({ parentIndex, index, spells })
		}),
		[
			parentIndex,
			index,
			addSubtraitHPBonus,
			addSubtraitProficiencies,
			addSubtraitProficiencyOptions,
			addSubtraitSpellOptions,
			addSubtraitSpells,
			removeSubtraitHPBonus,
			removeSubtraitProficiencies,
			removeSubtraitProficiencyOptions,
			removeSubtraitSpellOptions,
			removeSubtraitSpells,
			setSubtraitDescription,
			setSubtraitHPBonus,
			setSubtraitName,
			setSubtraitProficiencies,
			setSubtraitProficiencyOptionsChoose,
			setSubtraitProficiencyOptionsOptions,
			setSubtraitSpellOptionsChoose,
			setSubtraitSpellOptionsOptions,
			setSubtraitSpells
		]
	);

	return (
		<BaseTrait
			baseError={baseError}
			baseStr={baseStr}
			baseTouch={baseTouch}
			onRemove={onRemove}
			proficiencies={proficiencies}
			selectedProficienciesType={selectedProficienciesType}
			selectedProficiencyOptionsType={selectedProficiencyOptionsType}
			setSelectedProficienciesType={setSelectedProficienciesType}
			setSelectedProficiencyOptionsType={setSelectedProficiencyOptionsType}
			shouldUseReduxStore={shouldUseReduxStore}
			spells={spells}
			trait={subtrait}
			style={{ backgroundColor: 'var(--highlight-light)' }}
			reduxActions={reduxActions}
			clickedSubmit={clickedSubmit}
			index={index}
		/>
	);
};

export default GenericSubtrait;
