'use client';

import GenericSubtrait, {
	SubtraitReduxActions
} from '../../Traits/Trait/Subtrait/GenericSubtrait';
import { ProficiencyType, SrdProficiencyItem } from '../../../../types/srd';
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
} from '../../../../redux/features/editingRace';

import { SpellItem } from '../../../../types/characterSheetBuilderAPI';
import Trait from '../../../../types/trait';

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

const reduxActions: SubtraitReduxActions = {
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
};

const Subtrait = ({
	clickedSubmit,
	index,
	onRemove,
	parentIndex,
	proficiencies,
	selectedProficienciesType,
	selectedProficiencyOptionsType,
	setSelectedProficienciesType,
	setSelectedProficiencyOptionsType,
	shouldUseReduxStore,
	spells,
	subtrait
}: SubtraitProps) => (
	<GenericSubtrait
		clickedSubmit={clickedSubmit}
		index={index}
		onRemove={onRemove}
		parentIndex={parentIndex}
		proficiencies={proficiencies}
		reduxActions={reduxActions}
		selectedProficienciesType={selectedProficienciesType}
		selectedProficiencyOptionsType={selectedProficiencyOptionsType}
		setSelectedProficienciesType={setSelectedProficienciesType}
		setSelectedProficiencyOptionsType={setSelectedProficiencyOptionsType}
		shouldUseReduxStore={shouldUseReduxStore}
		spells={spells}
		subtrait={subtrait}
	/>
);

export default Subtrait;
