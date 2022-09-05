import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../../../components/MainContent/MainContent';

const CharacterIndex = () => {
	return (
		<MainContent>
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

export default CharacterIndex;
