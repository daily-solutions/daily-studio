import React from 'react';
import Tray from './Tray';
import { Pane } from 'evergreen-ui';
import Player from './Player';

const LiveView = () => {
  return (
    <Pane>
      <Player />
      <Tray />
    </Pane>
  );
};

export default LiveView;
