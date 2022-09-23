import { useEffect, useState } from 'react';

const useMediaQuery = (query: string): boolean => {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		const mediaQuery = window.matchMedia(query);
		setMatches(mediaQuery.matches);
		const mediaListener = (event: MediaQueryListEvent): void =>
			setMatches(event.matches);
		mediaQuery.addEventListener('change', mediaListener);

		return () => {
			mediaQuery.removeEventListener('change', mediaListener);
		};
	}, [query]);

	return matches;
};

export default useMediaQuery;
