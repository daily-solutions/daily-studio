import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import DailyIframe, {
  DailyCall,
  DailyEvent,
  DailyParticipant,
} from '@daily-co/daily-js';
import {
  DailyProvider,
  useLocalParticipant,
} from '@daily-co/daily-react-hooks';

type CallProviderType = {
  children: React.ReactNode;
  roomName: string;
};

interface ContextValue {
  callObject: DailyCall | null;
  setCallObject: Dispatch<SetStateAction<DailyCall | null>>;
  participants: DailyParticipant[];
  state: string;
  join: () => void;
}

// @ts-ignore
export const CallContext = createContext<ContextValue>(null);

export const CallProvider = ({ children, roomName }: CallProviderType) => {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  const [participants, setParticipants] = useState([]);
  const [token, setToken] = useState(null);
  const [state, setState] = useState('lobby');

  const handleLeftMeeting = useCallback(() => {
    if (callObject) callObject.destroy();
    setCallObject(null);
  }, [callObject]);

  useEffect(() => {
    if (!roomName) return;

    const optionsToken = {
      method: 'POST',
      body: JSON.stringify({
        isOwner: true,
        roomName,
      }),
    };
    fetch('/api/createToken', optionsToken)
      .then(rt => rt.json())
      .then(resToken => setToken(resToken.token));
  }, [roomName]);

  useEffect(() => {
    if (callObject) return;

    const domain = process.env.NEXT_PUBLIC_DAILY_DOMAIN;
    const url: string = `https://${domain}.daily.co/${roomName}`;

    if (roomName && token) {
      const newCallObject: DailyCall = DailyIframe.createCallObject({
        url,
        token,
        dailyConfig: {
          experimentalChromeVideoMuteLightOff: true,
          useDevicePreferenceCookies: true,
        },
      });
      setCallObject(newCallObject as DailyCall);
      newCallObject.preAuth({ url, token });
    }
  }, [callObject, handleLeftMeeting, roomName, token]);

  const join = useCallback(async () => {
    if (!callObject) return;

    setState('joining');
    await callObject.join();
    setState('joined');

    callObject.on('left-meeting', handleLeftMeeting);
    return () => {
      callObject.off('left-meeting', handleLeftMeeting);
    };
  }, [callObject, handleLeftMeeting]);

  useEffect(() => {
    if (!callObject) return;

    const events: string[] = [
      'joined-meeting',
      'participant-joined',
      'participant-updated',
      'participant-left',
    ];

    const handleParticipantsState = () =>
      setParticipants(Object.values(callObject.participants()));

    handleParticipantsState();
    events.map((event: string) => {
      callObject.on(event as DailyEvent, handleParticipantsState);
    });

    return () => {
      events.map((event: string) => {
        callObject.off(event as DailyEvent, handleParticipantsState);
      });
    };
  }, [callObject]);

  return useMemo(
    () => (
      <CallContext.Provider
        value={{
          callObject,
          setCallObject,
          participants,
          state,
          join,
        }}
      >
        {/*
          // @ts-ignore*/}
        <DailyProvider callObject={callObject}>{children}</DailyProvider>
      </CallContext.Provider>
    ),
    [callObject, children, join, participants, state],
  );
};

export const useCall = () => useContext(CallContext);
