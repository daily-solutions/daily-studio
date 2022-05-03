import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useCall } from './CallProvider';
import { DailyEvent, DailyEventObject } from '@daily-co/daily-js';

type VCSType = {
  children: React.ReactNode;
};

type Tab = 'view' | 'text' | 'image' | 'toast' | 'assets' | 'people';

type LayoutParticipants = {
  showAllParticipants: boolean;
  participants: string[];
};

interface ContextValue {
  isLiveStreaming: boolean;
  isRecording: boolean;
  liveStreamingErrorMsg: string;
  recordingErrorMsg: string;
  params: any;
  setParams: Dispatch<SetStateAction<any>>;
  rtmpUrl: string;
  setRtmpUrl: Dispatch<SetStateAction<string>>;
  startRecording: () => void;
  updateRecording: () => void;
  stopRecording: () => void;
  startStreaming: () => void;
  updateStreaming: () => void;
  stopStreaming: () => void;
  activeTab: Tab;
  setActiveTab: Dispatch<SetStateAction<Tab>>;
  assets: { [key: string]: string };
  setAssets: Dispatch<SetStateAction<{ [key: string]: string }>>;
  layoutParticipants: LayoutParticipants;
  setLayoutParticipants: Dispatch<SetStateAction<LayoutParticipants>>;
  playbackUrl: string;
  setPlaybackUrl: Dispatch<SetStateAction<string>>;
  showPlayer: boolean;
}

// @ts-ignore
export const VCSContext = createContext<ContextValue>(null);

export const VCSProvider = ({ children }: VCSType) => {
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [playbackUrl, setPlaybackUrl] = useState('');
  const [showPlayer, setShowPlayer] = useState(false);
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const [recordingErrorMsg, setRecordingErrorMsg] = useState(null);

  const [activeTab, setActiveTab] = useState<Tab>('view');

  const { callFrame } = useCall();
  const [params, setParams] = useState({
    mode: 'grid',
    'toast.icon.assetName': 'party-popper_1f389.png',
    'image.assetName': 'overlay.png',
  });
  const [assets, setAssets] = useState({});
  const [layoutParticipants, setLayoutParticipants] =
    useState<LayoutParticipants>({
      showAllParticipants: true,
      participants: [],
    });

  // live-streaming functions
  const startStreaming = useCallback(() => {
    const lp = layoutParticipants.showAllParticipants
      ? ['*']
      : [...layoutParticipants.participants];

    callFrame.startLiveStreaming({
      rtmpUrl,
      layout: {
        // @ts-ignore
        preset: 'custom',
        composition_id: 'daily:baseline',
        composition_params: { ...params },
        participants: {
          video: lp,
          audio: lp,
        },
      },
    });
  }, [
    callFrame,
    layoutParticipants.participants,
    layoutParticipants.showAllParticipants,
    params,
    rtmpUrl,
  ]);

  const updateStreaming = useCallback(() => {
    const lp = layoutParticipants.showAllParticipants
      ? ['*']
      : [...layoutParticipants.participants];

    callFrame.updateLiveStreaming({
      layout: {
        // @ts-ignore
        preset: 'custom',
        composition_params: { ...params },
        participants: {
          video: lp,
          audio: lp,
        },
      },
    });
  }, [
    callFrame,
    layoutParticipants.participants,
    layoutParticipants.showAllParticipants,
    params,
  ]);

  const stopStreaming = () => {
    setShowPlayer(false);
    callFrame.stopLiveStreaming();
  };

  // recording functions.

  const startRecording = useCallback(() => {
    const lp = layoutParticipants.showAllParticipants
      ? ['*']
      : [...layoutParticipants.participants];

    callFrame.startRecording({
      layout: {
        // @ts-ignore
        preset: 'custom',
        composition_id: 'daily:baseline',
        composition_params: { ...params },
        participants: {
          video: lp,
          audio: lp,
        },
      },
    });
  }, [
    callFrame,
    layoutParticipants.participants,
    layoutParticipants.showAllParticipants,
    params,
  ]);

  const updateRecording = useCallback(() => {
    const lp = layoutParticipants.showAllParticipants
      ? ['*']
      : [...layoutParticipants.participants];

    callFrame.updateRecording({
      layout: {
        // @ts-ignore
        preset: 'custom',
        composition_params: { ...params },
        participants: {
          video: lp,
          audio: lp,
        },
      },
    });
  }, [
    callFrame,
    layoutParticipants.participants,
    layoutParticipants.showAllParticipants,
    params,
  ]);

  const stopRecording = () => callFrame.stopRecording();

  useEffect(() => {
    if (!callFrame) return;

    if (isLiveStreaming) updateStreaming();
    if (isRecording) updateRecording();
  }, [
    callFrame,
    isLiveStreaming,
    isRecording,
    params,
    updateRecording,
    updateStreaming,
  ]);

  useEffect(() => {
    if (isLiveStreaming && playbackUrl !== '') setShowPlayer(true);
  }, [isLiveStreaming, playbackUrl]);

  const handleEvents = useCallback(
    (event: DailyEventObject) => {
      switch (event.action) {
        case 'live-streaming-started':
          setIsLiveStreaming(true);
          if (playbackUrl !== '') setShowPlayer(true);
          break;
        case 'live-streaming-stopped':
          setIsLiveStreaming(false);
          setShowPlayer(false);
          break;
        case 'live-streaming-error':
          console.error('Streaming error - ' + event.errorMsg);
          setIsLiveStreaming(false);
          setShowPlayer(false);
          setErrorMsg(event.errorMsg);
          break;
        case 'recording-started':
          setIsRecording(true);
          break;
        case 'recording-stopped':
          setIsRecording(false);
          break;
        case 'recording-error':
          console.error('Recording error - ' + event.errorMsg);
          setIsRecording(false);
          setRecordingErrorMsg(event.errorMsg);
          break;
        default:
          break;
      }
    },
    [playbackUrl],
  );

  const handleLiveStreamError = useCallback((event: DailyEventObject) => {
    console.error('Streaming error', event.errorMsg);
    setIsLiveStreaming(false);
    setErrorMsg(event.errorMsg);
    setShowPlayer(false);
  }, []);

  useEffect(() => {
    if (!callFrame) return;

    const events = [
      'recording-started',
      'recording-stopped',
      'recording-error',
      'live-streaming-started',
      'live-streaming-stopped',
      'live-streaming-error',
    ];

    events.map((event: string) => {
      callFrame.on(event as DailyEvent, handleEvents);
    });
    return () => {
      events.map((event: string) => {
        callFrame.off(event as DailyEvent, handleEvents);
      });
    };
  }, [callFrame, handleEvents]);

  return (
    <VCSContext.Provider
      value={{
        isLiveStreaming,
        isRecording,
        liveStreamingErrorMsg: errorMsg,
        recordingErrorMsg,
        params,
        setParams,
        rtmpUrl,
        setRtmpUrl,
        startRecording,
        updateRecording,
        stopRecording,
        startStreaming,
        updateStreaming,
        stopStreaming,
        activeTab,
        setActiveTab,
        assets,
        setAssets,
        layoutParticipants,
        setLayoutParticipants,
        playbackUrl,
        setPlaybackUrl,
        showPlayer,
      }}
    >
      {children}
    </VCSContext.Provider>
  );
};

export const useVCS = () => useContext(VCSContext);
