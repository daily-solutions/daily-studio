import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Button,
  Card,
  Heading,
  Menu,
  Pane,
  Popover,
  Position,
  SelectField,
  useTheme,
  Strong,
  Paragraph,
} from 'evergreen-ui';
import Tile from './Tile';
import TrayButton from '../Tray/TrayButton';
import { ReactComponent as IconCameraOn } from '../../icons/camera-on-md.svg';
import { ReactComponent as IconCameraOff } from '../../icons/camera-off-md.svg';
import { ReactComponent as IconMicOn } from '../../icons/mic-on-md.svg';
import { ReactComponent as IconMicOff } from '../../icons/mic-off-md.svg';
import { ReactComponent as IconMore } from '../../icons/more-md.svg';
import {
  useDaily,
  useDevices,
  useLocalParticipant,
} from '@daily-co/daily-react-hooks';
import { useCall } from '../../contexts/CallProvider';

type Props = {
  setStep: Dispatch<SetStateAction<'username' | 'lobby'>>;
};

const Setup = ({ setStep }: Props) => {
  const daily = useDaily();
  const theme = useTheme();
  const { join } = useCall();
  const localParticipant = useLocalParticipant();

  useEffect(() => {
    if (!daily) return;
    daily.startCamera();
  }, [daily]);

  const {
    cameras,
    microphones,
    speakers,
    setCamera,
    setMicrophone,
    setSpeaker,
    camState,
    micState,
  } = useDevices();

  const grantedState = useMemo(
    () => camState === 'granted' || micState === 'granted',
    [camState, micState],
  );

  const handleTrayButtonClick = (camera: boolean = false) => {
    if (camera) daily.setLocalVideo(!localParticipant?.video);
    else daily.setLocalAudio(!localParticipant?.audio);
  };

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <Card elevation={1} background="white" border="1px solid #c8d1dc">
      {grantedState && (
        <Pane
          padding={24}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Heading size={500} flexGrow={4}>
            Are you ready to join?
          </Heading>
          <Button appearance="primary" onClick={join}>
            Join
          </Button>
        </Pane>
      )}
      {grantedState ? (
        <Tile sessionId={localParticipant?.session_id} />
      ) : (
        <Pane
          width="100%"
          height="25vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          border="muted"
          background="tint1"
        >
          <Heading size={700}>Allow camera and microphone access</Heading>
          <Paragraph>
            Select “Allow” so that you can use your camera and microphone
          </Paragraph>
        </Pane>
      )}
      <Pane paddingY={4} paddingX={8}>
        <Pane display="flex" alignItems="center">
          <Pane flex={1}>
            <TrayButton
              label={localParticipant?.video ? 'Turn off' : 'Turn on'}
              Icon={localParticipant?.video ? IconCameraOn : IconCameraOff}
              onClick={() => handleTrayButtonClick(true)}
              muted={!localParticipant?.video}
              disabled={!grantedState}
            />
            <TrayButton
              label={localParticipant?.audio ? 'Mute' : 'Unmute'}
              Icon={localParticipant?.audio ? IconMicOn : IconMicOff}
              onClick={() => handleTrayButtonClick()}
              muted={!localParticipant?.audio}
              disabled={!grantedState}
            />
          </Pane>
          <Pane>
            <Popover
              position={Position.TOP_RIGHT}
              content={
                <Menu>
                  <Menu.Group>
                    <Menu.Item
                      onSelect={() => {
                        setStep('username');
                      }}
                    >
                      Change name
                    </Menu.Item>
                  </Menu.Group>
                </Menu>
              }
            >
              <Pane>
                <TrayButton label="More" Icon={IconMore} />
              </Pane>
            </Popover>
          </Pane>
        </Pane>
      </Pane>
      {!isMobile && grantedState && (
        <>
          <hr
            style={{
              border: `0.5px solid ${theme.colors.border.muted}`,
              padding: 0,
              margin: 0,
            }}
          />
          <Pane paddingX={32} paddingTop={8} paddingBottom={16}>
            <SelectField
              label={<Strong size={300}>Camera</Strong>}
              onChange={e => setCamera(e.target.value)}
              marginY={8}
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
              label={<Strong size={300}>Microphone</Strong>}
              onChange={e => setMicrophone(e.target.value)}
              marginY={8}
            >
              {microphones.map(mic => (
                <option key={mic.device.deviceId} value={mic.device.deviceId}>
                  {mic.device.label}
                </option>
              ))}
            </SelectField>
            <SelectField
              label={<Strong size={300}>Speakers</Strong>}
              onChange={e => setSpeaker(e.target.value)}
              marginY={8}
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
        </>
      )}
    </Card>
  );
};

export default Setup;
