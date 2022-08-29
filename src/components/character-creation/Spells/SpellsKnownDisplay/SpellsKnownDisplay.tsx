import { useCallback, useMemo, useState } from 'react';

import Button from '../../../Button/Button';
import SpellMoreInformationModal from '../SpellMoreInfoModal/SpellMoreInformationModal';
import { SrdSpellItem } from '../../../../types/srd';
import classes from './SpellsKnownDisplay.module.css';
import { useAppSelector } from '../../../../hooks/reduxHooks';

const SpellsKnownDisplay = () => {
	const spells = useAppSelector(
		state => state.editingCharacter.spellcasting.spells
	);

	const spellsByLevel = useMemo(
		() =>
			spells.reduce<Map<number, SrdSpellItem[]>>((acc, cur) => {
				if (!acc.get(cur.level)) {
					acc.set(cur.level, [cur]);
				} else {
					acc.get(cur.level)?.push(cur);
				}

				return acc;
			}, new Map<number, SrdSpellItem[]>()),
		[spells]
	);

	const [selectedSpell, setSelectedSpell] = useState(spells[0]);
	const [showMore, setShowMore] = useState(false);

	const handleShowMoreInfo = useCallback(
		(spell: SrdSpellItem) => {
			setSelectedSpell(spell);
			setShowMore(true);
		},
		[setSelectedSpell, setShowMore]
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
							(spellsByLevel.get(level) as SrdSpellItem[]).map(
								(spell, index) => (
									<div
										key={spell.index}
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
								)
							)
						)
					)}
			</div>
			<SpellMoreInformationModal
				show={showMore}
				spell={selectedSpell}
				onClose={() => setShowMore(false)}
			/>
		</>
	);
};

export default SpellsKnownDisplay;
