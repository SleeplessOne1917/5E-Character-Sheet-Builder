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
import { trpc } from '../../../common/trpcNext';

const MyStuffIndex = () => {
	const [spellId, setSpellId] = useState<string>();
	const [selectedSpell, setSelectedSpell] = useState<Spell>();

	const spellsResult = trpc.spells.spells.useQuery();

	const spellResult = trpc.spells.spell.useQuery(spellId as string, {
		enabled: !!spellId
	});

	useEffect(() => {
		if (spellId && spellResult.isSuccess) {
			setSelectedSpell(spellResult.data);
		}
	}, [spellId, spellResult.isSuccess, spellResult.data]);

	const handleSpellMoreInfoClick = useCallback(({ id }: SpellItem) => {
		setSpellId(id);
	}, []);

	const handleSpellMoreInfoClose = useCallback(() => {
		setSelectedSpell(undefined);
		setSpellId(undefined);
	}, []);

	const spells = spellsResult.data?.spells ?? [];

	return (
		<>
			{spellsResult.isLoading ? (
				<LoadingPageContent />
			) : (
				<>
					<MainContent testId="my-stuff-index">
						<h1>My Stuff</h1>
						{spells.length === 0 && (
							<div className={classes['no-items-container']}>
								<p>
									You haven&apos;t created anything yet. Whenever you create
									anything, it will show up here.
								</p>
								<ArrowLink href="/create" text="Create Something" />
							</div>
						)}
						<div className={classes.previews}>
							{spells.length > 0 && (
								<Preview
									path="spells"
									title="Spells"
									items={spells.map(spell => (
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
						loading={spellResult.isLoading}
						onClose={handleSpellMoreInfoClose}
						shouldShowEditAndClasses
					/>
				</>
			)}
		</>
	);
};

export default MyStuffIndex;
