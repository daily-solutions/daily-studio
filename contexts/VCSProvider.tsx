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
import {getDiff} from "../utils/getDiff";

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

  const { callFrame, localUser } = useCall();
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

  const stopStreaming = () => callFrame.stopLiveStreaming();

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

    if (vcsOutputRef.current?.paramValues) {
      const diff = getDiff(vcsOutputRef.current?.paramValues, params);
      for (const key in diff) {
        vcsOutputRef.current.sendParam(key, diff[key]);
      }
    }

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

  const recreateActiveVideoInputs = useCallback(
    (addedParticipantId: string, deletedParticipantId: string) => {
      if (!localUser.session_id) {
        console.warn(
          "can't build list of active video inputs, localSessionId missing",
        );
        return;
      }

      // our own local session always goes first, since we are the producer
      const arr = [];
      arr.push({
        id: localUser.session_id,
        displayName: localUser.user_name,
      });

      const prev = activeVideoInputs;

      if (prev && prev.length > 1) {
        for (let i = 1; i < prev.length; i++) {
          const v = prev[i];
          if (v.id !== deletedParticipantId && v.id !== addedParticipantId) {
            arr.push(v);
          }
        }
      }

      if (addedParticipantId) {
        arr.push({
          id: addedParticipantId,
          displayName: remoteTracks[addedParticipantId].userName,
        });
      }
      console.log('active video inputs now: ', arr);
      setActiveVideoInputs([...arr]);
    },
    [
      activeVideoInputs,
      localUser?.session_id,
      localUser?.user_name,
      remoteTracks,
    ],
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
          if (
            event &&
            !event.participant.local &&
            event.track &&
            'video' === event.track.kind
          ) {
            setRemoteTracks(tracks => ({
              ...tracks,
              [event.participant.session_id]: {
                track: event.track,
                userName: event.participant.user_name,
              },
            }));
            recreateActiveVideoInputs(event.participant.session_id, null);
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
              recreateActiveVideoInputs(null, sessionId);
              return tracks;
            });
          }
          break;
        default:
          break;
      }
    },
    [recreateActiveVideoInputs],
  );

  useEffect(() => {
    if (!callFrame) return;

    const events = [
      'recording-started',
      'recording-stopped',
      'recording-error',
      'live-streaming-started',
      'live-streaming-stopped',
      'live-streaming-error',
      'participant-joined',
      'track-stopped',
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
