import React, { useState } from 'react';
import { Pane, Text, Button, TextInputField } from 'evergreen-ui';
import { videoParams } from '../../constants/videoParams';
import { useVCS } from '../../contexts/VCSProvider';
import { useRMP } from '../../hooks/useRMP';
import { useCall } from '../../contexts/CallProvider';

const VideoSettings = () => {
  const { callObject } = useCall();

  const onMediaPlayerStarted = e => {
    console.log('my cool handler', e);
    setPlaybackState('playing');
    setPlaybackId(e.session_id);
  };
  const onMediaPlayerUpdated = e => {
    console.log('updated e is', e);
    switch (e.remoteMediaPlayerState.state) {
      case 'paused':
        setPlaybackState('paused');
        break;
      case 'playing':
        setPlaybackState('playing');
        break;
    }
    setPlaybackState('paused');
  };
  const onMediaPlayerStopped = e => {
    setPlaybackState('stopped');
  };
  const onMediaPlayerError = e => {
    setPlaybackState('stopped');
  };

  const {
    isPlaying,
    startRemoteMediaPlayer,
    updateRemoteMediaPlayer,
    stopRemoteMediaPlayer,
  } = useRMP({
    onMediaPlayerStarted,
    onMediaPlayerUpdated,
    onMediaPlayerStopped,
    onMediaPlayerError,
  });

  const [videoURL, setVideoURL] = useState(
    'https://cdn.glitch.global/19d94244-6ec6-4f25-8081-f17f3afe6209/demuxed-2021.mp4',
  );
  const [playbackState, setPlaybackState] = useState('stopped');
  const [playbackId, setPlaybackId] = useState(null);
  // can't figure out the hook isplaying thing

  const handleStart = () => {
    startRemoteMediaPlayer({ url: videoURL });
  };
  const handlePause = () => {
    updateRemoteMediaPlayer({
      session_id: playbackId,
      settings: { state: 'pause' },
    });
  };
  const handleStop = () => {
    stopRemoteMediaPlayer(playbackId);
  };

  const handleResume = () => {
    updateRemoteMediaPlayer({
      session_id: playbackId,
      settings: { state: 'play' },
    });
  };

  const handleQueue = () => {
    // Start playback, then pause it almost immediately, so it's ready to go once you unpause. Wait 100ms after start to prevent a gstreamer freak-out
    callObject.once('remote-media-player-started', e => {
      setTimeout(() => {
        updateRemoteMediaPlayer({
          session_id: e.session_id,
          settings: { state: 'pause' },
        });
      }, 100);
    });
    startRemoteMediaPlayer({ url: videoURL });
  };

  const renderFields = () => {
    switch (playbackState) {
      case 'playing':
        return (
          <>
            <Button
              onClick={handlePause}
              appearance="primary"
              width="100%"
              marginBottom={20}>
              Pause Playback
            </Button>
            <Button
              onClick={handleStop}
              appearance="secondary"
              width="100%"
              marginBottom={20}>
              Stop Playback
            </Button>
          </>
        );
      case 'paused':
        return (
          <>
            <Button
              onClick={handleResume}
              appearance="primary"
              width="100%"
              marginBottom={20}>
              Resume Playback
            </Button>
            <Button
              onClick={handleStop}
              appearance="secondary"
              width="100%"
              marginBottom={20}>
              Stop Playback
            </Button>
          </>
        );
      case 'stopped':
        return (
          <>
            <TextInputField
              name="url"
              label="Video URL"
              value={videoURL}
              onChange={e => setVideoURL(e.target.value)}
            />
            <Button
              onClick={handleStart}
              appearance="primary"
              width="100%"
              marginBottom={20}>
              Start Playback
            </Button>
            <Button
              onClick={handleQueue}
              appearance="primary"
              width="100%"
              marginBottom={20}>
              Queue Playback
            </Button>
          </>
        );
    }
  };

  return <Pane>{renderFields()}</Pane>;
};

export default VideoSettings;
