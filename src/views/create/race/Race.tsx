import { useState } from 'react';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import RaceForm from '../../../components/RaceForm/RaceForm';
import { useAppSelector } from '../../../hooks/reduxHooks';
import { AbilityItem, SrdItem } from '../../../types/srd';

type RaceProps = {
	loading: boolean;
	abilities: AbilityItem[];
	languages: SrdItem[];
};

const Race = ({ loading, abilities, languages }: RaceProps) => {
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
					/>
				</MainContent>
			)}
		</>
	);
};

export default Race;
