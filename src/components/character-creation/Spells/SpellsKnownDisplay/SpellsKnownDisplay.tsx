import { useAppSelector } from '../../../../hooks/reduxHooks';
import { SrdSpellItem } from '../../../../types/srd';
import classes from './SpellsKnownDisplay.module.css';

const SpellsKnownDisplay = () => {
	const spellsByLevel = useAppSelector(
		state => state.editingCharacter.spellcasting.spells
	).reduce<Map<number, SrdSpellItem[]>>((acc, cur) => {
		if (!acc.get(cur.level)) {
			acc.set(cur.level, [cur]);
		} else {
			acc.get(cur.level)?.push(cur);
		}

		return acc;
	}, new Map<number, SrdSpellItem[]>());

	return (
		<div className={classes.container}>
			{Array.from(spellsByLevel.keys())
				.sort((a, b) => a - b)
				.flatMap(level =>
					[
						<div className={classes['spell-header']} key={level}>
							{level === 0 ? 'Cantrips' : `Level ${level}`}
						</div>
					].concat(
						(spellsByLevel.get(level) as SrdSpellItem[]).map(spell => (
							<div key={spell.index} className={classes.spell}>
								{spell.name}
							</div>
						))
					)
				)}
		</div>
	);
};

export default SpellsKnownDisplay;
