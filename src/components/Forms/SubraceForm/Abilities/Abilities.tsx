import BaseAbilities, {
	AbilitiesReduxFunctions
} from '../../BaseAbilities/BaseAbilities';
import {
	EditingSubraceState,
	addAbilityBonus,
	addAbilityBonusOptions,
	removeAbilityBonus,
	removeAbilityBonusOptions,
	setAbilityBonusAbilityScore,
	setAbilityBonusBonus,
	setAbilityBonusOptionsBonus,
	setAbilityBonusOptionsNumberOfAbilityScores
} from '../../../../redux/features/editingSubrace';

import { AbilityItem } from '../../../../types/srd';
import { Race } from '../../../../types/characterSheetBuilderAPI';
import { useFormikContext } from 'formik';
import { useMemo } from 'react';

type AbilitiesProps = {
	clickedSubmit: boolean;
	shouldUseReduxStore: boolean;
	abilities: AbilityItem[];
	race: Race;
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
	abilities,
	shouldUseReduxStore,
	clickedSubmit,
	race
}: AbilitiesProps) => {
	const { values } = useFormikContext<EditingSubraceState>();
	const availableAbilities = useMemo(
		() =>
			values.overrides?.abilityBonuses
				? abilities
				: abilities.filter(
						ability =>
							!race.abilityBonuses.some(
								ab => ab.abilityScore.id === ability.index
							)
				  ),
		[abilities, values.overrides?.abilityBonuses, race.abilityBonuses]
	);

	const showAbilityBonusOptions = useMemo(
		() => !!values.overrides?.abilityBonusOptions || !race.abilityBonusOptions,
		[values.overrides?.abilityBonusOptions, race.abilityBonusOptions]
	);

	const shouldErrorIfEmpty = useMemo(
		() => values.overrides?.abilityBonuses && showAbilityBonusOptions,
		[values.overrides?.abilityBonuses, showAbilityBonusOptions]
	);

	return (
		<BaseAbilities
			abilities={availableAbilities}
			clickedSubmit={clickedSubmit}
			shouldUseReduxStore={shouldUseReduxStore}
			reduxFunctions={reduxFunctions}
			shouldErrorIfEmpty={shouldErrorIfEmpty}
			showAbilityBonusOptions={showAbilityBonusOptions}
		/>
	);
};

export default Abilities;
