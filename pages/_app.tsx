import '../styles/globals.css';

import { useCallback, useEffect, useState } from 'react';

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
import { store } from '../src/redux/store';
import useMediaQuery from '../src/hooks/useMediaQuery';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const { pathname } = useRouter();
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');

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
		<ReduxProvider store={store}>
			<UrqlProvider value={client}>
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
					<link rel="icon" type="image/ico" href="/favicon.ico" />
				</Head>
				<Image
					src="/images/character-sheet-with-dice.jpg"
					alt="Background image"
					layout="fill"
					className="fixed -z-50"
					priority
				/>
				<Header
					onMenuIconClick={toggleMobileNav}
					onLogoIconClick={closeMobileNav}
				/>
				<div className="app">
					<MobileNav isOpen={isMobileNavOpen} onClickLink={closeMobileNav} />
					{pathname.includes('create') && <SectionBar />}
					<Component {...pageProps} />
					<ToastContainer />
				</div>
				<Footer />
			</UrqlProvider>
		</ReduxProvider>
	);
}

export default MyApp;
