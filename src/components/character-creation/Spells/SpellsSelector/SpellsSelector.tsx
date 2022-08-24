import { useCallback, useMemo, useState } from 'react';

import SpellSelector from '../SpellSelector/SpellSelector';
import { SrdSpellItem } from '../../../../types/srd';
import styles from './SpellsSelector.module.css';
import { useAppSelector } from '../../../../hooks/reduxHooks';

type SpellsSelectorProps = {
	spells: SrdSpellItem[];
	choose: number;
};

const SpellsSelector = ({ spells, choose }: SpellsSelectorProps) => {
	const classSpells = useAppSelector(
		state => state.editingCharacter.classInfo.spells
	);

	const traitSpellsByTrait = useAppSelector(
		state => state.editingCharacter.raceInfo.selectedTraitSpells
	);

	const traitSpells = useMemo(
		() => Object.values(traitSpellsByTrait).flatMap(value => value),
		[traitSpellsByTrait]
	);

	const getInitialSelectedSpells = useCallback(() => {
		const selected = spells
			.filter(spell => classSpells?.some(cs => cs.index === spell.index))
			.map(({ index }) => index);

		if (selected.length < choose) {
			for (let i = 0; i < choose; ++i) {
				selected.push('blank');
			}
		}

		return selected;
	}, [spells, classSpells, choose]);

	/* eslint-disable unused-imports/no-unused-vars */
	const [selectedSpells, setSelectedSpells] = useState(
		getInitialSelectedSpells()
	);
	/* eslint-enable unused-imports/no-unused-vars */

	return (
		<div data-testid="spells-selector" className={styles.container}>
			<div className={styles.text}>
				{selectedSpells.filter(spell => spell !== 'blank').length}/{choose}{' '}
				{spells.some(({ level }) => level > 0) ? 'spell' : 'cantrip'}s selected
			</div>
			<div className={styles['spells-container']}>
				{spells
					.filter(spell => !traitSpells.some(ts => ts.index === spell.index))
					.map(spell => (
						<SpellSelector
							key={spell.index}
							spell={spell}
							selectValues={selectedSpells}
							onAdd={() => {}}
							onRemove={() => {}}
						/>
					))}
			</div>
		</div>
	);
};

export default SpellsSelector;
