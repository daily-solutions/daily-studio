import { useCallback, useMemo } from 'react';
import { useParticipantsState } from '@/states/participantsState';
import { DailyParticipant } from '@daily-co/daily-js';
import {
  useDaily,
  useLocalSessionId,
  useMediaTrack,
  useParticipantIds,
  useParticipantProperty,
  useScreenShare,
} from '@daily-co/daily-react';

type ActiveVideoInput = {
  id: string;
  displayName: string;
};

export const useVideoTracks = () => {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const userName = useParticipantProperty(localSessionId, 'user_name');
  const { persistentTrack: videoTrack } = useMediaTrack(localSessionId);
  const [participantsState] = useParticipantsState();

  const participantIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) => p.permissions.hasPresence && !p.local,
      []
    ),
    sort: 'joined_at',
  });
  const { screens } = useScreenShare();

  const activeVideoInputs = useMemo(() => {
    const activeVideos: ActiveVideoInput[] = [
      {
        id: localSessionId,
        displayName: userName,
      },
    ];

    const participants = Object.values(daily?.participants());

    participantIds.forEach((id) => {
      const participant = participants.find((p) => p.session_id === id);
      if (!participant) return;

      const displayName = participant.user_name;
      activeVideos.push({
        id,
        displayName,
      });
    });

    screens.forEach((screen) => {
      activeVideos.push({
        id: `${screen.session_id}-screen`,
        displayName: '',
      });
    });

    return activeVideos;
  }, [daily, localSessionId, participantIds, screens, userName]);

  const remoteTracksBySessionId = useMemo(() => {
    const tracksBySessionId = {
      [localSessionId]: {
        track: videoTrack,
        userName,
      },
    };

    participantIds.forEach((id) => {
      const participant = daily?.participants()[id];
      if (!participant) return;

      const displayName = participant.user_name;
      const isOff = ['off', 'interrupted'].includes(
        participant.tracks.video.state
      );
      tracksBySessionId[id] = {
        track: isOff ? undefined : participant.tracks.video.persistentTrack,
        userName: displayName,
      };
    });

    screens.forEach((screen) => {
      const isOff = ['off', 'interrupted'].includes(screen.screenVideo.state);
      tracksBySessionId[`${screen.session_id}-screen`] = {
        track: isOff ? undefined : screen.screenVideo.persistentTrack,
        userName: '',
      };
    });

    return tracksBySessionId;
  }, [daily, localSessionId, participantIds, screens, userName, videoTrack]);

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

  return {
    activeVideoInputs: filteredActiveVideoInputs,
    remoteTracksBySessionId,
  };
};
