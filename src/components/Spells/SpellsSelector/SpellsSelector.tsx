import { ChangeEventHandler, useCallback, useMemo, useState } from 'react';

import Checkbox from '../../Checkbox/Checkbox';
import { Item } from '../../../types/db/item';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Select from '../../Select/Select/Select';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import SpellSelector from '../SpellSelector/SpellSelector';
import classes from './SpellsSelector.module.css';

type SpellsSelectorProps = {
	spells: SpellItem[];
	selectedSpells: string[];
	label: string;
	isSelected: boolean;
	levels: number[];
	onAdd: (spell: SpellItem) => void;
	onRemove: (spell: SpellItem) => void;
	filterSpell?: (spell: SpellItem) => boolean;
};

const SpellsSelector = ({
	spells,
	label,
	isSelected,
	selectedSpells,
	levels,
	onAdd = () => {},
	onRemove = () => {},
	filterSpell = () => true
}: SpellsSelectorProps) => {
	const [search, setSearch] = useState('');
	const [selectedSchool, setSelectedSchool] = useState('blank');
	const [selectedLevel, setSelectedLevel] = useState<string | number>('blank');
	const [filterOnlySelected, setFilterOnlySelected] = useState(false);

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
					filterSpell(spell) &&
					spell.name.toLowerCase().includes(search.toLowerCase()) &&
					(selectedSchool === 'blank' || selectedSchool === spell.school.id) &&
					(selectedLevel === 'blank' || selectedLevel === spell.level) &&
					(!filterOnlySelected || selectedSpells.includes(spell.id))
			),
		[
			spells,
			selectedSchool,
			selectedLevel,
			filterOnlySelected,
			search,
			selectedSpells,
			filterSpell
		]
	);

	return (
		<div
			data-testid="spells-selector"
			className={`${classes.container}${
				isSelected ? ` ${classes.selected}` : ''
			}`}
		>
			<div className={classes.text}>{label}</div>
			<div className={classes['filter-bar']}>
				<div className={classes['search-container']}>
					<input
						className={classes.search}
						aria-label={selectorLabel}
						placeholder={selectorLabel}
						onChange={handleSearchChange}
						value={search}
					/>
					<MagnifyingGlassIcon className={classes['search-icon']} />
				</div>
				<div className={classes.selects}>
					<div className={classes['select-container']}>
						<Select
							label="School"
							id="school-select"
							options={[{ value: 'blank', label: '\u2014' }].concat(
								spells
									.reduce<Item[]>((acc, cur) => {
										if (!acc.some(school => school.id === cur.school.id)) {
											return [...acc, cur.school];
										} else {
											return acc;
										}
									}, [])
									.map(school => ({ value: school.id, label: school.name }))
							)}
							value={selectedSchool}
							onChange={handleSelectedSchoolChange}
						/>
					</div>
					{levels.length > 0 && (
						<div className={classes['select-container']}>
							<Select
								label="Level"
								id="level-select"
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
					<Checkbox
						label="Only Show Selected"
						checked={filterOnlySelected}
						onChange={checked => setFilterOnlySelected(checked)}
						useAlternateStyle={isSelected}
					/>
				</div>
			</div>
			<div className={classes['spells-container']}>
				{filteredSpells.length > 0 ? (
					filteredSpells.map(spell => (
						<SpellSelector
							key={spell.id}
							spell={spell}
							selectValues={selectedSpells}
							onAdd={() => onAdd(spell)}
							onRemove={() => onRemove(spell)}
							parentSelected={isSelected}
						/>
					))
				) : (
					<div className={classes['no-spells']}>No spells found.</div>
				)}
			</div>
		</div>
	);
};

export default SpellsSelector;
