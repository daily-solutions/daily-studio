import React, { useState } from 'react';
import { Pane } from 'evergreen-ui';
import { useCall } from '../contexts/CallProvider';
import Settings from './settings';
import RtmpUrlModal from './rtmpUrlModal';
import Sidebar from './sidebar';
import LayoutHeader from './PaneHeader';
import { useWindowSize } from '../hooks/useWindowSize';

const Layout = () => {
  const { callRef, joinedMeeting } = useCall();
  const [show, setShow] = useState(false);
  const { width } = useWindowSize();

  const getCallWidth = () => {
    switch (width) {
      case width >= 1200:
        return 75;
      case width < 1200:
        return 60;
    }
  };

  return (
    <Pane display="flex" height="100vh" overflow="hidden">
      <Pane width={joinedMeeting ? `${getCallWidth()}%` : '100%'}>
        <div ref={callRef} />
      </Pane>
      {joinedMeeting && (
        <Pane
          width={`${100 - getCallWidth()}%`}
          background="tint1"
          minHeight="100vh"
        >
          <LayoutHeader />
          <Pane width="100%" display="flex">
            <Pane width="85%">
              <Settings startStreaming={setShow} />
            </Pane>
            <Pane
              width="15%"
              background="white"
              padding={10}
              minHeight="100vh"
              display="flex"
              justifyContent="center"
            >
              <Sidebar />
            </Pane>
          </Pane>
        </Pane>
      )}
      <RtmpUrlModal isShown={show} setIsShown={setShow} />
    </Pane>
  );
};

export default Layout;
