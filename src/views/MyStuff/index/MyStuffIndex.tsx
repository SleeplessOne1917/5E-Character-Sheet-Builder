'use client';

import { Spell, SpellItem } from '../../../types/characterSheetBuilderAPI';
import { useCallback, useEffect, useState } from 'react';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import Preview from '../../../components/MyStuff/Preview/Preview';
import SpellItemDisplay from '../../../components/MyStuff/SpellItem/SpellItemDisplay';
import SpellMoreInformationModal from '../../../components/Spells/SpellMoreInfoModal/SpellMoreInformationModal';
import classes from './MyStuffIndex.module.css';
import useGetLimitedSpellsQuery from '../../../hooks/urql/queries/useGetLimitedSpellsQuery';
import useGetSpellQuery from '../../../hooks/urql/queries/useGetSpellQuery';

const MyStuffIndex = () => {
	const [spellId, setSpellId] = useState<string>();
	const [selectedSpell, setSelectedSpell] = useState<Spell>();

	const [spellResult] = useGetSpellQuery(spellId);

	const [spellsResult] = useGetLimitedSpellsQuery({ limit: 5 });

	useEffect(() => {
		if (spellId && !(spellResult.fetching || spellResult.error)) {
			setSelectedSpell(spellResult.data?.spell);
		}
	}, [spellId, spellResult.fetching, spellResult.error, spellResult.data]);

	const handleSpellMoreInfoClick = useCallback(({ id }: SpellItem) => {
		setSpellId(id);
	}, []);

	const handleSpellMoreInfoClose = useCallback(() => {
		setSelectedSpell(undefined);
		setSpellId(undefined);
	}, []);

	return spellsResult.fetching ? (
		<LoadingPageContent />
	) : (
		<>
			<MainContent testId="my-stuff-index">
				<h1>My Stuff</h1>
				{(spellsResult.data?.spells.length ?? 0) === 0 && (
					<div className={classes['no-items-container']}>
						<p>
							You haven&apos;t created anything yet. Whenever you create
							anything, it will show up here.
						</p>
						<ArrowLink href="/create" text="Create Something" />
					</div>
				)}
				<div className={classes.previews}>
					{(spellsResult.data?.spells.length ?? 0) > 0 && (
						<Preview
							path="spells"
							title="Spells"
							items={(spellsResult.data?.spells ?? []).map(spell => (
								<SpellItemDisplay
									spell={spell}
									key={spell.id}
									onMoreInfoClick={handleSpellMoreInfoClick}
								/>
							))}
						/>
					)}
				</div>
			</MainContent>
			<SpellMoreInformationModal
				show={!!spellId}
				spell={selectedSpell}
				error={spellResult.error?.message}
				loading={spellResult.fetching}
				onClose={handleSpellMoreInfoClose}
				shouldShowEditAndClasses
			/>
		</>
	);
};

export default MyStuffIndex;
