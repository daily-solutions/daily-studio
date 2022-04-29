import React, { useState } from 'react';
import { Heading, Pane } from 'evergreen-ui';
import { useCall } from '../contexts/CallProvider';
import Settings from './settings';
import RtmpUrlModal from './rtmpUrlModal';
import Sidebar from './sidebar';

const Layout = () => {
  const { callRef } = useCall();
  const [show, setShow] = useState(false);

  return (
    <Pane display="flex" height="100vh" overflow="hidden">
      <Pane width="75%" position="fixed">
        <div ref={callRef} />
      </Pane>
      <Pane
        width="25%"
        background="tint1"
        position="absolute"
        right={0}
        minHeight="100vh"
      >
        <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
          <Pane padding={16} textAlign="center">
            <Heading size={600}>VCS Studio</Heading>
          </Pane>
        </Pane>
        <Pane width="100%" display="flex">
          <Pane width="80%">
            <Settings startStreaming={setShow} />
          </Pane>
          <Pane width="20%" background="white" padding={10} minHeight="100vh">
            <Sidebar />
          </Pane>
        </Pane>
      </Pane>
      <RtmpUrlModal isShown={show} setIsShown={setShow} />
    </Pane>
  );
};

export default Layout;
