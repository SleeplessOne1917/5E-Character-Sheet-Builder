'use client';

import {
	PropsWithChildren,
	use,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react';
import { Provider as UrqlProvider, useQuery } from 'urql';

import GET_VIEWER from '../src/graphql/queries/CharacterSheetBuilder/getViewer';
import Header from '../src/components/Header/Header';
import MobileNav from '../src/components/MobileNav/MobileNav';
import { Provider as ReduxProvider } from 'react-redux';
import SectionBar from '../src/components/Create/Character/SectionBar/SectionBar';
import ToastContainer from '../src/components/Toast/ToastContainer';
import client from '../src/graphql/client';
import { getStore } from '../src/redux/store';
import { useAppSelector } from '../src/hooks/reduxHooks';
import useMediaQuery from '../src/hooks/useMediaQuery';
import { usePathname } from 'next/navigation';

const storePromise = getStore();

const AppLayout = ({
	children
}: PropsWithChildren<Record<string, unknown>>): JSX.Element => {
	const pathname = usePathname();
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const isLargeOrLarger = useMediaQuery('(min-width: 1024px)');
	const [viewerData] = useQuery<{ viewer: string }>({ query: GET_VIEWER });
	const currentLevel = useAppSelector(
		state => state.editingCharacter.classInfo.level
	);
	const spellcasting = useAppSelector(
		state => state.editingCharacter.classInfo.class?.spellcasting
	);

	const hasSpellcasting = useMemo(
		() => !!spellcasting && currentLevel >= spellcasting.level,
		[spellcasting, currentLevel]
	);

	const closeMobileNav = useCallback(
		() => setIsMobileNavOpen(false),
		[setIsMobileNavOpen]
	);

	const toggleMobileNav = useCallback(
		() => setIsMobileNavOpen(prevState => !prevState),
		[setIsMobileNavOpen]
	);

	useEffect(() => {
		if (isLargeOrLarger) {
			closeMobileNav();
		}
	}, [isLargeOrLarger, closeMobileNav]);

	useEffect(() => {
		let resizeTimer: NodeJS.Timeout;
		const resizeListener = () => {
			document.body.classList.add('resize-animation-stopper');
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(
				() => document.body.classList.remove('resize-animation-stopper'),
				400
			);
		};

		window.addEventListener('resize', resizeListener);

		return () => {
			if (resizeTimer) {
				clearTimeout(resizeTimer);
			}
			window.removeEventListener('resize', resizeListener);
		};
	}, []);

	return (
		<>
			<Header
				onMenuIconClick={toggleMobileNav}
				onLogoIconClick={closeMobileNav}
				username={viewerData.data?.viewer}
			/>
			<div id="app">
				{pathname?.includes('create/character') && (
					<SectionBar hasSpellcasting={hasSpellcasting} />
				)}
				<MobileNav
					isOpen={isMobileNavOpen}
					onClickLink={closeMobileNav}
					username={viewerData.data?.viewer}
				/>
				{children}
				<ToastContainer />
			</div>
		</>
	);
};

const AppLayoutWrapper = ({
	children
}: PropsWithChildren<Record<string, unknown>>) => {
	const store = use(storePromise);

	return (
		<ReduxProvider store={store}>
			<UrqlProvider value={client}>
				<AppLayout>{children}</AppLayout>
			</UrqlProvider>
		</ReduxProvider>
	);
};

export default AppLayoutWrapper;
