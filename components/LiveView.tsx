import React, { Dispatch, SetStateAction } from 'react';
import Tray from './Tray';
import { Pane, Heading, Button, Paragraph, Image } from 'evergreen-ui';
import dynamic from 'next/dynamic';
import { useVCS } from '../contexts/VCSProvider';
import FormMaker from './Form';
import { layoutParams } from '../constants/layoutParams';
import { AudioTracks } from './Audio/AudioTracks';

const DailyVCSOutput = dynamic(() => import('./DailyVCSOutput'), {
  ssr: false,
});

type Props = {
  compositionReadyCb: any;
  viewportSize: { w: number; h: number };
  startStream: Dispatch<SetStateAction<boolean>>;
};

const LiveView = ({ compositionReadyCb, viewportSize, startStream }: Props) => {
  const {
    isLiveStreaming,
    isRecording,
    startRecording,
    stopRecording,
    stopStreaming,
  } = useVCS();

  const handleStreamToggle = () => {
    if (isLiveStreaming) stopStreaming();
    else startStream(true);
  };

  const handleRecordingToggle = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <Pane>
      <Pane
        display="flex"
        padding={16}
        background="white"
        alignItems="center"
        borderBottom="muted"
      >
        <Image src="/daily-logo.svg" alt="Daily's Logo" />
        <Pane
          flex={1}
          alignItems="flex-start"
          display="flex"
          flexDirection="column"
          marginLeft={15}
        >
          <Heading size={600}>VCS Studio</Heading>
          <Paragraph color="muted" size={400}>
            Custom composite a live stream in real-time with Daily
          </Paragraph>
        </Pane>
        <Pane>
          <Button
            marginRight={16}
            intent={isRecording ? 'danger' : 'none'}
            onClick={handleRecordingToggle}
          >
            {isRecording ? 'Stop Recording' : 'Record'}
          </Button>
          <Button
            marginRight={16}
            appearance="primary"
            intent={isLiveStreaming ? 'danger' : 'none'}
            onClick={handleStreamToggle}
          >
            {isLiveStreaming ? 'Stop Live' : 'Go Live'}
          </Button>
        </Pane>
      </Pane>
      <Pane width={viewportSize.w} height={viewportSize.h} position="relative">
        <Pane height={viewportSize.h} backgroundColor="black">
          <DailyVCSOutput
            compositionReadyCb={compositionReadyCb}
            viewportSize={viewportSize}
          />
        </Pane>
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          padding={16}
        >
          <Tray />
          <FormMaker fields={layoutParams} />
        </Pane>
      </Pane>
      <AudioTracks />
    </Pane>
  );
};

export default LiveView;
