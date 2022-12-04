'use client';

import GenericTraits, { TraitsReduxActions } from '../../Traits/GenericTraits';
import {
	addTrait,
	removeTrait
} from '../../../../redux/features/editingSubrace';

import { SpellItem } from '../../../../types/characterSheetBuilderAPI';
import { SrdProficiencyItem } from '../../../../types/srd';
import Trait from './Trait';
import { TraitValues } from '../../Traits/Trait/BaseTrait/BaseTrait';

type TraitsProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
	proficiencies: SrdProficiencyItem[];
	spells: SpellItem[];
	initialValues: TraitValues;
};

const reduxActions: TraitsReduxActions = {
	addTrait,
	removeTrait
};

const Traits = ({
	clickedSubmit,
	initialValues,
	proficiencies,
	shouldUseReduxStore,
	spells
}: TraitsProps) => (
	<GenericTraits
		TraitComponent={Trait}
		clickedSubmit={clickedSubmit}
		initialValues={initialValues}
		proficiencies={proficiencies}
		shouldUseReduxStore={shouldUseReduxStore}
		spells={spells}
		reduxActions={reduxActions}
	/>
);

export default Traits;
