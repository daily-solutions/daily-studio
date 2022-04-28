import React from 'react';
import { CallProvider } from '../contexts/CallProvider';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import { LiveStreamingProvider } from '../contexts/LiveStreamingContext';
import Head from 'next/head';

const Room = () => {
  const router = useRouter();
  const { room } = router.query;

  return (
    <CallProvider roomName={room as string}>
      <LiveStreamingProvider>
        <Head>
          <title>VCS Studio</title>
          <meta
            name="description"
            content="Custom composite a live stream in real-time with Daily Prebuilt & VCS"
          />
        </Head>
        <Layout />
      </LiveStreamingProvider>
    </CallProvider>
  );
};

export default Room;
