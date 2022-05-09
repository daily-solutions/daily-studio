import React, { useMemo, useState } from 'react';
import { Pane } from 'evergreen-ui';
import { useCall } from '../contexts/CallProvider';
import Settings from './Settings';
import RTMPUrlModal from './RTMPUrlModal';
import Sidebar from './Sidebar';
import LayoutHeader from './Sidebar/PaneHeader';
import { useWindowSize, useVh, useVw } from '../hooks/useWindowSize';
import LiveView from './LiveView';
import { useVCS } from '../contexts/VCSProvider';
import Haircheck from './Haircheck';

const Layout = () => {
  const { state } = useCall();
  const { vcsOutputRef } = useVCS();
  const [show, setShow] = useState(false);
  const { width } = useWindowSize();

  const getCallWidth = () => {
    if (width >= 1400) return { call: '75vw', settings: '25vw' };
    else if (width >= 1200 && width < 1400)
      return { call: '70vw', settings: '30vw' };
    else return { call: '60vw', settings: '40vw' };
  };

  const { call: callWidth, settings: settingsWidth } = getCallWidth();
  const h = useVh('80vh');
  const w = useVw(callWidth);

  const { width: viewWidth, height: viewHeight } = useMemo(() => {
    const [vhw, vhh, vhArea] = [(16 * h) / 9, h, ((16 * h) / 9) * h];
    const [vww, vwh, vwArea] = [w, (9 * w) / 16, ((9 * w) / 16) * w];

    if (vhArea < vwArea) return { width: vhw, height: vhh };
    else return { width: vww, height: vwh };
  }, [w, h]);

  const joinedState = useMemo(() => state === 'joined', [state]);

  return (
    <Pane display="flex" height="100vh" overflow="hidden">
      <Pane width={joinedState ? callWidth : '100vw'}>
        {joinedState ? (
          <Pane
            height="100vh"
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="center"
          >
            <LiveView
              compositionReadyCb={(vcs: any) => (vcsOutputRef.current = vcs)}
              viewportSize={{ w: viewWidth, h: viewHeight }}
              startStream={setShow}
            />
          </Pane>
        ) : (
          <Pane
            display="flex"
            width="100vw"
            height="100vh"
            justifyContent="center"
            alignItems="center"
          >
            <Haircheck />
          </Pane>
        )}
      </Pane>
      {joinedState && (
        <Pane width={settingsWidth} background="tint1" minHeight="100vh">
          <LayoutHeader />
          <Pane width="100%" display="flex">
            <Pane width="85%">
              <Settings />
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
      <RTMPUrlModal isShown={show} setIsShown={setShow} />
    </Pane>
  );
};

export default Layout;
