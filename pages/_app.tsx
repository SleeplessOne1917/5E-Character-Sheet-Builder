import "../styles/globals.css";

import type { AppProps } from "next/app";
import Header from "../src/components/Header";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
