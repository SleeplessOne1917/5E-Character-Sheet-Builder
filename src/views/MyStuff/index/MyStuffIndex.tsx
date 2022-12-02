'use client';

import { useCallback, useMemo, useState } from 'react';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import { Item } from '../../../types/db/item';
import ItemDisplay from '../../../components/MyStuff/ItemDisplay/ItemDisplay';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import MoreInfoModal from '../../../components/MoreInfoModal/MoreInfoModal';
import Preview from '../../../components/MyStuff/Preview/Preview';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import SpellItemDisplay from '../../../components/MyStuff/SpellItem/SpellItemDisplay';
import SpellMoreInformationModal from '../../../components/Spells/SpellMoreInfoModal/SpellMoreInformationModal';
import classes from './MyStuffIndex.module.css';
import { getRaceDescriptors } from '../../../services/descriptorsHelpers';
import useGetLimitedRacesQuery from '../../../hooks/urql/queries/useGetLimitedRacesQuery';
import useGetLimitedSpellsQuery from '../../../hooks/urql/queries/useGetLimitedSpellsQuery';
import useGetRaceQuery from '../../../hooks/urql/queries/useGetRaceQuery';
import useGetSpellQuery from '../../../hooks/urql/queries/useGetSpellQuery';
import { useRouter } from 'next/navigation';

const MyStuffIndex = () => {
	const router = useRouter();
	const [spellId, setSpellId] = useState<string>();
	const [spellResult] = useGetSpellQuery(spellId);

	const [raceId, setRaceId] = useState<string>();
	const [raceResult] = useGetRaceQuery(raceId);

	const [spellsResult] = useGetLimitedSpellsQuery({ limit: 5 });
	const [racesResult] = useGetLimitedRacesQuery({ limit: 5 });

	const handleSpellMoreInfoClick = useCallback(({ id }: SpellItem) => {
		setSpellId(id);
	}, []);

	const handleSpellMoreInfoClose = useCallback(() => {
		setSpellId(undefined);
	}, []);

	const handleRaceMoreInfoClick = useCallback(({ id }: Item) => {
		setRaceId(id);
	}, []);

	const handleRaceEdit = useCallback(() => {
		router.push(`/my-stuff/edit/races/${raceId}`);
	}, [router, raceId]);

	const handleRaceMoreInfoClose = useCallback(() => {
		setRaceId(undefined);
	}, []);

	const {
		descriptors: raceDescriptors,
		otherDescriptors: raceOtherDescriptors
	} = useMemo(
		() => getRaceDescriptors(raceResult.data?.race),
		[raceResult.data?.race]
	);

	return spellsResult.fetching || racesResult.fetching ? (
		<LoadingPageContent />
	) : (
		<>
			<MainContent testId="my-stuff-index">
				<h1>My Stuff</h1>
				{(spellsResult.data?.spells.spells.length ?? 0) === 0 &&
					(racesResult.data?.races.races.length ?? 0) === 0 && (
						<div className={classes['no-items-container']}>
							<p>
								You haven&apos;t created anything yet. Whenever you create
								anything, it will show up here.
							</p>
							<ArrowLink href="/create" text="Create Something" />
						</div>
					)}
				<div className={classes.previews}>
					{(spellsResult.data?.spells.spells.length ?? 0) > 0 && (
						<Preview
							path="spells"
							title="Spells"
							items={(spellsResult.data?.spells.spells ?? []).map(spell => (
								<SpellItemDisplay
									spell={spell}
									key={spell.id}
									onMoreInfoClick={handleSpellMoreInfoClick}
								/>
							))}
						/>
					)}
					{(racesResult.data?.races.races.length ?? 0) > 0 && (
						<Preview
							path="races"
							title="Races"
							items={(racesResult.data?.races.races ?? []).map(race => (
								<ItemDisplay
									item={race}
									key={race.id}
									onMoreInfoClick={handleRaceMoreInfoClick}
								/>
							))}
						/>
					)}
				</div>
			</MainContent>
			<SpellMoreInformationModal
				show={!!spellId}
				spell={spellResult.data?.spell}
				error={spellResult.error?.message}
				loading={spellResult.fetching}
				onClose={handleSpellMoreInfoClose}
				shouldShowEditAndClasses
			/>
			<MoreInfoModal
				iconId="custom-race"
				onAction={handleRaceEdit}
				onClose={handleRaceMoreInfoClose}
				show={!!raceId}
				title={raceResult.data?.race.name ?? ''}
				error={!!raceResult.error}
				loading={raceResult.fetching}
				mode="edit"
				descriptors={raceDescriptors}
				otherDescriptors={raceOtherDescriptors}
			/>
		</>
	);
};

export default MyStuffIndex;
