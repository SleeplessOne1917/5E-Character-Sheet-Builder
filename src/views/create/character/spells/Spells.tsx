import { useEffect, useState } from 'react';

import CreateCharacterSpellsSelector from '../../../../components/Spells/CreateCharacterSpellsSelector/CreateCharacterSpellsSelector';
import GeneralInfoBar from '../../../../components/Create/Character/GeneralInfoBar/GeneralInfoBar';
import LoadingPageContent from '../../../../components/LoadingPageContent/LoadingPageContent';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../../../components/MainContent/MainContent';
import { Spell } from '../../../../types/characterSheetBuilderAPI';
import SpellsKnownDisplay from '../../../../components/Create/Character/Spells/SpellsKnownDisplay/SpellsKnownDisplay';
import { getSpellsByClass } from '../../../../services/spellsService';
import styles from './Spells.module.css';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import usePreparedSpells from '../../../../hooks/usePreparedSpells';
import { useRouter } from 'next/router';

const Spells = () => {
	const classInfo = useAppSelector(state => state.editingCharacter.classInfo);
	const spellcasting = useAppSelector(
		state => state.editingCharacter.spellcasting
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isFetchingSpells, setIsFetchingSpells] = useState(true);
	const { numberOfSpellsToPrepare, shouldPrepareSpells } = usePreparedSpells();

	const [allClassSpells, setAllClassSpells] = useState<Spell[]>([]);

	useEffect(() => {
		setIsFetchingSpells(true);

		if (classInfo.class) {
			getSpellsByClass(classInfo.class.index).then(result => {
				if (result) {
					setAllClassSpells(result);
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
					{isFetchingSpells ? (
						<div className={styles['loading-container']}>
							<LoadingSpinner />
						</div>
					) : (
						<CreateCharacterSpellsSelector
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
					<CreateCharacterSpellsSelector
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
		</MainContent>
	);
};

export default Spells;
