import React, { useState } from 'react';
import { Pane } from 'evergreen-ui';
import { useCall } from '../contexts/CallProvider';
import Settings from './settings';
import RtmpUrlModal from './rtmpUrlModal';

const Layout = () => {
  const { callRef } = useCall();
  const [show, setShow] = useState(false);

  return (
    <Pane display="flex" height="100vh" overflowX="hidden">
      <Pane width="80%" overflow="hidden" position="fixed">
        <div ref={callRef} />
      </Pane>
      <Pane
        width="20%"
        background="tint1"
        position="absolute"
        right={0}
        minHeight="100vh"
      >
        <Settings startStreaming={setShow} />
      </Pane>
      <RtmpUrlModal isShown={show} setIsShown={setShow} />
    </Pane>
  );
};

export default Layout;
