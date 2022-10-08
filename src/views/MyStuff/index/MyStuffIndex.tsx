import { useCallback, useState } from 'react';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import GET_SPELLS from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpells';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import Preview from '../../../components/MyStuff/Preview/Preview';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import SpellItem from '../../../components/MyStuff/SpellItem/SpellItem';
import SpellMoreInformationModal from '../../../components/SpellMoreInfoModal/SpellMoreInformationModal';
import classes from './MyStuffIndex.module.css';
import { useQuery } from 'urql';

type MyStuffIndexProps = {
	loading: boolean;
};

const MyStuffIndex = ({ loading }: MyStuffIndexProps) => {
	const [spellsResult, _] = useQuery<{ spells: Spell[] }>({
		query: GET_SPELLS,
		variables: { limit: 5 }
	});

	const [selectedSpell, setSelectedSpell] = useState<Spell>();

	const isLoading = loading || spellsResult.fetching;

	const handleSpellMoreInfoClick = useCallback((spell: Spell) => {
		setSelectedSpell(spell);
	}, []);

	const handleSpellMoreInfoClose = useCallback(() => {
		setSelectedSpell(undefined);
	}, []);

	return (
		<>
			{isLoading && <LoadingPageContent />}
			{!isLoading && (
				<>
					<MainContent testId="my-stuff-index">
						<h1>My Stuff</h1>
						{(!spellsResult.data || spellsResult.data.spells.length === 0) && (
							<div className={classes['no-items-container']}>
								<p>
									You haven&apos;t created anything yet. Whenever you create
									anything, it will show up here.
								</p>
								<ArrowLink href="/create" text="Create Something" />
							</div>
						)}
						<div className={classes.previews}>
							{spellsResult.data && spellsResult.data.spells.length > 0 && (
								<Preview
									path="spells"
									title="Spells"
									items={
										spellsResult.data?.spells.map(spell => (
											<SpellItem
												spell={spell}
												key={spell.id}
												onMoreInfoClick={handleSpellMoreInfoClick}
											/>
										)) ?? []
									}
								/>
							)}
						</div>
					</MainContent>
					<SpellMoreInformationModal
						show={!!selectedSpell}
						spell={selectedSpell}
						onClose={handleSpellMoreInfoClose}
					/>
				</>
			)}
		</>
	);
};

export default MyStuffIndex;
