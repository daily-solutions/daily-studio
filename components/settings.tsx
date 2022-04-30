import React, { Dispatch, SetStateAction } from 'react';
import { Button, Pane } from 'evergreen-ui';
import ViewSettings from './settings/view';
import { useVCS } from '../contexts/VCSProvider';
import MiscSettings from './settings/misc';
import TextSettings from './settings/text';
import ImageSettings from './settings/image';
import AssetSettings from './settings/assets';
import PeopleSettings from './settings/people';
import ToastSettings from './settings/toast';

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
        return <ToastSettings />;
      case 'misc':
        return <MiscSettings />;
      case 'assets':
        return <AssetSettings />;
      case 'people':
        return <PeopleSettings />;
    }
  };

  return (
    <Pane padding={0} height="90vh">
      <Pane display="flex" flexDirection="column" height="100%">
        <Pane padding={24} overflow="auto" height="95%" maxHeight="95%">
          {renderActiveTab()}
        </Pane>

        <Pane
          padding={10}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={10}
        >
          <Button
            appearance="primary"
            intent={isLiveStreaming ? 'danger' : 'none'}
            marginTop={10}
            width="50%"
            onClick={handleStreamToggle}
          >
            {isLiveStreaming ? 'Stop Live Streaming' : 'Start Live Stream'}
          </Button>
          <Button
            intent={isRecording ? 'danger' : 'none'}
            marginTop={10}
            onClick={handleRecordingToggle}
            width="50%"
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default Settings;
