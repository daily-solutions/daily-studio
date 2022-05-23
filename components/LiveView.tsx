import React, { Dispatch, SetStateAction } from 'react';
import Tray from './Tray';
import { Pane, Heading, Button, Paragraph, Image, Badge } from 'evergreen-ui';
import dynamic from 'next/dynamic';
import { useVCS } from '../contexts/VCSProvider';
import FormMaker from './Form';
import { layoutParams } from '../constants/layoutParams';
import { AudioTracks } from './Audio/AudioTracks';
import TrayButton from './Tray/TrayButton';
import { ReactComponent as IconLeave } from '../icons/leave-md.svg';
import { useCall } from '../contexts/CallProvider';
import { useRouter } from 'next/router';
import { useLocalParticipant } from '@daily-co/daily-react-hooks';

const DailyVCSOutput = dynamic(() => import('./DailyVCSOutput'), {
  ssr: false,
});

type Props = {
  compositionReadyCb: any;
  viewportSize: { w: number; h: number };
  startStream: Dispatch<SetStateAction<boolean>>;
};

const LiveView = ({ compositionReadyCb, viewportSize, startStream }: Props) => {
  const router = useRouter();
  const { callObject } = useCall();
  const {
    isLiveStreaming,
    isRecording,
    startRecording,
    stopRecording,
    stopStreaming,
  } = useVCS();
  const localParticipant = useLocalParticipant();

  const handleStreamToggle = () => {
    if (isLiveStreaming) stopStreaming();
    else startStream(true);
  };

  const handleRecordingToggle = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const onLeave = () => {
    callObject.leave();
    router.push('/left');
  };

  return (
    <Pane>
      <Pane
        display="flex"
        padding={16}
        background="white"
        alignItems="center"
        justifyContent="center"
        borderBottom="muted"
      >
        <Image src="/daily-logo.svg" alt="Daily's Logo" />
        <Pane
          flex={1}
          alignItems="center"
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
          {localParticipant?.owner ? (
            <>
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
            </>
          ) : (
            <>
              {isRecording && <Badge color="red">Recording</Badge>}
              {isLiveStreaming && <Badge color="orange">Live Streaming</Badge>}
            </>
          )}
        </Pane>
      </Pane>
      <Pane width={viewportSize.w} height={viewportSize.h}>
        <Pane height={viewportSize.h} backgroundColor="black">
          <DailyVCSOutput
            compositionReadyCb={compositionReadyCb}
            viewportSize={viewportSize}
          />
        </Pane>
        <Pane
          display="flex"
          flex={1}
          justifyContent="space-between"
          alignItems="center"
          padding={16}
          bottom={10}
        >
          <Tray />
          {localParticipant?.owner && <FormMaker fields={layoutParams} />}
          <TrayButton label="Leave" Icon={IconLeave} onClick={onLeave} />
        </Pane>
      </Pane>
      <AudioTracks />
    </Pane>
  );
};

export default LiveView;
