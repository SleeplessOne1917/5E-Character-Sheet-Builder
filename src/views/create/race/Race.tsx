import { AbilityItem, SrdItem, SrdProficiencyItem } from '../../../types/srd';

import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import RaceForm from '../../../components/RaceForm/RaceForm';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { useState } from 'react';

type RaceProps = {
	loading: boolean;
	abilities: AbilityItem[];
	languages: SrdItem[];
	proficiencies: SrdProficiencyItem[];
	srdSpells: Spell[];
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
						srdSpells={srdSpells}
					/>
				</MainContent>
			)}
		</>
	);
};

export default Race;
