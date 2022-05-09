import React, { useMemo, useEffect, useRef } from 'react';
import { Pane, PersonIcon, EmptyState, Text } from 'evergreen-ui';
import { useMediaTrack, useParticipant } from '@daily-co/daily-react-hooks';
import Bowser from 'bowser';

type Props = {
  sessionId: string;
  isScreen?: boolean;
};

const Tile = ({ sessionId, isScreen = false }: Props) => {
  const participant = useParticipant(sessionId);
  const videoEl = useRef<HTMLVideoElement>(null);

  const videoState = useMediaTrack(
    sessionId,
    isScreen ? 'screenVideo' : 'video',
  );
  const videoTrack = useMemo(
    () => videoState.persistentTrack,
    [videoState.persistentTrack],
  );

  const isChrome92 = useMemo(() => {
    const { browser, platform, os } = Bowser.parse(navigator.userAgent);
    return (
      browser.name === 'Chrome' &&
      parseInt(browser.version, 10) >= 92 &&
      (platform.type === 'desktop' || os.name === 'Android')
    );
  }, []);

  useEffect(() => {
    const video = videoEl.current;
    if (!video || !videoTrack) return;
    video.srcObject = new MediaStream([videoTrack]);
    if (isChrome92) video.load();
    return () => {
      video.srcObject = null;
      if (isChrome92) video.load();
    };
  }, [isChrome92, videoEl, videoTrack, videoTrack?.id]);

  return (
    <Pane height="100%" width="100%">
      {videoTrack ? (
        <Pane position="relative">
          <video
            autoPlay
            muted
            playsInline
            ref={videoEl}
            width="100%"
            height="100%"
            style={{ transform: 'scale(-1, 1)' }}
          />
          <Pane
            position="absolute"
            bottom={4}
            left={0}
            padding={8}
            backgroundColor="rgba(0, 0, 0, 0.6)"
            overflow="hidden"
          >
            <Text color="white">{participant.user_name}</Text>
          </Pane>
        </Pane>
      ) : (
        <Pane width="100%" height="100%">
          <EmptyState
            background="dark"
            title={participant.user_name}
            orientation="vertical"
            icon={<PersonIcon color="#C1C4D6" />}
            iconBgColor="#EDEFF5"
          />
        </Pane>
      )}
    </Pane>
  );
};

Tile.displayName = 'Tile';

export default Tile;
