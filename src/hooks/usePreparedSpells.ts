import { useMemo, useCallback } from 'react';
import { AbilityScore } from '../redux/features/abilityScores';
import {
	calculateModifier,
	getTotalScore
} from '../services/abilityScoreService';
import { useAppSelector } from './reduxHooks';
const usePreparedSpells = () => {
	const classInfo = useAppSelector(state => state.editingCharacter.classInfo);
	const spellsKnown = useAppSelector(
		state => state.editingCharacter.spellcasting.spellsKnown
	);

	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);

	const shouldPrepareSpells = useMemo(
		() =>
			spellsKnown === 0 &&
			classInfo.class?.spellcasting &&
			classInfo.level >= classInfo.class.spellcasting.level,
		[spellsKnown, classInfo.class?.spellcasting, classInfo.level]
	);

	const getNumberOfSpellsToPrepare = useCallback(
		(
			{
				level = classInfo.level,
				abilityScore = shouldPrepareSpells
					? (abilityScores as { [key: string]: AbilityScore })[
							classInfo.class?.spellcasting?.spellcasting_ability
								.index as string
					  ]
					: { abilityImprovement: 0, highest: 20 }
			} = {
				level: classInfo.level,
				abilityScore: shouldPrepareSpells
					? (abilityScores as { [key: string]: AbilityScore })[
							classInfo.class?.spellcasting?.spellcasting_ability
								.index as string
					  ]
					: { abilityImprovement: 0, highest: 20 }
			}
		) => {
			if (!shouldPrepareSpells) {
				return 0;
			}

			const spellcastingAbility = (
				abilityScores as { [key: string]: AbilityScore }
			)[classInfo.class?.spellcasting?.spellcasting_ability.index as string];

			const modifier = spellcastingAbility.base
				? calculateModifier(getTotalScore(abilityScore))
				: 0;

			const returnValue =
				modifier +
				Math.floor(level / (classInfo.class?.spellcasting?.level ?? 1));

			return returnValue < 1 ? 1 : returnValue;
		},
		[
			abilityScores,
			classInfo.class?.spellcasting,
			classInfo.level,
			shouldPrepareSpells
		]
	);

	return {
		shouldPrepareSpells,
		numberOfSpellsToPrepare: getNumberOfSpellsToPrepare(),
		getNumberOfSpellsToPrepare
	};
};

export default usePreparedSpells;
