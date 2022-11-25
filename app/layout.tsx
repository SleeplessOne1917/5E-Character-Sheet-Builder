import '../styles/globals.css';
import '../styles/fonts.css';

import { PropsWithChildren, use } from 'react';

import AppLayout from './AppLayout';
import Footer from '../src/components/Footer/Footer';
import Image from 'next/image';

const WrappedApp = async ({
	children
}: PropsWithChildren<Record<string, unknown>>) => {
	return (
		<html lang="en">
			<head>
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
				<link
					rel="preload"
					href="/fonts/Alegreya-VariableFont_wght.ttf"
					as="font"
					type="font/ttf"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/Alegreya-Italic-VariableFont_wght.ttf"
					as="font"
					type="font/ttf"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/MedievalSharp-Regular.ttf"
					as="font"
					type="font/ttf"
					crossOrigin="anonymous"
				/>
			</head>
			<body>
				<Image
					src="/images/character-sheet-with-dice.jpg"
					alt="Background image"
					style={{ zIndex: -50 }}
					priority
					fill
				/>
				<AppLayout>{children}</AppLayout>
				<Footer />
			</body>
		</html>
	);
};

export default WrappedApp;
