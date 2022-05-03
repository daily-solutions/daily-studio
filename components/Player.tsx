import React, { useEffect, useRef } from 'react';
import { Pane } from 'evergreen-ui';
import { useVCS } from '../contexts/VCSProvider';

const Player = () => {
  // @ts-ignore
  const { registerIVSTech, registerIVSQualityPlugin, videojs } = window;
  const { playbackUrl } = useVCS();
  const playerRef = useRef(null);

  useEffect(() => {
    registerIVSTech(videojs);
    registerIVSQualityPlugin(videojs);

    if (!playerRef.current) {
      playerRef.current = videojs(
        'video-player',
        {
          techOrder: ['AmazonIVS'],
        },
        () => {
          console.log('Player is ready to use!');
          playerRef.current.src(playbackUrl);
        },
      );
      playerRef.current.fill(false);
      playerRef.current.enableIVSQualityPlugin();
    } else {
      playerRef.current.src(playbackUrl);
      playerRef.current.fill(false);
      playerRef.current.enableIVSQualityPlugin();
    }
  }, [playbackUrl, registerIVSQualityPlugin, registerIVSTech, videojs]);

  return (
    <Pane width="100%" height="90vh">
      <video
        id="video-player"
        className="video-js vjs-16-9 vjs-big-play-centered"
        controls
        autoPlay
        playsInline
        style={{ height: '100%', width: '100%' }}
      />
    </Pane>
  );
};

export default Player;
