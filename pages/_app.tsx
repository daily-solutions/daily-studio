import '../styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script src="/daily_baseline.bundle.js" />
      <Component {...pageProps} />
    </>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
