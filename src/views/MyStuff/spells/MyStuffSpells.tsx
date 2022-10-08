import { useCallback, useState } from 'react';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
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

const MyStuffSpells = ({ loading }: MyStuffSpellsProps) => {
	const [spellsResult, _] = useQuery<{
		spells: { spells: Spell[]; count: number };
	}>({
		query: GET_SPELLS,
		variables: { limit: 50 }
	});

	const [selectedSpell, setSelectedSpell] = useState<Spell>();

	const handleShowMoreInfoModal = useCallback((spell: Spell) => {
		setSelectedSpell(spell);
	}, []);

	const handleCloseShowMoreInfoModal = useCallback(() => {
		setSelectedSpell(undefined);
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
					<div>
						{spellsResult.data.spells.spells.map(spell => (
							<SpellItem
								spell={spell}
								onMoreInfoClick={handleShowMoreInfoModal}
								key={spell.id}
							/>
						))}
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
