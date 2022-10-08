import '../styles/globals.css';
import '../styles/fonts.css';

import { useAppSelector } from '../src/hooks/reduxHooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { AppProps } from 'next/app';
import Footer from '../src/components/Footer/Footer';
import Head from 'next/head';
import Header from '../src/components/Header/Header';
import Image from 'next/image';
import LoadingPageContent from '../src/components/LoadingPageContent/LoadingPageContent';
import MobileNav from '../src/components/MobileNav/MobileNav';
import { Provider as ReduxProvider } from 'react-redux';
import SectionBar from '../src/components/Create/Character/SectionBar/SectionBar';
import ToastContainer from '../src/components/Toast/ToastContainer';
import { Provider as UrqlProvider } from 'urql';
import useLogInAlreadyLoggedIn from '../src/hooks/useLogInAlreadyLoggedIn';
import useMediaQuery from '../src/hooks/useMediaQuery';
import { useStore } from '../src/redux/store';
import { useUrqlClient } from '../src/graphql/client';

type MyAppProps = {
	loadingStore: boolean;
	loadingClient: boolean;
};

const MyApp = ({
	Component,
	pageProps,
	router,
	loadingStore,
	loadingClient
}: AppProps & MyAppProps): JSX.Element => {
	const { pathname } = router;
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const isLargeOrLarger = useMediaQuery('(min-width: 1024px)');
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

	useLogInAlreadyLoggedIn(loadingClient);

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
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#930c10" />
				<meta name="msapplication-TileColor" content="#f7ce65" />
				<meta name="theme-color" content="#fffebd" />
			</Head>
			<Image
				src="/images/character-sheet-with-dice.jpg"
				alt="Background image"
				layout="fill"
				style={{ zIndex: -50 }}
				priority
			/>
			<Header
				onMenuIconClick={toggleMobileNav}
				onLogoIconClick={closeMobileNav}
			/>
			<div id="app">
				{pathname.includes('create/character') && (
					<SectionBar hasSpellcasting={hasSpellcasting} />
				)}
				<MobileNav isOpen={isMobileNavOpen} onClickLink={closeMobileNav} />
				{loadingStore || loadingClient ? (
					<LoadingPageContent />
				) : (
					<Component {...pageProps} />
				)}
				<ToastContainer />
			</div>
			<Footer />
		</>
	);
};

const WrappedApp = (props: AppProps) => {
	const { store, loading } = useStore();
	const { client, loading: urqlLoading } = useUrqlClient();

	return (
		<ReduxProvider store={store}>
			<UrqlProvider value={client}>
				<MyApp {...props} loadingStore={loading} loadingClient={urqlLoading} />
			</UrqlProvider>
		</ReduxProvider>
	);
};

export default WrappedApp;
