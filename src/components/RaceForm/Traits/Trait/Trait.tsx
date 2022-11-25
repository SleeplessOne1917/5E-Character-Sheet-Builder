'use client';

import BaseTrait, {
	ReduxActions,
	SubtraitReduxActions
} from './BaseTrait/BaseTrait';
import { useMemo } from 'react';
import {
	addTraitHPBonus,
	addTraitProficiencies,
	addTraitProficiencyOptions,
	addTraitSpellOptions,
	addTraitSpells,
	addTraitSubtrait,
	addTraitSubtraits,
	removeTraitHPBonus,
	removeTraitProficiencies,
	removeTraitProficiencyOptions,
	removeTraitSpellOptions,
	removeTraitSpells,
	removeTraitSubtrait,
	removeTraitSubtraits,
	setTraitDescription,
	setTraitHPBonus,
	setTraitName,
	setTraitProficiencies,
	setTraitProficiencyOptionsChoose,
	setTraitProficiencyOptionsOptions,
	setTraitSpellOptionsChoose,
	setTraitSpellOptionsOptions,
	setTraitSpells,
	setTraitSubtraitOptionsChoose
} from '../../../../redux/features/editingRace';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { ProficiencyType, SrdProficiencyItem } from '../../../../types/srd';

import { Race, SpellItem } from '../../../../types/characterSheetBuilderAPI';
import Trait from '../../../../types/trait';

type TraitProps = {
	index: number;
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	trait: Trait;
	selectedProficienciesType: ProficiencyType | null;
	setSelectedProficienciesType: (value: ProficiencyType | null) => void;
	selectedProficiencyOptionsType: ProficiencyType | null;
	setSelectedProficiencyOptionsType: (value: ProficiencyType | null) => void;
	onRemove: () => void;
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
};

const Trait = ({
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
	spells
}: TraitProps) => {
	const { touched, errors } = useFormikContext<Omit<Race, 'id'>>();

	const baseStr = useMemo(() => `traits.${index}`, [index]);

	const baseTouch = useMemo(
		() =>
			clickedSubmit ||
			(touched.traits &&
				(typeof touched.traits === 'boolean'
					? touched.traits
					: (touched.traits as FormikTouched<Trait>[])[index])),
		[index, touched.traits, clickedSubmit]
	);

	const baseError = useMemo(
		() =>
			errors.traits ? (errors.traits[index] as FormikErrors<Trait>) : undefined,
		[errors.traits, index]
	);

	const reduxActions: ReduxActions = useMemo(
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
		[index]
	);

	const subtraitReduxActions: SubtraitReduxActions = useMemo(
		() => ({
			addSubtrait: () => addTraitSubtrait(index),
			addSubtraits: () => addTraitSubtraits(index),
			removeSubtrait: i =>
				removeTraitSubtrait({ parentIndex: index, index: i }),
			removeSubtraits: () => removeTraitSubtraits(index),
			setChoose: choose => setTraitSubtraitOptionsChoose({ index, choose })
		}),
		[index]
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
		/>
	);
};

export default Trait;
