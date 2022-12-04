'use client';

import BaseAbilities, {
	AbilitiesReduxFunctions
} from '../../BaseAbilities/BaseAbilities';
import {
	addAbilityBonus,
	addAbilityBonusOptions,
	removeAbilityBonus,
	removeAbilityBonusOptions,
	setAbilityBonusAbilityScore,
	setAbilityBonusBonus,
	setAbilityBonusOptionsBonus,
	setAbilityBonusOptionsNumberOfAbilityScores
} from '../../../../redux/features/editingRace';

import { AbilityItem } from '../../../../types/srd';

type AbilitiesProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	abilities: AbilityItem[];
};

const reduxFunctions: AbilitiesReduxFunctions = {
	addAbilityBonus,
	addAbilityBonusOptions,
	removeAbilityBonus,
	removeAbilityBonusOptions,
	setAbilityBonusAbilityScore,
	setAbilityBonusBonus,
	setAbilityBonusOptionsBonus,
	setAbilityBonusOptionsNumberOfAbilityScores
};

const Abilities = ({
	clickedSubmit,
	shouldUseReduxStore,
	abilities
}: AbilitiesProps) => (
	<BaseAbilities
		abilities={abilities}
		clickedSubmit={clickedSubmit}
		shouldUseReduxStore={shouldUseReduxStore}
		reduxFunctions={reduxFunctions}
	/>
);

export default Abilities;
