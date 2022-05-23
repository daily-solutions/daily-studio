import React, { useMemo, useEffect, useRef } from 'react';
import { Pane, Strong, Heading } from 'evergreen-ui';
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
    };
  }, [isChrome92, videoEl, videoTrack, videoTrack?.id]);

  return (
    <Pane height="100%" width="100%">
      {!videoState.isOff ? (
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
            bottom={2}
            left={0}
            padding={4}
            backgroundColor="rgba(0, 0, 0, 0.6)"
            overflow="hidden"
          >
            <Strong size={300} color="white">
              {participant.user_name}
            </Strong>
          </Pane>
        </Pane>
      ) : (
        <Pane
          width="100%"
          height="25vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          border="muted"
          background="tint1"
        >
          <Heading size={700}>{participant.user_name}</Heading>
        </Pane>
      )}
    </Pane>
  );
};

export default Tile;
