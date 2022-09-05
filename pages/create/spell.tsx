import { NextPage } from 'next';
import useRedirectLoggedOffUser from '../../src/hooks/useRedirectLoggedOffUser';
import SpellView from '../../src/views/create/spell/Spell';

const SpellPage: NextPage = () => {
	useRedirectLoggedOffUser();

	return <SpellView />;
};

export default SpellPage;
