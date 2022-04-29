import React, { Dispatch, SetStateAction } from 'react';
import { Button, Text, Pane } from 'evergreen-ui';
import ViewSettings from './settings/view';
import { useLiveStreaming } from '../contexts/LiveStreamingContext';
import MiscSettings from './settings/misc';
import TextSettings from './settings/text';
import ImageSettings from './settings/image';

type Props = {
  startStreaming: Dispatch<SetStateAction<boolean>>;
};

const Settings = ({ startStreaming }: Props) => {
  const { isLiveStreaming, stopStreaming, activeTab } = useLiveStreaming();

  const handleStreamToggle = () => {
    if (isLiveStreaming) stopStreaming();
    else startStreaming(true);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'view':
        return <ViewSettings />;
      case 'text':
        return <TextSettings />;
      case 'image':
        return <ImageSettings />;
      case 'toast':
        return <Text>Coming soon..</Text>;
      case 'misc':
        return <MiscSettings />;
    }
  };

  return (
    <Pane overflow="auto">
      <Pane padding={10} display="flex" flexDirection="column">
        {renderActiveTab()}

        <Pane
          padding={10}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          position="fixed"
          bottom={0}
          width="15vw"
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
