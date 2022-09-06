import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import MainContent from '../MainContent/MainContent';

const LoadingPageContent = () => {
	return (
		<MainContent testId="loading-page-content">
			<h1>Loading...</h1>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%'
				}}
			>
				<LoadingSpinner />
			</div>
		</MainContent>
	);
};

export default LoadingPageContent;
