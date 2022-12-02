'use client';

import { useEffect, useState } from 'react';

import CreateCharacterSpellsSelector from '../../../../components/Spells/CreateCharacterSpellsSelector/CreateCharacterSpellsSelector';
import GeneralInfoBar from '../../../../components/Create/Character/GeneralInfoBar/GeneralInfoBar';
import LoadingPageContent from '../../../../components/LoadingPageContent/LoadingPageContent';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../../../components/MainContent/MainContent';
import SpellsKnownDisplay from '../../../../components/Create/Character/Spells/SpellsKnownDisplay/SpellsKnownDisplay';
import styles from './Spells.module.css';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import useGetSpellsByClass from '../../../../hooks/useGetSpellsByClass';
import usePreparedSpells from '../../../../hooks/usePreparedSpells';
import { useRouter } from 'next/navigation';

const Spells = () => {
	const classInfo = useAppSelector(state => state.editingCharacter.classInfo);
	const spellcasting = useAppSelector(
		state => state.editingCharacter.spellcasting
	);
	const [isLoading, setIsLoading] = useState(true);
	const { numberOfSpellsToPrepare, shouldPrepareSpells } = usePreparedSpells();

	const classSpellsResult = useGetSpellsByClass(classInfo.class?.index);

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

	return isLoading ? (
		<LoadingPageContent />
	) : (
		<MainContent>
			<GeneralInfoBar />
			<h1 className={styles.title}>Spells</h1>
			{spellcasting.spells.length > 0 && (
				<div className={styles['spells-selector-container']}>
					<h2 className={styles['spell-select-title']}>
						Spells {shouldPrepareSpells ? 'Prepared' : 'Known'}
					</h2>
					<SpellsKnownDisplay />
				</div>
			)}
			{spellcasting.cantripsKnown > 0 && (
				<div className={styles['spells-selector-container']}>
					<h2 className={styles['spell-select-title']}>
						Select {spellcasting.cantripsKnown} Cantrip
						{spellcasting.cantripsKnown > 1 ? 's' : ''}
					</h2>
					{classSpellsResult.fetching ? (
						<div className={styles['loading-container']}>
							<LoadingSpinner />
						</div>
					) : (
						<CreateCharacterSpellsSelector
							spells={classSpellsResult.spells.filter(
								({ level }) => level === 0
							)}
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
				{classSpellsResult.fetching ? (
					<div className={styles['loading-container']}>
						<LoadingSpinner />
					</div>
				) : (
					<CreateCharacterSpellsSelector
						spells={[
							...classSpellsResult.spells.filter(
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
		</MainContent>
	);
};

export default Spells;
