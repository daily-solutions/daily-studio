import React, { useEffect } from 'react';
import {
  Button,
  Card,
  Heading,
  IconButton,
  Pane,
  SelectField,
  Spinner,
  useTheme,
} from 'evergreen-ui';
import Tile from './Tile';
import {
  useDaily,
  useDevices,
  useLocalParticipant,
} from '@daily-co/daily-react-hooks';
import { ReactComponent as IconCameraOn } from '../../icons/camera-on-md.svg';
import { ReactComponent as IconCameraOff } from '../../icons/camera-off-md.svg';
import { ReactComponent as IconMicOn } from '../../icons/mic-on-md.svg';
import { ReactComponent as IconMicOff } from '../../icons/mic-off-md.svg';
import SetupUsername from './SetupUsername';
import { useCall } from '../../contexts/CallProvider';

const Haircheck = () => {
  const theme = useTheme();
  const daily = useDaily();
  const { join } = useCall();
  const localParticipant = useLocalParticipant();

  const {
    cameras,
    microphones,
    speakers,
    setCamera,
    setMicrophone,
    setSpeaker,
  } = useDevices();

  useEffect(() => {
    if (!daily) return;
    daily.startCamera();
  }, [daily]);

  const handleTrayButtonClick = (camera: boolean = false) => {
    if (camera) daily.setLocalVideo(!localParticipant?.video);
    else daily.setLocalAudio(!localParticipant?.audio);
  };

  const joinCall = () => join();

  if (!localParticipant) return <Spinner />;

  return (
    <Pane>
      {!localParticipant?.user_name ? (
        <SetupUsername />
      ) : (
        <Card elevation={1} width="25vw" background="white">
          <Pane
            padding={24}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Heading size={700} flexGrow={4}>
              Ready to join?
            </Heading>
            <Button appearance="primary" onClick={joinCall}>
              Join
            </Button>
          </Pane>
          <Tile sessionId={localParticipant?.session_id} />
          <Pane padding={8}>
            <Pane display="flex" alignItems="center" gap={16}>
              <Pane flex={1}>
                <IconButton
                  icon={localParticipant?.video ? IconCameraOn : IconCameraOff}
                  intent={localParticipant?.video ? 'none' : 'danger'}
                  onClick={() => handleTrayButtonClick(true)}
                  appearance="minimal"
                  size="large"
                />
                <IconButton
                  icon={localParticipant?.audio ? IconMicOn : IconMicOff}
                  intent={localParticipant?.audio ? 'none' : 'danger'}
                  onClick={() => handleTrayButtonClick(false)}
                  appearance="minimal"
                  size="large"
                />
              </Pane>
            </Pane>
          </Pane>
          <hr style={{ border: `0.5px solid ${theme.colors.border.muted}` }} />
          <Pane padding={16}>
            <SelectField
              label="Camera"
              onChange={e => setCamera(e.target.value)}
            >
              {cameras.map(camera => (
                <option
                  key={camera.device.deviceId}
                  value={camera.device.deviceId}
                >
                  {camera.device.label}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Microphone"
              onChange={e => setMicrophone(e.target.value)}
            >
              {microphones.map(mic => (
                <option key={mic.device.deviceId} value={mic.device.deviceId}>
                  {mic.device.label}
                </option>
              ))}
            </SelectField>
            <SelectField
              label="Speaker"
              onChange={e => setSpeaker(e.target.value)}
            >
              {speakers.map(speaker => (
                <option
                  key={speaker.device.deviceId}
                  value={speaker.device.deviceId}
                >
                  {speaker.device.label}
                </option>
              ))}
            </SelectField>
          </Pane>
        </Card>
      )}
    </Pane>
  );
};

export default Haircheck;
