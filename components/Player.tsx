import React, { useEffect } from 'react';
import { Pane } from 'evergreen-ui';
import { useVCS } from '../contexts/VCSProvider';

const Player = () => {
  // @ts-ignore
  const { registerIVSTech, videojs } = window;
  const { playbackUrl } = useVCS();

  useEffect(() => {
    registerIVSTech(videojs);

    const player = videojs(
      'video-player',
      {
        techOrder: ['AmazonIVS'],
      },
      () => {
        console.log('Player is ready to use!');
        player.src(playbackUrl);
      },
    );
    player.fill(false);
  }, [playbackUrl, registerIVSTech, videojs]);

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
