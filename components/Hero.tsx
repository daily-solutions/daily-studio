import React, { Dispatch, SetStateAction } from 'react';
import Head from 'next/head';
import { Button, Card, Heading, Pane, Text } from 'evergreen-ui';
import Header from './Header';
import { useWindowSize } from '../hooks/useWindowSize';

type Props = {
  roomName: string;
  setToken: Dispatch<SetStateAction<string>>;
};

const Hero = ({ roomName, setToken }: Props) => {
  const { width } = useWindowSize();

  const join = (owner: boolean = false) => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        isOwner: owner,
        roomName,
      }),
    };
    fetch('/api/createToken', options)
      .then(rt => rt.json())
      .then(resToken => setToken(resToken.token));
  };

  return (
    <Pane>
      <Head>
        <title>VCS Studio</title>
        <meta name="description" content="Breakout Rooms" />
      </Head>

      <Pane height="100vh" width="100vw">
        <Header />
        <Pane
          display="flex"
          width="100%"
          height="90%"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Heading size={900} marginY={5}>
            VCS Studio
          </Heading>
          <Text marginY={5}>
            Custom composite a live stream in real-time with Daily
          </Text>
          <Pane display={width < 630 ? 'initial' : 'flex'} gap={15}>
            <Card
              padding={20}
              paddingBottom={5}
              width={302}
              height={232}
              border="1px solid #C8D1DC"
              borderRadius={8}
              marginY={24}
              position="relative"
            >
              <Pane
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                marginBottom={10}
              >
                <Heading>Enter as producer</Heading>
              </Pane>
              <Text lineHeight={1.5}>
                Join call in new tab as a meeting owner. You can configure
                layouts and the stream settings.
              </Text>
              <Pane position="absolute" bottom={20}>
                <Button appearance="primary" onClick={() => join(true)}>
                  Join as producer
                </Button>
              </Pane>
            </Card>

            <Card
              padding={20}
              paddingBottom={5}
              width={302}
              height={232}
              border="1px solid #C8D1DC"
              borderRadius={8}
              marginY={24}
              position="relative"
            >
              <Pane
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                marginBottom={10}
              >
                <Heading>Enter as viewer</Heading>
              </Pane>
              <Pane marginBottom={4}>
                <Text color="red">Add an owner to the room </Text>
                <Text color="muted">
                  prior to adding additional participants.
                </Text>
              </Pane>
              <Text lineHeight={1.5}>
                Select this option to join from the perspective of a
                participant.
              </Text>
              <Pane position="absolute" bottom={20}>
                <Button onClick={() => join()}>Join as participant</Button>
              </Pane>
            </Card>
          </Pane>
          <Text color="muted">
            We recommend joining as an producer in one tab, and adding
            participants via another browser.
          </Text>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default Hero;
