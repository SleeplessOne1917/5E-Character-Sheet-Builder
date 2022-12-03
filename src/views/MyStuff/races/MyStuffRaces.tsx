'use client';

import { useCallback, useMemo, useState } from 'react';

import { Item } from '../../../types/db/item';
import ItemDisplay from '../../../components/MyStuff/ItemDisplay/ItemDisplay';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MoreInfoModal from '../../../components/MoreInfoModal/MoreInfoModal';
import MyStuffGeneric from '../generic/MyStuffGeneric';
import { getRaceDescriptors } from '../../../services/descriptorsHelpers';
import useGetLimitedRacesQuery from '../../../hooks/urql/queries/useGetLimitedRacesQuery';
import useGetRaceQuery from '../../../hooks/urql/queries/useGetRaceQuery';
import { useRouter } from 'next/navigation';

const racesPerPage = 10;

const MyStuffRaces = () => {
	const router = useRouter();
	const [raceId, setRaceId] = useState<string>();
	const [currentPage, setCurrentPage] = useState(1);

	const [raceResult] = useGetRaceQuery(raceId);

	const [racesResult] = useGetLimitedRacesQuery({
		limit: racesPerPage,
		skip: (currentPage - 1) * racesPerPage
	});

	const handleShowMoreInfoModal = useCallback(({ id }: Item) => {
		setRaceId(id);
	}, []);

	const handleRaceEdit = useCallback(() => {
		router.push(`/my-stuff/edit/races/${raceId}`);
	}, [router, raceId]);

	const handleCloseShowMoreInfoModal = useCallback(() => {
		setRaceId(undefined);
	}, []);

	const numberOfPages = useMemo(
		() => Math.max((racesResult.data?.races.count ?? 0) / racesPerPage),
		[racesResult.data?.races.count]
	);

	const handlePrevPageClick = useCallback(() => {
		setCurrentPage(prev => prev - 1);
	}, []);

	const handleNextPageClick = useCallback(() => {
		setCurrentPage(prev => prev + 1);
	}, []);

	const items = useMemo(
		() =>
			racesResult.data?.races.races.map(race => (
				<ItemDisplay
					item={race}
					onMoreInfoClick={handleShowMoreInfoModal}
					key={race.id}
				/>
			)),
		[racesResult.data?.races.races, handleShowMoreInfoModal]
	);

	const { descriptors, otherDescriptors } = useMemo(
		() => getRaceDescriptors(raceResult.data?.race),
		[raceResult.data?.race]
	);

	return racesResult.fetching ? (
		<LoadingPageContent />
	) : (
		<>
			<MyStuffGeneric
				currentPage={currentPage}
				handleNextClick={handleNextPageClick}
				handlePreviousClick={handlePrevPageClick}
				numberOfPages={numberOfPages}
				title="Races"
				items={items}
			/>
			<MoreInfoModal
				iconId="custom-race"
				onAction={handleRaceEdit}
				onClose={handleCloseShowMoreInfoModal}
				show={!!raceId}
				title={raceResult.data?.race.name ?? ''}
				descriptors={descriptors}
				otherDescriptors={otherDescriptors}
				mode="edit"
				loading={raceResult.fetching}
				error={!!raceResult.error}
			/>
		</>
	);
};

export default MyStuffRaces;
