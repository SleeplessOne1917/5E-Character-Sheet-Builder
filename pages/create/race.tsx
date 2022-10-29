import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';
import RaceView from '../../src/views/create/race/Race';

const RacePage = () => {
	const { loading } = useRedirectLoggedOffUser();

	return <RaceView loading={loading} />;
};

export default RacePage;
