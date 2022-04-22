import "../styles/globals.css";

import type { AppProps } from "next/app";
import Header from "../src/components/Header/Header";
import Image from "next/image";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
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
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
