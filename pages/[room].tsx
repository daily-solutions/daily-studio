import React, { useMemo, useState, useEffect } from 'react';
import { CallProvider } from '../contexts/CallProvider';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { VCSProvider } from '../contexts/VCSProvider';
import Head from 'next/head';
import Hero from '../components/Hero';

const Room = () => {
  const router = useRouter();
  const { room } = router.query;
  const [token, setToken] = useState(null);

  const isReady = useMemo(() => !!room && !!token, [room, token]);

  useEffect(() => {
    console.log('calling my effect');
    const options = {
      method: 'POST',
      body: JSON.stringify({
        isOwner: true,
        room,
      }),
    };
    fetch('/api/createToken', options)
      .then(rt => rt.json())
      .then(resToken => {
        setToken(resToken.token);
      });
  }, []);

  if (!isReady) return <Hero roomName={room as string} setToken={setToken} />;

  return (
    <CallProvider roomName={room as string} token={token as string}>
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
