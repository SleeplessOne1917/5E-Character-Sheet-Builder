import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import MainContent from '../../../components/MainContent/MainContent';

const CreateIndex = () => (
	<MainContent>
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%'
			}}
		>
			<LoadingSpinner />
		</div>
	</MainContent>
);

export default CreateIndex;
