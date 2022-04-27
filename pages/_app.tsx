import '../styles/globals.css';

import { Provider as UrqlProvider, createClient } from 'urql';
import { useEffect, useState } from 'react';

import type { AppProps } from 'next/app';
import Footer from '../src/components/Footer/Footer';
import Head from 'next/head';
import Header from '../src/components/Header/Header';
import Image from 'next/image';
import MobileNav from '../src/components/MobileNav/MobileNav';
import SectionBar from '../src/components/character-creation/SectionBar/SectionBar';
import useMediaQuery from '../src/hooks/useMediaQuery';
import { useRouter } from 'next/router';

const client = createClient({
	url: `api/graphql`
});

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const { pathname } = useRouter();
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const isMediumOrLarger = useMediaQuery('(min-width: 768px)');

	useEffect(() => {
		if (isMediumOrLarger) {
			closeMobileNav();
		}
	}, [isMediumOrLarger]);

	const closeMobileNav = (): void => setIsMobileNavOpen(false);

	return (
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
				onMenuIconClick={() => setIsMobileNavOpen(prevState => !prevState)}
				onLogoIconClick={closeMobileNav}
			/>
			<div className="app">
				<MobileNav isOpen={isMobileNavOpen} onClickLink={closeMobileNav} />
				{pathname.includes('create') && <SectionBar />}
				<Component {...pageProps} />
			</div>
			<Footer />
		</UrqlProvider>
	);
}

export default MyApp;
