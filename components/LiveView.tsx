import React from 'react';
import Tray from './Tray';
import { Pane } from 'evergreen-ui';
import dynamic from 'next/dynamic';

const Player = dynamic(() => import('./Player'), {
  ssr: false,
});

const LiveView = () => {
  return (
    <Pane>
      <Player />
      <Tray />
    </Pane>
  );
};

export default LiveView;
