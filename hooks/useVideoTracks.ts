import { useCallback, useMemo, useState } from 'react';
import { useParticipantsState } from '@/states/participantsState';
import {
  DailyEventObject,
  DailyEventObjectParticipantLeft,
} from '@daily-co/daily-js';
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

  const [participantsState] = useParticipantsState();

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

      const userName = ev.participant.user_name;

      switch (ev.action) {
        case 'track-started':
          const track = ev.participant.tracks[ev.type].persistentTrack;
          setRemoteTracksBySessionId((tracks) => ({
            ...tracks,
            [sessionId]: {
              track,
              userName,
            },
          }));
          updateActiveVideoInputs(
            { id: sessionId, displayName: userName },
            { add: true }
          );
          break;
        case 'track-stopped':
          setRemoteTracksBySessionId((tracks) => {
            const newTracks = { ...tracks };
            delete newTracks[sessionId];
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
  useDailyEvent(
    'participant-left',
    useCallback(
      (ev: DailyEventObjectParticipantLeft) => {
        setRemoteTracksBySessionId((tracks) => {
          const newTracks = { ...tracks };
          delete newTracks[ev.participant.session_id];
          delete newTracks[`${ev.participant.session_id}-screen`];
          return tracks;
        });
        updateActiveVideoInputs(
          {
            id: ev.participant.session_id,
            displayName: ev.participant.user_name,
          },
          { delete: true }
        );
      },
      [updateActiveVideoInputs]
    )
  );

  const filteredActiveVideoInputs = useMemo(() => {
    if (participantsState.showAllParticipants) return activeVideoInputs;

    return activeVideoInputs.filter((input) => {
      return participantsState.participantIds.includes(input.id);
    });
  }, [
    activeVideoInputs,
    participantsState.participantIds,
    participantsState.showAllParticipants,
  ]);

  const filteredRemoteTracksBySessionId = useMemo(() => {
    if (participantsState.showAllParticipants) return remoteTracksBySessionId;

    return Object.keys(remoteTracksBySessionId)
      .filter((key) => participantsState.participantIds.includes(key))
      .reduce((acc, key) => {
        acc[key] = remoteTracksBySessionId[key];
        return acc;
      }, {});
  }, [remoteTracksBySessionId, participantsState]);

  return {
    activeVideoInputs: filteredActiveVideoInputs,
    remoteTracksBySessionId: filteredRemoteTracksBySessionId,
  };
};
