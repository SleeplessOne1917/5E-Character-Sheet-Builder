import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';

type MyStuffIndexProps = {
	loading: boolean;
};

const MyStuffIndex = ({ loading }: MyStuffIndexProps) => {
	return (
		<>
			{loading && <LoadingPageContent />}
			{!loading && (
				<MainContent testId="my-stuff-index">
					<h1>My Stuff</h1>
				</MainContent>
			)}
		</>
	);
};

export default MyStuffIndex;
