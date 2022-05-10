import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Heading,
  Pane,
  SelectField,
  Spinner,
  Popover,
  Menu,
  useTheme,
  Position,
} from 'evergreen-ui';
import Tile from './Tile';
import TrayButton from '../Tray/TrayButton';
import {
  useDaily,
  useDevices,
  useLocalParticipant,
} from '@daily-co/daily-react-hooks';
import { ReactComponent as IconCameraOn } from '../../icons/camera-on-md.svg';
import { ReactComponent as IconCameraOff } from '../../icons/camera-off-md.svg';
import { ReactComponent as IconMicOn } from '../../icons/mic-on-md.svg';
import { ReactComponent as IconMicOff } from '../../icons/mic-off-md.svg';
import { ReactComponent as IconMore } from '../../icons/more-md.svg';
import SetupUsername from './SetupUsername';
import { useCall } from '../../contexts/CallProvider';
import { useWindowSize } from '../../hooks/useWindowSize';

const Haircheck = () => {
  const theme = useTheme();
  const daily = useDaily();
  const { join, state } = useCall();
  const localParticipant = useLocalParticipant();
  const { width } = useWindowSize();
  const [step, setStep] = useState<'username' | 'lobby'>('username');

  const [popover, setPopOver] = useState(false);

  console.log(popover);

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

  useEffect(() => {
    if (localParticipant?.user_name) setStep('lobby');
  }, [localParticipant?.user_name]);

  const handleTrayButtonClick = (camera: boolean = false) => {
    if (camera) daily.setLocalVideo(!localParticipant?.video);
    else daily.setLocalAudio(!localParticipant?.audio);
  };

  const hairCheckWidth = useMemo(() => {
    if (width > 1550) return '25vw';
    else if (width > 1200) return '35vw';
    else if (width > 750 && width <= 1200) return '50vw';
    else return '70vw';
  }, [width]);

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!localParticipant || state !== 'lobby') return <Spinner />;
  return (
    <Pane width={hairCheckWidth}>
      {step === 'username' ? (
        <SetupUsername setStep={setStep} />
      ) : (
        <Card elevation={1} background="white">
          <Pane
            padding={24}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Heading size={700} flexGrow={4}>
              Are you ready to join?
            </Heading>
            <Button appearance="primary" onClick={join}>
              Join
            </Button>
          </Pane>
          <Tile sessionId={localParticipant?.session_id} />
          <Pane padding={2}>
            <Pane display="flex" alignItems="center">
              <Pane flex={1}>
                <TrayButton
                  label={localParticipant?.video ? 'Turn off' : 'Turn on'}
                  Icon={localParticipant?.video ? IconCameraOn : IconCameraOff}
                  onClick={() => handleTrayButtonClick(true)}
                  muted={!localParticipant?.video}
                />
                <TrayButton
                  label={localParticipant?.audio ? 'Mute' : 'Unmute'}
                  Icon={localParticipant?.audio ? IconMicOn : IconMicOff}
                  onClick={() => handleTrayButtonClick()}
                  muted={!localParticipant?.audio}
                />
              </Pane>
              <Pane>
                <Popover
                  isShown={popover}
                  position={Position.TOP_RIGHT}
                  content={
                    <Menu>
                      <Menu.Group>
                        <Menu.Item
                          onSelect={() => {
                            setStep('username');
                            setPopOver(false);
                          }}
                        >
                          Change name
                        </Menu.Item>
                      </Menu.Group>
                    </Menu>
                  }
                >
                  <Pane>
                    <TrayButton
                      label="More"
                      Icon={IconMore}
                      onClick={() => setPopOver(!popover)}
                    />
                  </Pane>
                </Popover>
              </Pane>
            </Pane>
          </Pane>
          {!isMobile && (
            <>
              <hr
                style={{ border: `0.5px solid ${theme.colors.border.muted}` }}
              />
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
                    <option
                      key={mic.device.deviceId}
                      value={mic.device.deviceId}
                    >
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
            </>
          )}
        </Card>
      )}
    </Pane>
  );
};

export default Haircheck;
