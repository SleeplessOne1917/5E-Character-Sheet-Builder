'use client';

import { usePathname, useRouter } from 'next/navigation';

import LoadingPageContent from '../../../../components/LoadingPageContent/LoadingPageContent';
import { useEffect } from 'react';

const CharacterIndex = () => {
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		router.replace(`${pathname}/race`);
	}, [router, pathname]);

	return <LoadingPageContent />;
};

export default CharacterIndex;
