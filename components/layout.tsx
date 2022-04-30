import React, { useState } from 'react';
import { Pane } from 'evergreen-ui';
import { useCall } from '../contexts/CallProvider';
import Settings from './settings';
import RtmpUrlModal from './rtmpUrlModal';
import Sidebar from './sidebar';
import LayoutHeader from './PaneHeader';

const Layout = () => {
  const { callRef } = useCall();
  const [show, setShow] = useState(false);

  return (
    <Pane display="flex" height="100vh" overflow="hidden">
      <Pane width="75%">
        <div ref={callRef} />
      </Pane>
      <Pane width="25%" background="tint1" minHeight="100vh">
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
      <RtmpUrlModal isShown={show} setIsShown={setShow} />
    </Pane>
  );
};

export default Layout;
