'use client';

import { useCallback, useMemo, useState } from 'react';

import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MyStuffGeneric from '../generic/MyStuffGeneric';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import SpellItemDisplay from '../../../components/MyStuff/SpellItem/SpellItemDisplay';
import SpellMoreInformationModal from '../../../components/Spells/SpellMoreInfoModal/SpellMoreInformationModal';
import useGetLimitedSpellsQuery from '../../../hooks/urql/queries/useGetLimitedSpellsQuery';
import useGetSpellQuery from '../../../hooks/urql/queries/useGetSpellQuery';

const spellsPerPage = 10;

const MyStuffSpells = () => {
	const [spellId, setSpellId] = useState<string>();
	const [currentPage, setCurrentPage] = useState(1);

	const [spellResult] = useGetSpellQuery(spellId);

	const [spellsResult] = useGetLimitedSpellsQuery({
		limit: spellsPerPage,
		skip: (currentPage - 1) * spellsPerPage
	});

	const handleShowMoreInfoModal = useCallback(({ id }: SpellItem) => {
		setSpellId(id);
	}, []);

	const handleCloseShowMoreInfoModal = useCallback(() => {
		setSpellId(undefined);
	}, []);

	const numberOfPages = useMemo(
		() => Math.max((spellsResult.data?.spells.count ?? 0) / spellsPerPage),
		[spellsResult.data?.spells.count]
	);

	const handlePrevPageClick = useCallback(() => {
		setCurrentPage(prev => prev - 1);
	}, []);

	const handleNextPageClick = useCallback(() => {
		setCurrentPage(prev => prev + 1);
	}, []);

	const items = useMemo(
		() =>
			spellsResult.data?.spells.spells.map(spell => (
				<SpellItemDisplay
					spell={spell}
					onMoreInfoClick={handleShowMoreInfoModal}
					key={spell.id}
				/>
			)),
		[spellsResult.data?.spells.spells, handleShowMoreInfoModal]
	);

	return spellsResult.fetching ? (
		<LoadingPageContent />
	) : (
		<>
			<MyStuffGeneric
				currentPage={currentPage}
				handleNextClick={handleNextPageClick}
				handlePreviousClick={handlePrevPageClick}
				numberOfPages={numberOfPages}
				title="Spells"
				items={items}
			/>
			<SpellMoreInformationModal
				spell={spellResult.data?.spell}
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
