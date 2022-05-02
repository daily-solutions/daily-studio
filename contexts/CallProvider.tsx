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
import { DailyProvider } from '@daily-co/daily-react-hooks';

const CALL_OPTIONS = {
  showLeaveButton: true,
  iframeStyle: {
    height: '100vh',
    width: '100%',
    aspectRatio: '16 / 9',
    border: '0',
  },
};

type CallProviderType = {
  children: React.ReactNode;
  roomName: string;
};

interface ContextValue {
  callRef: any;
  callFrame: DailyCall | null;
  setCallFrame: Dispatch<SetStateAction<DailyCall | null>>;
  participants: DailyParticipant[];
  joinedMeeting: boolean;
}

// @ts-ignore
export const CallContext = createContext<ContextValue>(null);

export const CallProvider = ({ children, roomName }: CallProviderType) => {
  const callRef = useRef<HTMLDivElement>(null);
  const [callFrame, setCallFrame] = useState<DailyCall | null>(null);
  const [joined, setJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [token, setToken] = useState(null);

  const handleLeftMeeting = useCallback(() => {
    if (callFrame) callFrame.destroy();
    setCallFrame(null);
  }, [callFrame]);

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
    if (callFrame) return;

    const joinCall = async (newCallFrame: DailyCall) => {
      const domain = process.env.NEXT_PUBLIC_DAILY_DOMAIN;

      const url: string = `https://${domain}.daily.co/${roomName}`;
      newCallFrame.join({ url, token });

      newCallFrame.on('joined-meeting', () => setJoined(true));
      newCallFrame.on('left-meeting', handleLeftMeeting);
      return () => {
        newCallFrame.off('joined-meeting', () => setJoined(true));
        newCallFrame.off('left-meeting', handleLeftMeeting);
      };
    };

    if (roomName && token) {
      const newCallFrame: DailyCall = DailyIframe.createFrame(
        callRef?.current as unknown as HTMLElement,
        CALL_OPTIONS,
      );
      setCallFrame(newCallFrame as DailyCall);
      joinCall(newCallFrame);
    }
  }, [callFrame, handleLeftMeeting, roomName, token]);

  useEffect(() => {
    if (!callFrame) return;

    const events: string[] = [
      'joined-meeting',
      'participant-joined',
      'participant-updated',
      'participant-left',
    ];

    const handleParticipantsState = () =>
      setParticipants(Object.values(callFrame.participants()));

    handleParticipantsState();
    events.map((event: string) => {
      callFrame.on(event as DailyEvent, handleParticipantsState);
    });

    return () => {
      events.map((event: string) => {
        callFrame.off(event as DailyEvent, handleParticipantsState);
      });
    };
  }, [callFrame]);

  return useMemo(
    () => (
      <CallContext.Provider
        value={{
          callRef,
          callFrame,
          setCallFrame,
          participants,
          joinedMeeting: joined,
        }}
      >
        {/*
          // @ts-ignore*/}
        <DailyProvider callObject={callFrame}>{children}</DailyProvider>
      </CallContext.Provider>
    ),
    [callFrame, children, joined, participants],
  );
};

export const useCall = () => useContext(CallContext);
