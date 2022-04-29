import React, { Dispatch, SetStateAction } from 'react';
import { Button, Text, Pane } from 'evergreen-ui';
import ViewSettings from './settings/view';
import { useVCS } from '../contexts/VCSProvider';
import MiscSettings from './settings/misc';
import TextSettings from './settings/text';
import ImageSettings from './settings/image';

type Props = {
  startStreaming: Dispatch<SetStateAction<boolean>>;
};

const Settings = ({ startStreaming }: Props) => {
  const {
    isLiveStreaming,
    isRecording,
    stopStreaming,
    startRecording,
    stopRecording,
    activeTab,
  } = useVCS();

  const handleStreamToggle = () => {
    if (isLiveStreaming) stopStreaming();
    else startStreaming(true);
  };

  const handleRecordingToggle = () => {
    if (isRecording) stopRecording();
    else startRecording();
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
          justifyContent="center"
          alignItems="center"
          position="fixed"
          bottom={0}
          gap={10}
        >
          <Button
            appearance="primary"
            intent={isLiveStreaming ? 'danger' : 'none'}
            marginTop={10}
            onClick={handleStreamToggle}
          >
            {isLiveStreaming ? 'Stop Live Streaming' : 'Start Live Stream'}
          </Button>
          <Button
            intent={isRecording ? 'danger' : 'none'}
            marginTop={10}
            onClick={handleRecordingToggle}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default Settings;
