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
import { DailyEventObject } from '@daily-co/daily-js';

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
}

// @ts-ignore
export const VCSContext = createContext<ContextValue>(null);

export const VCSProvider = ({ children }: VCSType) => {
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [playbackUrl, setPlaybackUrl] = useState('');
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
    setPlaybackUrl('');
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
    if (!callFrame || !isLiveStreaming) return;

    updateStreaming();
  }, [callFrame, isLiveStreaming, params, updateStreaming]);

  useEffect(() => {
    if (!callFrame || !isRecording) return;

    updateRecording();
  }, [callFrame, isRecording, params, updateRecording]);

  useEffect(() => {
    if (!callFrame) return;

    callFrame.on('recording-started', () => setIsRecording(true));
    callFrame.on('recording-stopped', () => setIsRecording(false));
    callFrame.on('recording-error', (event: DailyEventObject) => {
      console.error('Recording error', event.errorMsg);
      setIsRecording(false);
      setRecordingErrorMsg(event.errorMsg);
    });

    callFrame.on('live-streaming-started', () => setIsLiveStreaming(true));
    callFrame.on('live-streaming-stopped', () => setIsLiveStreaming(false));
    callFrame.on('live-streaming-error', (event: DailyEventObject) => {
      console.error('Streaming error', event.errorMsg);
      setIsLiveStreaming(false);
      setErrorMsg(event.errorMsg);
    });

    return () => {
      callFrame.off('recording-started', () => setIsRecording(true));
      callFrame.off('recording-stopped', () => setIsRecording(false));
      callFrame.off('recording-error', (event: DailyEventObject) => {
        console.error('Recording error', event.errorMsg);
        setIsRecording(false);
        setRecordingErrorMsg(event.errorMsg);
      });

      callFrame.off('live-streaming-started', () => setIsLiveStreaming(true));
      callFrame.off('live-streaming-stopped', () => setIsLiveStreaming(false));
      callFrame.off('live-streaming-error', (event: DailyEventObject) => {
        console.error('Streaming error', event.errorMsg);
        setIsLiveStreaming(false);
        setErrorMsg(event.errorMsg);
      });
    };
  }, [callFrame]);

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
      }}
    >
      {children}
    </VCSContext.Provider>
  );
};

export const useVCS = () => useContext(VCSContext);
