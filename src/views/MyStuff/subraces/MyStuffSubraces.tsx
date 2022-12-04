'use client';

import { useCallback, useMemo, useState } from 'react';

import { Item } from '../../../types/db/item';
import ItemDisplay from '../../../components/MyStuff/ItemDisplay/ItemDisplay';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MoreInfoModal from '../../../components/MoreInfoModal/MoreInfoModal';
import MyStuffGeneric from '../generic/MyStuffGeneric';
import { getSubraceDescriptors } from '../../../services/descriptorsHelpers';
import useGetLimitedSubracesQuery from '../../../hooks/urql/queries/useGetLimitedSubracesQuery';
import useGetSubraceQuery from '../../../hooks/urql/queries/useGetSubraceQuery';
import { useRouter } from 'next/navigation';

const subracesPerPage = 10;

const MyStuffSubraces = () => {
	const router = useRouter();
	const [subraceId, setSubraceId] = useState<string>();
	const [currentPage, setCurrentPage] = useState(1);

	const [subraceResult] = useGetSubraceQuery(subraceId);

	const [subracesResult] = useGetLimitedSubracesQuery({
		limit: subracesPerPage,
		skip: (currentPage - 1) * subracesPerPage
	});

	const handleShowMoreInfoModal = useCallback(({ id }: Item) => {
		setSubraceId(id);
	}, []);

	const handleSubraceEdit = useCallback(() => {
		router.push(`/my-stuff/edit/subraces/${subraceId}`);
	}, [router, subraceId]);

	const handleCloseShowMoreInfoModal = useCallback(() => {
		setSubraceId(undefined);
	}, []);

	const numberOfPages = useMemo(
		() =>
			Math.max((subracesResult.data?.subraces.count ?? 0) / subracesPerPage),
		[subracesResult.data?.subraces.count]
	);

	const handlePrevPageClick = useCallback(() => {
		setCurrentPage(prev => prev - 1);
	}, []);

	const handleNextPageClick = useCallback(() => {
		setCurrentPage(prev => prev + 1);
	}, []);

	const items = useMemo(
		() =>
			subracesResult.data?.subraces.subraces.map(subrace => (
				<ItemDisplay
					item={subrace}
					onMoreInfoClick={handleShowMoreInfoModal}
					key={subrace.id}
				/>
			)),
		[subracesResult.data?.subraces.subraces, handleShowMoreInfoModal]
	);

	const { descriptors, otherDescriptors } = useMemo(
		() => getSubraceDescriptors(subraceResult.data?.subrace),
		[subraceResult.data?.subrace]
	);

	return subracesResult.fetching ? (
		<LoadingPageContent />
	) : (
		<>
			<MyStuffGeneric
				currentPage={currentPage}
				handleNextClick={handleNextPageClick}
				handlePreviousClick={handlePrevPageClick}
				numberOfPages={numberOfPages}
				title="Subraces"
				items={items}
			/>
			<MoreInfoModal
				iconId="custom-race"
				onAction={handleSubraceEdit}
				onClose={handleCloseShowMoreInfoModal}
				show={!!subraceId}
				title={subraceResult.data?.subrace.name ?? ''}
				descriptors={descriptors}
				otherDescriptors={otherDescriptors}
				mode="edit"
				loading={subraceResult.fetching}
				error={!!subraceResult.error}
			/>
		</>
	);
};

export default MyStuffSubraces;
