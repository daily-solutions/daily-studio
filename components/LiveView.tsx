import React from 'react';
import Tray from './Tray';
import { Pane } from 'evergreen-ui';
import dynamic from 'next/dynamic';

const DailyVCSOutput = dynamic(() => import('./DailyVCSOutput'), {
  ssr: false,
});

const LiveView = (props: any) => {
  return (
    <Pane display="flex">
      <Pane background="black" width={props.viewportSize.w}>
        <DailyVCSOutput {...props} />
      </Pane>
      <Pane position="absolute" bottom={20} left="30%" display="flex">
        <Tray />
      </Pane>
    </Pane>
  );
};

export default LiveView;
