import { Head, Html, Main, NextScript } from 'next/document';

const MyDocument = (): JSX.Element => (
	<Html lang="en-US">
		<Head>
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
		</Head>
		<body>
			<Main />
			<NextScript />
		</body>
	</Html>
);

export default MyDocument;
