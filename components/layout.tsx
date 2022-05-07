import React, {useRef, useState} from 'react';
import { Pane } from 'evergreen-ui';
import { useCall } from '../contexts/CallProvider';
import Settings from './settings';
import RtmpUrlModal from './rtmpUrlModal';
import Sidebar from './sidebar';
import LayoutHeader from './PaneHeader';
import { useWindowSize, useWindowSizeFromVW } from '../hooks/useWindowSize';
import LiveView from "./LiveView";

const Layout = () => {
  const { callRef, joinedMeeting } = useCall();
  const [show, setShow] = useState(false);
  const { width, height } = useWindowSize();
  const localVcsOutputApiRef = useRef();

  const getCallWidth = () => {
    if (width >= 1400) return { call: '75vw', settings: '25vw' };
    else if (width >= 1200 && width < 1400)
      return { call: '70vw', settings: '30vw' };
    else return { call: '60vw', settings: '40vw' };
  };

  const { call: callWidth, settings: settingsWidth } = getCallWidth();
  const w = useWindowSizeFromVW(callWidth);

  return (
    <Pane display="flex" height="100vh" overflow="hidden">
      <Pane width={joinedMeeting ? callWidth : '100vw'}>
        <div
          ref={callRef}
          style={{
            display: joinedMeeting ? 'none' : 'initial',
          }}
        />
        {joinedMeeting && (
          <LiveView
            compositionReadyCb={(vcs: any) =>
              (localVcsOutputApiRef.current = vcs)
            }
            viewportSize={{ w, h: height }}
          />
        )}
      </Pane>
      {joinedMeeting && (
        <Pane width={settingsWidth} background="tint1" minHeight="100vh">
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
