import React from 'react';
import Head from 'next/head';
import Header from '../components/header';
import { Button, Heading, Pane, Text } from 'evergreen-ui';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();

  const startCall = async () => {
    const options = { method: 'POST' };
    fetch('/api/createRoom', options)
      .then(res => res.json())
      .then(response => router.push(`/${response.name}`));
  };

  return (
    <Pane>
      <Head>
        <title>VCS Studio</title>
        <meta
          name="description"
          content="Custom composite a live stream in real-time with Daily Prebuilt & VCS"
        />
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
          Custom composite a live stream in real-time with Daily Prebuilt & VCS
        </Text>

        <Pane display="flex" padding={10}>
          <Button appearance="primary" onClick={startCall}>
            Join call
          </Button>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default Index;
