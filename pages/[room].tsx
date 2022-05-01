import React from 'react';
import { CallProvider } from '../contexts/CallProvider';
import { useRouter } from 'next/router';
import Layout from '../components/layout';
import { VCSProvider } from '../contexts/VCSProvider';
import Head from 'next/head';

const Room = () => {
  const router = useRouter();
  const { room } = router.query;

  return (
    <CallProvider roomName={room as string}>
      <VCSProvider>
        <Head>
          <title>VCS Studio</title>
          <meta
            name="description"
            content="Custom composite a live stream in real-time with Daily Prebuilt & VCS"
          />
        </Head>
        <Layout />
      </VCSProvider>
    </CallProvider>
  );
};

export default Room;
