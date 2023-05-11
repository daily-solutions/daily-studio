import { useCallback, useState } from 'react';
import { DailyEventObject } from '@daily-co/daily-js';
import {
  useDailyEvent,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

type ActiveVideoInput = {
  id: string;
  displayName: string;
};

export const useVideoTracks = () => {
  const localSessionId = useLocalSessionId();
  const userName = useParticipantProperty(
    localSessionId as string,
    'user_name'
  );

  const [remoteTracksBySessionId, setRemoteTracksBySessionId] = useState<
    Record<string, any>
  >({});
  const [activeVideoInputs, setActiveVideoInputs] = useState<
    ActiveVideoInput[]
  >([]);

  const updateActiveVideoInputs = useCallback(
    (
      participant: ActiveVideoInput,
      options: { add?: boolean; delete?: boolean } = {}
    ) => {
      if (!localSessionId) return;

      const arr: ActiveVideoInput[] = [];
      arr.push({
        id: localSessionId,
        displayName: userName,
      });

      const prev = activeVideoInputs;

      if (options.delete && prev && prev.length > 1) {
        for (let i = 1; i < prev.length; i++) {
          const v = prev[i];
          if (
            v.id !== participant.id &&
            v.displayName !== participant.displayName
          ) {
            arr.push(v);
          }
        }
      } else {
        arr.push(...prev.filter((v) => v.id !== localSessionId));
      }

      if (options.add && participant.id && localSessionId !== participant.id) {
        arr.push({
          id: participant.id,
          displayName: participant.displayName,
        });
      }

      setActiveVideoInputs([...arr]);
    },
    [activeVideoInputs, localSessionId, userName]
  );

  const handleTrackEvents = useCallback(
    (ev: DailyEventObject) => {
      if (!ev || !ev.track || ev.track.kind !== 'video') return;

      const sessionId =
        ev.type === 'screenVideo'
          ? `${ev.participant.session_id}-screen`
          : ev.participant.session_id;

      const track = ev.participant.tracks[ev.type].persistentTrack;
      const userName = ev.participant.user_name;

      switch (ev.action) {
        case 'track-started':
          setRemoteTracksBySessionId((tracks) => ({
            ...tracks,
            [sessionId]: { track, userName },
          }));
          updateActiveVideoInputs(
            { id: sessionId, displayName: userName },
            { add: true }
          );
          break;
        case 'track-stopped':
          setRemoteTracksBySessionId((tracks) => {
            const key = Object.keys(tracks).find(
              (k) => tracks[k]?.track?.id === track?.id
            );
            if (key) delete tracks[key];
            return tracks;
          });
          updateActiveVideoInputs(
            { id: sessionId, displayName: userName },
            { delete: true }
          );
          break;
      }
    },
    [updateActiveVideoInputs]
  );

  useDailyEvent('track-started', handleTrackEvents);
  useDailyEvent('track-stopped', handleTrackEvents);

  return { activeVideoInputs, remoteTracksBySessionId };
};
