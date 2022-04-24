import { useEffect, useState } from 'react';

const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		const mediaQuery = window.matchMedia(query);
		setMatches(mediaQuery.matches);
		mediaQuery.addEventListener('change', event => setMatches(event.matches));
	}, []); //eslint-disable-line

	return matches;
};

export default useMediaQuery;
