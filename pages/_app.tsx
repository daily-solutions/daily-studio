import '../styles/globals.css';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Script from 'next/script';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.14.3/video-js.css"
        rel="stylesheet"
      />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.14.3/video.min.js" />
      <Script src="https://player.live-video.net/1.8.0/amazon-ivs-videojs-tech.min.js" />
      <Script src="https://player.live-video.net/1.8.0/amazon-ivs-quality-plugin.min.js" />
      <Component {...pageProps} />
    </>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});
