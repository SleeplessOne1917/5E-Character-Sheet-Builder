import { useCallback, useMemo, useState } from 'react';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import Button from '../../../components/Button/Button';
import GET_SPELLS from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpells';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import SpellItem from '../../../components/MyStuff/SpellItem/SpellItem';
import SpellMoreInformationModal from '../../../components/SpellMoreInfoModal/SpellMoreInformationModal';
import classes from './MyStuffSpells.module.css';
import { useQuery } from 'urql';

type MyStuffSpellsProps = {
	loading: boolean;
};

const spellsPerPage = 10;

const MyStuffSpells = ({ loading }: MyStuffSpellsProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [spellsResult, _] = useQuery<{
		spells: { spells: Spell[]; count: number };
	}>({
		query: GET_SPELLS,
		variables: { limit: spellsPerPage, skip: (currentPage - 1) * spellsPerPage }
	});

	const [selectedSpell, setSelectedSpell] = useState<Spell>();

	const handleShowMoreInfoModal = useCallback((spell: Spell) => {
		setSelectedSpell(spell);
	}, []);

	const handleCloseShowMoreInfoModal = useCallback(() => {
		setSelectedSpell(undefined);
	}, []);

	const numPages = useMemo(
		() => Math.max((spellsResult.data?.spells.count ?? 0) / spellsPerPage),
		[spellsResult.data?.spells.count]
	);

	const handlePrevPageClick = useCallback(() => {
		setCurrentPage(prev => prev - 1);
	}, []);

	const handleNextPageClick = useCallback(() => {
		setCurrentPage(prev => prev + 1);
	}, []);

	return loading || spellsResult.fetching ? (
		<LoadingPageContent />
	) : (
		<>
			<MainContent>
				<h1>My Spells</h1>
				{(!spellsResult.data ||
					spellsResult.data.spells.spells.length === 0) && (
					<div className={classes['no-items-container']}>
						<p>
							You haven&apos;t created anything yet. Whenever you create
							anything, it will show up here.
						</p>
						<ArrowLink href="/create/spell" text="Create Spell" />
					</div>
				)}
				{spellsResult.data && spellsResult.data.spells.spells.length > 0 && (
					<div className={classes.content}>
						{numPages > 1 && (
							<div className={classes['page-count']}>
								Page {currentPage}/{numPages}
							</div>
						)}
						{spellsResult.data.spells.spells.map(spell => (
							<SpellItem
								spell={spell}
								onMoreInfoClick={handleShowMoreInfoModal}
								key={spell.id}
							/>
						))}
						<div className={classes['next-prev-buttons']}>
							{currentPage > 1 && (
								<Button
									style={{ alignSelf: 'flex-start' }}
									onClick={handlePrevPageClick}
								>
									Previous Page
								</Button>
							)}
							{currentPage < numPages && (
								<Button
									style={{ alignSelf: 'flex-end' }}
									onClick={handleNextPageClick}
								>
									Next Page
								</Button>
							)}
						</div>
					</div>
				)}
			</MainContent>
			<SpellMoreInformationModal
				spell={selectedSpell}
				show={!!selectedSpell}
				onClose={handleCloseShowMoreInfoModal}
			/>
		</>
	);
};

export default MyStuffSpells;
