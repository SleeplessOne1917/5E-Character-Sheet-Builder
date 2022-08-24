import '../styles/globals.css';

import { useAppDispatch, useAppSelector } from '../src/hooks/reduxHooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { AppProps } from 'next/app';
import Footer from '../src/components/Footer/Footer';
import Head from 'next/head';
import Header from '../src/components/Header/Header';
import Image from 'next/image';
import MobileNav from '../src/components/MobileNav/MobileNav';
import { Provider as ReduxProvider } from 'react-redux';
import SectionBar from '../src/components/character-creation/SectionBar/SectionBar';
import ToastContainer from '../src/components/Toast/ToastContainer';
import { Provider as UrqlProvider } from 'urql';
import client from '../src/graphql/client';
import { fetchLoggedInUsername } from '../src/redux/features/viewer';
import useMediaQuery from '../src/hooks/useMediaQuery';
import { useRouter } from 'next/router';
import { useStore } from '../src/redux/store';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const { pathname } = useRouter();
	const dispatch = useAppDispatch();
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');
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

	useEffect(() => {
		dispatch(fetchLoggedInUsername());
	}, [dispatch]);

	const closeMobileNav = useCallback(
		() => setIsMobileNavOpen(false),
		[setIsMobileNavOpen]
	);

	const toggleMobileNav = useCallback(
		() => setIsMobileNavOpen(prevState => !prevState),
		[setIsMobileNavOpen]
	);

	useEffect(() => {
		if (isMediumOrLarger) {
			closeMobileNav();
		}
	}, [isMediumOrLarger, closeMobileNav]);

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
		<UrqlProvider value={client}>
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
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
				<meta name="msapplication-TileColor" content="#f7ce65" />
				<meta name="theme-color" content="#ffffff" />
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
			<div className="app">
				{pathname.includes('create') && (
					<SectionBar hasSpellcasting={hasSpellcasting} />
				)}
				<MobileNav isOpen={isMobileNavOpen} onClickLink={closeMobileNav} />
				<Component {...pageProps} />
				<ToastContainer />
			</div>
			<Footer />
		</UrqlProvider>
	);
}

const WrappedApp = (props: AppProps) => {
	const store = useStore();

	return (
		<ReduxProvider store={store}>
			<MyApp {...props} />
		</ReduxProvider>
	);
};

export default WrappedApp;
