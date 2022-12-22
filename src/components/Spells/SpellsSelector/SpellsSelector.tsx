'use client';

import {
	ChangeEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react';

import Button from '../../Button/Button';
import Checkbox from '../../Checkbox/Checkbox';
import { Item } from '../../../types/db/item';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Select from '../../Select/Select/Select';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import SpellSelector from '../SpellSelector/SpellSelector';
import classes from './SpellsSelector.module.css';
import useMediaQuery from '../../../hooks/useMediaQuery';

type SpellsSelectorProps = {
	spells: SpellItem[];
	selectedSpells: string[];
	label: string;
	isSelected?: boolean;
	levels: number[];
	onAdd: (spell: SpellItem) => void;
	onRemove: (spell: SpellItem) => void;
	filterSpell?: (spell: SpellItem) => boolean;
};

const MAX_PAGE_SIZE = 10;

const SpellsSelector = ({
	spells,
	label,
	isSelected = false,
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
	const [currentPage, setCurrentPage] = useState(1);

	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');

	const selectorLabel = `Search ${
		levels.length === 0 && spells[0].level === 0 ? 'cantrips' : 'spells'
	}`;

	useEffect(() => {
		if (
			!levels.includes(
				selectedLevel === 'blank' ? -1 : (selectedLevel as number)
			)
		) {
			setSelectedLevel('blank');
		}
	}, [levels, selectedLevel]);

	const handlePreviousClick = useCallback(() => {
		setCurrentPage(prev => prev - 1);
	}, []);

	const handleNextClick = useCallback(() => {
		setCurrentPage(prev => prev + 1);
	}, []);

	const resetPage = useCallback(() => {
		setCurrentPage(1);
	}, []);

	const handleFilterOnlySelectedClick = useCallback(
		(checked: boolean) => {
			setFilterOnlySelected(checked);
			resetPage();
		},
		[resetPage]
	);

	const handleSearchChange: ChangeEventHandler<HTMLInputElement> = useCallback(
		event => {
			setSearch(event.target.value);
			resetPage();
		},
		[setSearch, resetPage]
	);

	const handleSelectedSchoolChange = useCallback(
		(value: string | number) => {
			setSelectedSchool(value as string);
			resetPage();
		},
		[setSelectedSchool, resetPage]
	);

	const handleSelectedLevelChange = useCallback(
		(value: string | number) => {
			setSelectedLevel(value);
			resetPage();
		},
		[setSelectedLevel, resetPage]
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

	const pages = Math.ceil(filteredSpells.length / MAX_PAGE_SIZE);

	const pageSpells = useMemo(
		() =>
			filteredSpells.filter(
				(val, index) =>
					index >= (currentPage - 1) * MAX_PAGE_SIZE &&
					index < currentPage * MAX_PAGE_SIZE
			),
		[currentPage, filteredSpells]
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
								value={
									levels.includes(
										selectedLevel === 'blank' ? -1 : (selectedLevel as number)
									)
										? selectedLevel
										: 'blank'
								}
								onChange={handleSelectedLevelChange}
							/>
						</div>
					)}
					<Checkbox
						label="Only Show Selected"
						checked={filterOnlySelected}
						onChange={handleFilterOnlySelectedClick}
						useAlternateStyle={isSelected}
					/>
				</div>
			</div>
			<div className={classes['spells-container']}>
				{pageSpells.length > 0 ? (
					pageSpells.map(spell => (
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
			{pages > 1 && (
				<div className={classes['page-buttons']}>
					{currentPage > 1 && (
						<div
							style={{
								gridArea: 'prev',
								display: 'flex',
								justifyContent: 'center'
							}}
						>
							<Button
								positive
								onClick={handlePreviousClick}
								size={isMediumOrLarger ? 'medium' : 'small'}
							>
								Previous
							</Button>
						</div>
					)}
					<div className={classes['page-text']}>
						Page {currentPage}/{pages}
					</div>
					{currentPage < pages && (
						<div
							style={{
								gridArea: 'next',
								display: 'flex',
								justifyContent: 'center'
							}}
						>
							<Button
								positive
								onClick={handleNextClick}
								size={isMediumOrLarger ? 'medium' : 'small'}
							>
								Next
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SpellsSelector;
