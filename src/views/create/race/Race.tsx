import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';

type RaceProps = {
	loading: boolean;
};

const Race = ({ loading }: RaceProps) => {
	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
				<MainContent testId="create-race">
					<h1>Create Race</h1>
				</MainContent>
			)}
		</>
	);
};

export default Race;
