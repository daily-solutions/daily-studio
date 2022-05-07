import React from 'react';
import Tray from './Tray';
import { Pane } from 'evergreen-ui';
import dynamic from 'next/dynamic';

const DailyVCSOutput = dynamic(() => import('./DailyVCSOutput'), {
  ssr: false,
});

const LiveView = (props: any) => {
  return (
    <Pane background="black">
      <DailyVCSOutput {...props} />
    </Pane>
  );
};

export default LiveView;
