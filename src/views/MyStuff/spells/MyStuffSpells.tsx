'use client';

import { Spell, SpellItem } from '../../../types/characterSheetBuilderAPI';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import Button from '../../../components/Button/Button';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import SpellItemDisplay from '../../../components/MyStuff/SpellItem/SpellItemDisplay';
import SpellMoreInformationModal from '../../../components/Spells/SpellMoreInfoModal/SpellMoreInformationModal';
import classes from './MyStuffSpells.module.css';
import useGetLimitedSpellsQuery from '../../../hooks/urql/queries/useGetLimitedSpellsQuery';
import useGetSpellQuery from '../../../hooks/urql/queries/useGetSpellQuery';

const spellsPerPage = 10;

const MyStuffSpells = () => {
	const [spellId, setSpellId] = useState<string>();
	const [selectedSpell, setSelectedSpell] = useState<Spell>();
	const [currentPage, setCurrentPage] = useState(1);

	const [spellResult] = useGetSpellQuery(spellId);

	const [spellsResult] = useGetLimitedSpellsQuery({
		limit: spellsPerPage,
		skip: (currentPage - 1) * spellsPerPage
	});

	useEffect(() => {
		if (spellId && !(spellResult.fetching || spellResult.error)) {
			setSelectedSpell(spellResult.data?.spell);
		}
	}, [spellId, spellResult.fetching, spellResult.error, spellResult.data]);

	const handleShowMoreInfoModal = useCallback(({ id }: SpellItem) => {
		setSpellId(id);
	}, []);

	const handleCloseShowMoreInfoModal = useCallback(() => {
		setSelectedSpell(undefined);
		setSpellId(undefined);
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

	return spellsResult.fetching ? (
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
							<SpellItemDisplay
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
				show={!!spellId}
				error={spellResult.error?.message}
				loading={spellResult.fetching}
				onClose={handleCloseShowMoreInfoModal}
				shouldShowEditAndClasses
			/>
		</>
	);
};

export default MyStuffSpells;
