import {
	calculateModifier,
	getTotalScore
} from '../../../../services/abilityScoreService';
import { useEffect, useMemo, useState } from 'react';

import { AbilityScore } from '../../../../redux/features/abilityScores';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../../../components/MainContent/MainContent';
import SpellsSelector from '../../../../components/character-creation/Spells/SpellsSelector/SpellsSelector';
import { SrdSpellItem } from '../../../../types/srd';
import { getSpellsByClass } from '../../../../services/spellsService';
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
	const [isFetchingSpells, setIsFetchingSpells] = useState(true);

	const shouldPrepareSpells = useMemo(
		() => spellcasting.spellsKnown === 0,
		[spellcasting.spellsKnown]
	);

	const [allClassSpells, setAllClassSpells] = useState<SrdSpellItem[]>([]);

	useEffect(() => {
		setIsFetchingSpells(true);

		if (classInfo.class) {
			getSpellsByClass(classInfo.class.index).then(result => {
				if (result.data) {
					setAllClassSpells(result.data.spells);
				}
				setIsFetchingSpells(false);
			});
		} else {
			setAllClassSpells([]);
			setIsFetchingSpells(false);
		}
	}, [classInfo.class, setAllClassSpells, setIsFetchingSpells]);

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
			) : (
				<>
					<h1 className={styles.title}>Spells</h1>
					{spellcasting.cantripsKnown > 0 && (
						<div className={styles['spells-selector-container']}>
							<h2 className={styles['spell-select-title']}>
								Select {spellcasting.cantripsKnown} Cantrip
								{spellcasting.cantripsKnown > 1 ? 's' : ''}
							</h2>
							{isFetchingSpells ? (
								<div className={styles['loading-container']}>
									<LoadingSpinner />
								</div>
							) : (
								<SpellsSelector
									spells={allClassSpells.filter(({ level }) => level === 0)}
									choose={spellcasting.cantripsKnown}
								/>
							)}
						</div>
					)}
					<div className={styles['spells-selector-container']}>
						{shouldPrepareSpells ? (
							<h2 className={styles['spell-select-title']}>
								Prepare {numberOfSpellsToPrepare} Spell
								{numberOfSpellsToPrepare > 1 ? 's' : ''}
							</h2>
						) : (
							<h2 className={styles['spell-select-title']}>
								Select {spellcasting.spellsKnown} Spell
								{spellcasting.spellsKnown > 1 ? 's' : ''}
							</h2>
						)}
						{isFetchingSpells ? (
							<div className={styles['loading-container']}>
								<LoadingSpinner />
							</div>
						) : (
							<SpellsSelector
								spells={[
									...allClassSpells.filter(
										({ level }) =>
											level >= 1 && level <= spellcasting.highestSlotLevel
									)
								].sort((a, b) => a.level - b.level)}
								choose={
									shouldPrepareSpells
										? numberOfSpellsToPrepare
										: spellcasting.spellsKnown
								}
							/>
						)}
					</div>
				</>
			)}
		</MainContent>
	);
};

export default Spells;
