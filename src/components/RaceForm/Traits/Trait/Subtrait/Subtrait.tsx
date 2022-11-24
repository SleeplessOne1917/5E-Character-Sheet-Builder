import BaseTrait, { ReduxActions } from '../BaseTrait/BaseTrait';
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { ProficiencyType, SrdProficiencyItem } from '../../../../../types/srd';
import { Race, SpellItem } from '../../../../../types/characterSheetBuilderAPI';
import {
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
} from '../../../../../redux/features/editingRace';

import Trait from '../../../../../types/trait';
import { useMemo } from 'react';

type SubtraitProps = {
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
};

const Subtrait = ({
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
	spells
}: SubtraitProps) => {
	const { errors, touched } = useFormikContext<Omit<Race, 'id'>>();

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
					subtraitOptions: { options: TraitState[] };
				}>
			).subtraitOptions &&
			(
				errors.traits[parentIndex] as FormikErrors<{
					subtraitOptions: { options: TraitState[] };
				}>
			).subtraitOptions?.options
				? (
						(
							errors.traits[parentIndex] as Required<
								FormikErrors<{
									subtraitOptions: { options: TraitState[] };
								}>
							>
						).subtraitOptions.options as FormikErrors<TraitState[]>
				  )[index]
				: undefined,
		[errors.traits, parentIndex, index]
	);

	const reduxActions: ReduxActions = useMemo(
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
		[parentIndex, index]
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

export default Subtrait;
