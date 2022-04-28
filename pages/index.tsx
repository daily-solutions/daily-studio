import React from 'react';
import Head from 'next/head';
import Header from '../components/header';
import { Button, Heading, Pane, Text } from 'evergreen-ui';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();

  const startCall = async () => {
    const options = { method: 'POST' };
    const res = await fetch('/api/createRoom', options);
    const { name } = await res.json();
    await router.push(`/${name}`);
  };

  return (
    <Pane>
      <Head>
        <title>Breakout Rooms</title>
        <meta name="description" content="Breakout Rooms" />
      </Head>

      <Header />
      <Pane
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="90vh"
        gap="15px"
      >
        <Heading size={900}>VCS Studio</Heading>
        <Text size={500}>
          Demo a breakout room UX built using Daily video APIs.
        </Text>

        <Pane display="flex" padding={10}>
          <Button appearance="primary" onClick={startCall}>
            Start call
          </Button>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default Index;
