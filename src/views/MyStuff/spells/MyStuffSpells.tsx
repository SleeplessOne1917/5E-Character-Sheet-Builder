'use client';

import { Spell, SpellItem } from '../../../types/characterSheetBuilderAPI';
import { useCallback, useEffect, useMemo, useState } from 'react';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import Button from '../../../components/Button/Button';
import MainContent from '../../../components/MainContent/MainContent';
import SpellItemDisplay from '../../../components/MyStuff/SpellItem/SpellItemDisplay';
import SpellMoreInformationModal from '../../../components/Spells/SpellMoreInfoModal/SpellMoreInformationModal';
import classes from './MyStuffSpells.module.css';
import { trpc } from '../../../common/trpc';

const spellsPerPage = 10;

const MyStuffSpells = () => {
	const [spellId, setSpellId] = useState<string>();
	const [selectedSpell, setSelectedSpell] = useState<Spell>();
	const [currentPage, setCurrentPage] = useState(1);

	const spellResult = trpc.spells.spell.useQuery(spellId as string, {
		enabled: !!spellId
	});
	const spellsResult = trpc.spells.spells.useQuery({
		limit: spellsPerPage,
		skip: (currentPage - 1) * spellsPerPage
	});

	useEffect(() => {
		if (spellId && spellResult.isSuccess) {
			setSelectedSpell(spellResult.data);
		}
	}, [spellId, spellResult.isSuccess, spellResult.data]);

	const handleShowMoreInfoModal = useCallback(({ id }: SpellItem) => {
		setSpellId(id);
	}, []);

	const handleCloseShowMoreInfoModal = useCallback(() => {
		setSelectedSpell(undefined);
		setSpellId(undefined);
	}, []);

	const numPages = useMemo(
		() => Math.max((spellsResult.data?.count ?? 0) / spellsPerPage),
		[spellsResult.data?.count]
	);

	const handlePrevPageClick = useCallback(() => {
		setCurrentPage(prev => prev - 1);
	}, []);

	const handleNextPageClick = useCallback(() => {
		setCurrentPage(prev => prev + 1);
	}, []);

	return (
		<>
			<MainContent>
				<h1>My Spells</h1>
				{(!spellsResult.data || spellsResult.data.spells.length === 0) && (
					<div className={classes['no-items-container']}>
						<p>
							You haven&apos;t created anything yet. Whenever you create
							anything, it will show up here.
						</p>
						<ArrowLink href="/create/spell" text="Create Spell" />
					</div>
				)}
				{spellsResult.data && spellsResult.data.spells.length > 0 && (
					<div className={classes.content}>
						{numPages > 1 && (
							<div className={classes['page-count']}>
								Page {currentPage}/{numPages}
							</div>
						)}
						{spellsResult.data.spells.map(spell => (
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
				loading={spellResult.isLoading}
				onClose={handleCloseShowMoreInfoModal}
				shouldShowEditAndClasses
			/>
		</>
	);
};

export default MyStuffSpells;
