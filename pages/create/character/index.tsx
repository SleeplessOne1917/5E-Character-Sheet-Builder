import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CharacterIndexView from '../../../src/views/create/character/index/CharacterIndex';

const CharacterIndexPage = () => {
	const router = useRouter();

	useEffect(() => {
		router.replace(`${router.asPath}/race`);
	}, [router]);

	return <CharacterIndexView />;
};

export default CharacterIndexPage;
