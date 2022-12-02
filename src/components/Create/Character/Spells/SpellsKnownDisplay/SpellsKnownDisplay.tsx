'use client';

import { use, useCallback, useMemo, useState } from 'react';

import Button from '../../../../Button/Button';
import { SpellItem } from '../../../../../types/characterSheetBuilderAPI';
import SpellMoreInformationModal from '../../../../Spells/SpellMoreInfoModal/SpellMoreInformationModal';
import classes from './SpellsKnownDisplay.module.css';
import { getSpell } from '../../../../../services/spellsService';
import { useAppSelector } from '../../../../../hooks/reduxHooks';

const SpellsKnownDisplay = () => {
	const spells = useAppSelector(
		state => state.editingCharacter.spellcasting.spells
	);
	const [selectedSpellId, setSelectedSpellId] = useState<string>();

	const selectedSpell = selectedSpellId
		? use(getSpell(selectedSpellId))
		: undefined;

	const [showMore, setShowMore] = useState(false);

	const handleShowMoreInfo = useCallback((spell: SpellItem) => {
		setSelectedSpellId(spell.id);
		setShowMore(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setSelectedSpellId(undefined);
		setShowMore(false);
	}, []);

	const spellsByLevel = useMemo(
		() =>
			spells.reduce<Map<number, SpellItem[]>>((acc, cur) => {
				if (!acc.get(cur.level)) {
					acc.set(cur.level, [cur]);
				} else {
					acc.get(cur.level)?.push(cur);
				}

				return acc;
			}, new Map<number, SpellItem[]>()),
		[spells]
	);

	return (
		<>
			<div className={classes.container}>
				{Array.from(spellsByLevel.keys())
					.sort((a, b) => a - b)
					.flatMap(level =>
						[
							<div className={classes['spell-header']} key={level}>
								{level === 0 ? 'Cantrips' : `Level ${level}`}
							</div>
						].concat(
							(spellsByLevel.get(level) as SpellItem[]).map((spell, index) => (
								<div
									key={spell.id}
									className={`${classes.spell} ${
										index % 2 === 0 ? classes.even : classes.odd
									}`}
								>
									{spell.name}
									<Button
										size="small"
										positive
										onClick={() => handleShowMoreInfo(spell)}
									>
										More Info
									</Button>
								</div>
							))
						)
					)}
			</div>
			<SpellMoreInformationModal
				show={showMore}
				spell={selectedSpell}
				onClose={handleCloseModal}
				loading={!selectedSpell}
			/>
		</>
	);
};

export default SpellsKnownDisplay;
