import { AbilityItem, SrdItem, SrdProficiencyItem } from '../../../types/srd';
import { SpellItem } from '../../../types/characterSheetBuilderAPI';
import { useMemo, useState } from 'react';

import GET_SPELLS from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpells';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import RaceForm from '../../../components/RaceForm/RaceForm';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { useQuery } from 'urql';

type RaceProps = {
	loading: boolean;
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	srdSpells: SpellItem[];
};

const Race = ({
	loading,
	abilities,
	languages,
	proficiencies,
	srdSpells
}: RaceProps) => {
	const editingRace = useAppSelector(state => state.editingRace);
	const [initialValues, setInitialValues] = useState(editingRace);
	const [spellsResult] = useQuery<{ spells: { spells: SpellItem[] } }>({
		query: GET_SPELLS
	});

	const spells = useMemo(
		() =>
			srdSpells.concat(spellsResult.data?.spells.spells ?? []).sort((a, b) => {
				const val = a.level - b.level;

				return val === 0 ? a.name.localeCompare(b.name) : val;
			}),
		[srdSpells, spellsResult.data?.spells.spells]
	);

	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
				<MainContent testId="create-race">
					<h1>Create Race</h1>
					<RaceForm
						abilities={abilities}
						handleFormikSubmit={async () => Promise.resolve()}
						initialValues={initialValues}
						shouldUseReduxStore
						languages={languages}
						proficiencies={proficiencies}
						spells={spells}
					/>
				</MainContent>
			)}
		</>
	);
};

export default Race;
