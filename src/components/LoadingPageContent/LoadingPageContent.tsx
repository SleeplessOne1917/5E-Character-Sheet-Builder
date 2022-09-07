import { useEffect, useState } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import MainContent from '../MainContent/MainContent';

const LoadingPageContent = () => {
	const [dots, setDots] = useState('');

	useEffect(() => {
		const dotsInterval = setInterval(() => {
			setDots(prev => {
				if (prev.length === 3) {
					return '';
				} else {
					return prev + '.';
				}
			});
		}, 1000);

		return () => {
			clearInterval(dotsInterval);
		};
	}, []);

	return (
		<MainContent testId="loading-page-content">
			<h1>Loading{dots}</h1>
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
