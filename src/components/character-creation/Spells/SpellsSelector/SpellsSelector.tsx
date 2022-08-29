import {
	ChangeEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react';
import { SrdItem, SrdSpellItem } from '../../../../types/srd';
import {
	addClassSpell,
	removeClassSpell
} from '../../../../redux/features/classInfo';
import { addSpell, removeSpell } from '../../../../redux/features/spellcasting';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import Checkbox from '../../../Checkbox/Checkbox';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Select from '../../../Select/Select';
import SpellSelector from '../SpellSelector/SpellSelector';
import styles from './SpellsSelector.module.css';

type SpellsSelectorProps = {
	spells: SrdSpellItem[];
	choose: number;
};

const SpellsSelector = ({ spells, choose }: SpellsSelectorProps) => {
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

	const [search, setSearch] = useState('');
	const [selectedSchool, setSelectedSchool] = useState('blank');
	const [selectedLevel, setSelectedLevel] = useState<string | number>('blank');
	const [filterOnlySelected, setFilterOnlySelected] = useState(false);

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

	const selectorLabel = `Search ${
		levels.length === 0 && spells[0].level === 0 ? 'cantrips' : 'spells'
	}`;

	const handleSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
		event => {
			setSearch(event.target.value);
		},
		[setSearch]
	);

	const handleSelectedSchoolChange = useCallback(
		(value: string | number) => {
			setSelectedSchool(value as string);
		},
		[setSelectedSchool]
	);

	const handleSelectedLevelChange = useCallback(
		(value: string | number) => {
			setSelectedLevel(value);
		},
		[setSelectedLevel]
	);

	const filteredSpells = useMemo(
		() =>
			spells.filter(
				spell =>
					!traitSpells.some(ts => ts.index === spell.index) &&
					!(
						subclassSpells &&
						subclassSpells.some(s => s.spell.index === spell.index)
					) &&
					spell.name.toLowerCase().includes(search.toLowerCase()) &&
					(selectedSchool === 'blank' ||
						selectedSchool === spell.school.index) &&
					(selectedLevel === 'blank' || selectedLevel === spell.level) &&
					(!filterOnlySelected || selectedSpells.includes(spell.index))
			),
		[
			spells,
			traitSpells,
			selectedSchool,
			selectedLevel,
			filterOnlySelected,
			search,
			selectedSpells,
			subclassSpells
		]
	);

	const numberOfSelectedSpells = selectedSpells.filter(
		spell => spell !== 'blank'
	).length;

	return (
		<div
			data-testid="spells-selector"
			className={`${styles.container}${
				numberOfSelectedSpells === choose ? ` ${styles.selected}` : ''
			}`}
		>
			<div className={styles.text}>
				{numberOfSelectedSpells}/{choose}{' '}
				{spells.some(({ level }) => level > 0) ? 'spell' : 'cantrip'}s selected
			</div>
			<div className={styles['filter-bar']}>
				<div className={styles['search-container']}>
					<input
						className={styles.search}
						aria-label={selectorLabel}
						placeholder={selectorLabel}
						onChange={handleSearchChange}
						value={search}
					/>
					<MagnifyingGlassIcon className={styles['search-icon']} />
				</div>
				<div className={styles.selects}>
					<div className={styles['select-container']}>
						<label id="school-select" className={styles['select-label']}>
							School
						</label>{' '}
						<Select
							labelledBy="school-select"
							options={[{ value: 'blank', label: '\u2014' }].concat(
								spells
									.reduce<SrdItem[]>((acc, cur) => {
										if (
											!acc.some(school => school.index === cur.school.index)
										) {
											return [...acc, cur.school];
										} else {
											return acc;
										}
									}, [])
									.map(school => ({ value: school.index, label: school.name }))
							)}
							value={selectedSchool}
							onChange={handleSelectedSchoolChange}
						/>
					</div>
					{levels.length > 0 && (
						<div className={styles['select-container']}>
							<label id="level-select" className={styles['select-label']}>
								Level
							</label>{' '}
							<Select
								labelledBy="level-select"
								options={[
									{ value: 'blank', label: '\u2014' } as {
										value: string | number;
										label: string;
									}
								].concat(
									levels.map(level => ({
										value: level,
										label: `${level}`
									}))
								)}
								value={selectedLevel}
								onChange={handleSelectedLevelChange}
							/>
						</div>
					)}
					<div className={styles['select-container']}>
						<label className={styles['select-label']}>Only Show Selected</label>{' '}
						<Checkbox
							label="Only Show Selected"
							checked={filterOnlySelected}
							onChange={checked => setFilterOnlySelected(checked)}
							useAlternateStyle={numberOfSelectedSpells === choose}
						/>
					</div>
				</div>
			</div>
			<div className={styles['spells-container']}>
				{filteredSpells.length > 0 ? (
					filteredSpells.map(spell => (
						<SpellSelector
							key={spell.index}
							spell={spell}
							selectValues={selectedSpells}
							onAdd={() => handleAdd(spell)}
							onRemove={() => handleRemove(spell)}
						/>
					))
				) : (
					<div className={styles['no-spells']}>No spells found.</div>
				)}
			</div>
		</div>
	);
};

export default SpellsSelector;
