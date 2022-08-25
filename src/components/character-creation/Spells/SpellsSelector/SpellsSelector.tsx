import { useCallback, useMemo, useState, useEffect } from 'react';

import SpellSelector from '../SpellSelector/SpellSelector';
import { SrdSpellItem } from '../../../../types/srd';
import styles from './SpellsSelector.module.css';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import {
	addClassSpell,
	removeClassSpell
} from '../../../../redux/features/classInfo';
import { addSpell, removeSpell } from '../../../../redux/features/spellcasting';

type SpellsSelectorProps = {
	spells: SrdSpellItem[];
	choose: number;
};

const SpellsSelector = ({ spells, choose }: SpellsSelectorProps) => {
	const classSpells = useAppSelector(
		state => state.editingCharacter.classInfo.spells
	);

	const dispatch = useAppDispatch();

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

	const [selectedSpells, setSelectedSpells] = useState(
		getInitialSelectedSpells()
	);

	useEffect(() => {
		setSelectedSpells(getInitialSelectedSpells());
	}, [setSelectedSpells, getInitialSelectedSpells]);

	const handleAdd = useCallback(
		(spell: SrdSpellItem) => {
			dispatch(addClassSpell(spell));
			dispatch(addSpell(spell));
		},
		[dispatch]
	);

	const handleRemove = useCallback(
		(spell: SrdSpellItem) => {
			dispatch(removeClassSpell(spell.index));
			dispatch(removeSpell(spell.index));
		},
		[dispatch]
	);

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
							onAdd={() => handleAdd(spell)}
							onRemove={() => handleRemove(spell)}
						/>
					))}
			</div>
		</div>
	);
};

export default SpellsSelector;
