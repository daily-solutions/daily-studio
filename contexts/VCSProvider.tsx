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
import { useCall } from './CallProvider';
import { DailyEvent, DailyEventObject } from '@daily-co/daily-js';
import { getDiff } from '../utils/getDiff';
import { useLocalParticipant } from '@daily-co/daily-react-hooks';

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
  remoteTracksBySessionId: { [key: string]: string };
  activeVideoInputs: any;
  vcsOutputRef: any;
}

// @ts-ignore
export const VCSContext = createContext<ContextValue>(null);

export const VCSProvider = ({ children }: VCSType) => {
  const vcsOutputRef = useRef(null);
  const [rtmpUrl, setRtmpUrl] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const [recordingErrorMsg, setRecordingErrorMsg] = useState(null);

  const [activeTab, setActiveTab] = useState<Tab>('view');

  const localUser = useLocalParticipant();
  const { callObject } = useCall();
  const [params, setParams] = useState({
    mode: 'grid',
  });

  const [assets, setAssets] = useState({});
  const [layoutParticipants, setLayoutParticipants] =
    useState<LayoutParticipants>({
      showAllParticipants: true,
      participants: [],
    });

  const [remoteTracks, setRemoteTracks] = useState<{ [key: string]: any }>({});
  const [activeVideoInputs, setActiveVideoInputs] = useState([]);

  // live-streaming functions
  const startStreaming = useCallback(() => {
    const lp = layoutParticipants.showAllParticipants
      ? ['*']
      : [...layoutParticipants.participants];

    callObject.startLiveStreaming({
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
    callObject,
    layoutParticipants.participants,
    layoutParticipants.showAllParticipants,
    params,
    rtmpUrl,
  ]);

  const updateStreaming = useCallback(() => {
    const lp = layoutParticipants.showAllParticipants
      ? ['*']
      : [...layoutParticipants.participants];

    callObject.updateLiveStreaming({
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
    callObject,
    layoutParticipants.participants,
    layoutParticipants.showAllParticipants,
    params,
  ]);

  const stopStreaming = () => callObject.stopLiveStreaming();

  // recording functions.

  const startRecording = useCallback(() => {
    const lp = layoutParticipants.showAllParticipants
      ? ['*']
      : [...layoutParticipants.participants];

    callObject.startRecording({
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
    callObject,
    layoutParticipants.participants,
    layoutParticipants.showAllParticipants,
    params,
  ]);

  const updateRecording = useCallback(() => {
    const lp = layoutParticipants.showAllParticipants
      ? ['*']
      : [...layoutParticipants.participants];

    callObject.updateRecording({
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
    callObject,
    layoutParticipants.participants,
    layoutParticipants.showAllParticipants,
    params,
  ]);

  const stopRecording = () => callObject.stopRecording();

  const sendAppParams = useCallback(() => {
    if (!callObject) return;

    callObject.sendAppMessage({ params }, '*');
  }, [callObject, params]);

  useEffect(() => {
    if (!callObject) return;

    if (vcsOutputRef.current?.paramValues) {
      const diff = getDiff(vcsOutputRef.current?.paramValues, params);
      if (
        diff &&
        Object.keys(diff).length === 0 &&
        Object.getPrototypeOf(diff) === Object.prototype
      )
        return;
      for (const key in diff) {
        vcsOutputRef.current.sendParam(key, diff[key]);
      }
      sendAppParams();
    }

    if (isLiveStreaming) updateStreaming();
    if (isRecording) updateRecording();
  }, [
    callObject,
    isLiveStreaming,
    isRecording,
    params,
    sendAppParams,
    updateRecording,
    updateStreaming,
  ]);

  const recreateActiveVideoInputs = useCallback(
    (addedParticipant: any, deletedParticipant: any) => {
      if (!localUser?.session_id) return;

      const arr = [];
      arr.push({
        id: localUser.session_id,
        displayName: localUser.user_name,
      });

      const prev = activeVideoInputs;

      if (prev && prev.length > 1) {
        for (let i = 1; i < prev.length; i++) {
          const v = prev[i];
          if (
            v.id !== deletedParticipant?.session_id &&
            v.id !== addedParticipant?.session_id
          ) {
            arr.push(v);
          }
        }
      }

      if (
        addedParticipant?.session_id &&
        localUser.session_id !== addedParticipant?.session_id
      ) {
        arr.push({
          id: addedParticipant.session_id,
          displayName: addedParticipant.user_name,
        });
      }
      setActiveVideoInputs([...arr]);
    },
    [activeVideoInputs, localUser?.session_id, localUser?.user_name],
  );

  const handleEvents = useCallback(
    async (event: DailyEventObject) => {
      switch (event.action) {
        case 'live-streaming-started':
          setIsLiveStreaming(true);
          break;
        case 'live-streaming-stopped':
          setIsLiveStreaming(false);
          break;
        case 'live-streaming-error':
          console.error('Streaming error - ' + event.errorMsg);
          setIsLiveStreaming(false);
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
        case 'track-started':
          if (event && event.track && 'video' === event.track.kind) {
            setRemoteTracks(tracks => ({
              ...tracks,
              [event.participant.session_id]: {
                track: event.track,
                userName: event.participant.user_name,
              },
            }));
            recreateActiveVideoInputs(event.participant, null);
          }
          break;
        case 'track-stopped':
          if (event && event.track && 'video' === event.track.kind) {
            setRemoteTracks(tracks => {
              const sessionId = event.participant?.session_id;
              if (sessionId) delete tracks[sessionId];
              else if (event?.track) {
                const key = Object.keys(tracks).find(
                  key => tracks[key]?.track === event.track,
                );
                if (key) delete tracks[key];
                else
                  console.warn(
                    "** lost remote track wasn't somehow seen before",
                  );
              }
              return tracks;
            });
            recreateActiveVideoInputs(null, event.participant);
          }
          break;
        case 'app-message':
          if (event && event.data?.params) setParams(event.data.params);
          break;
        default:
          break;
      }
    },
    [recreateActiveVideoInputs],
  );

  useEffect(() => {
    if (!callObject) return;

    const events = [
      'recording-started',
      'recording-stopped',
      'recording-error',
      'live-streaming-started',
      'live-streaming-stopped',
      'live-streaming-error',
      'track-started',
      'track-stopped',
      'app-message',
    ];

    events.map((event: string) => {
      callObject.on(event as DailyEvent, handleEvents);
    });
    return () => {
      events.map((event: string) => {
        callObject.off(event as DailyEvent, handleEvents);
      });
    };
  }, [callObject, handleEvents]);

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
        remoteTracksBySessionId: remoteTracks,
        activeVideoInputs,
        vcsOutputRef,
      }}
    >
      {children}
    </VCSContext.Provider>
  );
};

export const useVCS = () => useContext(VCSContext);
