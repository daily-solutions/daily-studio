import React, { Dispatch, SetStateAction } from 'react';
import { Button, Heading, Pane } from 'evergreen-ui';
import ViewSettings from './settings/view';
import { useLiveStreaming } from '../contexts/LiveStreamingContext';
import MiscSettings from './settings/misc';
import TextSettings from './settings/text';

type Props = {
  startStreaming: Dispatch<SetStateAction<boolean>>;
};

const Settings = ({ startStreaming }: Props) => {
  const { isLiveStreaming, stopStreaming } = useLiveStreaming();

  const handleStreamToggle = () => {
    if (isLiveStreaming) stopStreaming();
    else startStreaming(true);
  };

  return (
    <Pane>
      <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
        <Pane padding={16} textAlign="center">
          <Heading size={600}>VCS Studio</Heading>
        </Pane>
      </Pane>
      <Pane
        padding={10}
        display="flex"
        flexDirection="column"
        overflowY="scroll"
      >
        <ViewSettings />
        <TextSettings />
        <MiscSettings />

        <Pane
          padding={10}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          bottom={0}
          width="19vw"
        >
          <Button
            appearance="primary"
            intent={isLiveStreaming ? 'danger' : 'none'}
            size="large"
            width="100%"
            marginTop={10}
            onClick={handleStreamToggle}
          >
            {isLiveStreaming ? 'Stop Live Streaming' : 'Start Live Stream'}
          </Button>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default Settings;
