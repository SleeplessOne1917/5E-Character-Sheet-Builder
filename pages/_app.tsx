import '../styles/globals.css';

import type { AppProps } from 'next/app';
import Header from '../src/components/Header/Header';
import Image from 'next/image';
import SectionBar from '../src/components/character-creation/SectionBar/SectionBar';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	const { pathname } = useRouter();

	return (
		<>
			<Image
				src="/images/character-sheet-with-dice.jpg"
				alt="Background image"
				layout="fill"
				className="fixed -z-50"
				priority
			/>
			<Header />
			{pathname.includes('create') && <SectionBar />}
			<Component {...pageProps} />
		</>
	);
}

export default MyApp;
