import {
	calculateModifier,
	getTotalScore
} from '../../../../services/abilityScoreService';
import { useEffect, useMemo, useState } from 'react';

import { AbilityScore } from '../../../../redux/features/abilityScores';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../../../components/MainContent/MainContent';
import styles from './Spells.module.css';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import { useRouter } from 'next/router';

const Spells = () => {
	const classInfo = useAppSelector(state => state.editingCharacter.classInfo);
	const spellcasting = useAppSelector(
		state => state.editingCharacter.spellcasting
	);
	const abilityScores = useAppSelector(
		state => state.editingCharacter.abilityScores
	);
	const [isLoading, setIsLoading] = useState(true);

	const shouldPrepareSpells = useMemo(
		() => spellcasting.spellsKnown === 0,
		[spellcasting.spellsKnown]
	);

	const router = useRouter();

	useEffect(() => {
		if (
			!classInfo.class?.spellcasting ||
			classInfo.level < classInfo.class.spellcasting.level
		) {
			router.back();
		} else {
			setIsLoading(false);
		}
	}, [router, classInfo.class?.spellcasting, classInfo.level, setIsLoading]);

	const numberOfSpellsToPrepare = useMemo(() => {
		if (!shouldPrepareSpells || isLoading) {
			return 0;
		}

		const spellcastingAbility = (
			abilityScores as { [key: string]: AbilityScore }
		)[classInfo.class?.spellcasting?.spellcasting_ability.index as string];

		const modifier = spellcastingAbility.base
			? calculateModifier(getTotalScore(spellcastingAbility))
			: 0;

		const returnValue =
			modifier + classInfo.level / (classInfo.class?.spellcasting?.level ?? 1);

		return returnValue < 1 ? 1 : returnValue;
	}, [
		abilityScores,
		classInfo.class?.spellcasting,
		classInfo.level,
		shouldPrepareSpells,
		isLoading
	]);

	return (
		<MainContent>
			{isLoading ? (
				<div className={styles['loading-container']}>
					<LoadingSpinner />
				</div>
			) : shouldPrepareSpells ? (
				<div>Prepare {numberOfSpellsToPrepare} spells</div>
			) : (
				<div>Select {spellcasting.spellsKnown} spells</div>
			)}
		</MainContent>
	);
};

export default Spells;
