import GenericTrait, {
	SubtraitsReduxActions,
	TraitReduxActions
} from '../../Traits/Trait/GenericTrait';
import { ProficiencyType, SrdProficiencyItem } from '../../../../types/srd';
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
} from '../../../../redux/features/editingSubrace';

import { SpellItem } from '../../../../types/characterSheetBuilderAPI';
import Subtrait from './Subtrait';
import TraitType from '../../../../types/trait';

type TraitProps = {
	index: number;
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	trait: TraitType;
	selectedProficienciesType: ProficiencyType | null;
	setSelectedProficienciesType: (value: ProficiencyType | null) => void;
	selectedProficiencyOptionsType: ProficiencyType | null;
	setSelectedProficiencyOptionsType: (value: ProficiencyType | null) => void;
	onRemove: () => void;
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
};

const reduxActions: TraitReduxActions = {
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
};

const subtraitsReduxActions: SubtraitsReduxActions = {
	addTraitSubtrait,
	addTraitSubtraits,
	removeTraitSubtrait,
	removeTraitSubtraits,
	setTraitSubtraitOptionsChoose
};

const Trait = ({
	clickedSubmit,
	index,
	onRemove,
	proficiencies,
	selectedProficienciesType,
	selectedProficiencyOptionsType,
	setSelectedProficienciesType,
	setSelectedProficiencyOptionsType,
	shouldUseReduxStore,
	spells,
	trait
}: TraitProps) => (
	<GenericTrait
		SubtraitComponent={Subtrait}
		clickedSubmit={clickedSubmit}
		index={index}
		onRemove={onRemove}
		proficiencies={proficiencies}
		reduxActions={reduxActions}
		selectedProficienciesType={selectedProficienciesType}
		selectedProficiencyOptionsType={selectedProficiencyOptionsType}
		setSelectedProficienciesType={setSelectedProficienciesType}
		setSelectedProficiencyOptionsType={setSelectedProficiencyOptionsType}
		shouldUseReduxStore={shouldUseReduxStore}
		spells={spells}
		subtraitsReduxActions={subtraitsReduxActions}
		trait={trait}
	/>
);

export default Trait;
