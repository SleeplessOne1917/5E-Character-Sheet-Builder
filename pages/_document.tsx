import { Head, Html, Main, NextScript } from 'next/document';

const MyDocument = (): JSX.Element => (
	<Html>
		<Head>
			<link
				href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,700;1,400;1,700&family=MedievalSharp&display=swap"
				rel="stylesheet"
			/>
		</Head>
		<body>
			<Main />
			<NextScript />
		</body>
	</Html>
);

export default MyDocument;
