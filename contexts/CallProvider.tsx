import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import DailyIframe, {
  DailyCall,
  DailyEvent,
  DailyParticipant,
} from '@daily-co/daily-js';

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

  const handleLeftMeeting = useCallback(() => {
    if (callFrame) callFrame.destroy();
    setCallFrame(null);
  }, [callFrame]);

  useEffect(() => {
    if (callFrame) return;

    const joinCall = async () => {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          isOwner: true,
          roomName,
        }),
      };

      const res = await fetch('/api/createToken', options);
      const { token } = await res.json();

      const domain = process.env.NEXT_PUBLIC_DAILY_DOMAIN;

      const newCallFrame: DailyCall = DailyIframe.createFrame(
        callRef?.current as unknown as HTMLElement,
        CALL_OPTIONS,
      );
      setCallFrame(newCallFrame as DailyCall);

      const url: string = `https://${domain}.daily.co/${roomName}`;
      newCallFrame.join({ url, token });

      newCallFrame.on('joined-meeting', () => setJoined(true));
      newCallFrame.on('left-meeting', handleLeftMeeting);
      return () => {
        newCallFrame.off('joined-meeting', () => setJoined(true));
        newCallFrame.off('left-meeting', handleLeftMeeting);
      };
    };

    if (roomName) joinCall();
  }, [callFrame, handleLeftMeeting, roomName]);

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

  return (
    <CallContext.Provider
      value={{
        callRef,
        callFrame,
        setCallFrame,
        participants,
        joinedMeeting: joined,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
