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

type LiveStreamingType = {
  children: React.ReactNode;
};

interface ContextValue {
  isLiveStreaming: boolean;
  errorMsg: string;
  params: any;
  setParams: Dispatch<SetStateAction<any>>;
  rtmpUrl: string;
  setRtmpUrl: Dispatch<SetStateAction<string>>;
  startStreaming: () => void;
  updateStreaming: () => void;
  stopStreaming: () => void;
}

// @ts-ignore
export const LiveStreamingContext = createContext<ContextValue>(null);

export const LiveStreamingProvider = ({ children }: LiveStreamingType) => {
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const { callFrame } = useCall();
  const [params, setParams] = useState({
    mode: 'dominant',
  });

  const startStreaming = useCallback(() => {
    callFrame.startLiveStreaming({
      rtmpUrl,
      layout: {
        // @ts-ignore
        preset: 'custom',
        composition_id: 'daily:baseline',
        composition_params: { ...params },
      },
    });
  }, [callFrame, params, rtmpUrl]);

  const updateStreaming = useCallback(() => {
    callFrame.updateLiveStreaming({
      layout: {
        // @ts-ignore
        preset: 'custom',
        composition_params: { ...params },
      },
    });
  }, [callFrame, params]);

  const stopStreaming = () => callFrame.stopLiveStreaming();

  useEffect(() => {
    if (!callFrame || !isLiveStreaming) return;

    updateStreaming();
  }, [callFrame, isLiveStreaming, params, updateStreaming]);

  useEffect(() => {
    if (!callFrame) return;

    callFrame.on('live-streaming-started', () => setIsLiveStreaming(true));
    callFrame.on('live-streaming-stopped', () => setIsLiveStreaming(false));
    callFrame.on('live-streaming-error', (event: DailyEventObject) => {
      setIsLiveStreaming(false);
      setErrorMsg(event.errorMsg);
    });
  }, [callFrame]);

  return (
    <LiveStreamingContext.Provider
      value={{
        isLiveStreaming,
        errorMsg,
        params,
        setParams,
        rtmpUrl,
        setRtmpUrl,
        startStreaming,
        updateStreaming,
        stopStreaming,
      }}
    >
      {children}
    </LiveStreamingContext.Provider>
  );
};

export const useLiveStreaming = () => useContext(LiveStreamingContext);
