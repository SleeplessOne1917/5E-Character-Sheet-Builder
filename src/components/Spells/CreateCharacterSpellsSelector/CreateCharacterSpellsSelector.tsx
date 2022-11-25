'use client';

import {
	addClassSpell,
	removeClassSpell
} from '../../../redux/features/classInfo';
import { addSpell, removeSpell } from '../../../redux/features/spellcasting';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { useCallback, useMemo, useState } from 'react';

import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import SpellsSelector from '../SpellsSelector/SpellsSelector';

type CreateCharacterSpellsSelectorProps = {
	spells: SpellItem[];
	choose: number;
};

const CreateCharacterSpellsSelector = ({
	spells,
	choose
}: CreateCharacterSpellsSelectorProps) => {
	const classSpells = useAppSelector(
		state => state.editingCharacter.classInfo.spells
	);
	const highestSlotLevel = useAppSelector(
		state => state.editingCharacter.spellcasting.highestSlotLevel
	);
	const levels = useMemo(() => {
		const levels: number[] = [];
		if (
			!spells.reduce<{ level: number | null; isSameLevel: boolean }>(
				(acc, cur) => {
					if (!acc.level) {
						return {
							...acc,
							level: cur.level
						};
					} else {
						return {
							...acc,
							isSameLevel: cur.level === acc.level
						};
					}
				},
				{
					level: null,
					isSameLevel: true
				}
			).isSameLevel
		) {
			for (let i = 1; i <= highestSlotLevel; ++i) {
				levels.push(i);
			}
		}

		return levels;
	}, [highestSlotLevel, spells]);

	const dispatch = useAppDispatch();

	const traitSpellsByTrait = useAppSelector(
		state => state.editingCharacter.raceInfo.selectedTraitSpells
	);

	const traitSpells = useMemo(
		() => Object.values(traitSpellsByTrait).flatMap(value => value),
		[traitSpellsByTrait]
	);

	const subclassSpells = useAppSelector(
		state => state.editingCharacter.classInfo.subclass?.spells
	);

	const getInitialSelectedSpells = useCallback(
		() =>
			spells
				.filter(spell => classSpells?.some(cs => cs.id === spell.id))
				.map(({ id }) => id),
		[spells, classSpells]
	);

	const [selectedSpells, setSelectedSpells] = useState(
		getInitialSelectedSpells()
	);

	const handleAdd = useCallback(
		(spell: SpellItem) => {
			dispatch(addClassSpell(spell));
			dispatch(addSpell(spell));
			setSelectedSpells(prev => [...prev, spell.id]);
		},
		[dispatch]
	);

	const handleRemove = useCallback(
		(spell: SpellItem) => {
			dispatch(removeClassSpell(spell.id));
			dispatch(removeSpell(spell.id));
			setSelectedSpells(prev => prev.filter(s => s !== spell.id));
		},
		[dispatch]
	);

	const filterSpell = useCallback(
		(spell: SpellItem) =>
			!traitSpells.some(ts => ts.id === spell.id) &&
			!(subclassSpells && subclassSpells.some(s => s.spell.index === spell.id)),
		[traitSpells, subclassSpells]
	);

	const numberOfSelectedSpells = selectedSpells.filter(
		spell => spell !== 'blank'
	).length;

	return (
		<SpellsSelector
			isSelected={numberOfSelectedSpells === choose}
			selectedSpells={selectedSpells}
			spells={spells}
			levels={levels}
			label={`${numberOfSelectedSpells}/${choose} ${
				spells.some(({ level }) => level > 0) ? 'spell' : 'cantrip'
			}s selected`}
			filterSpell={filterSpell}
			onAdd={handleAdd}
			onRemove={handleRemove}
		/>
	);
};

export default CreateCharacterSpellsSelector;
