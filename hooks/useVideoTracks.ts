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
      (p: DailyParticipant) =>
        p.permissions.hasPresence &&
        !p.local &&
        p.participantType !== 'remote-media-player',
      []
    ),
    sort: 'joined_at',
  });
  const { screens } = useScreenShare();
  const rmpIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) => Boolean(p?.tracks?.rmpVideo),
      []
    ),
    sort: 'joined_at',
  });

  const activeVideoInputs: ActiveVideoInput[] = useMemo(() => {
    if (!daily) return [];

    const activeVideos: ActiveVideoInput[] = [
      {
        id: localSessionId,
        displayName: userName,
      },
    ];

    const participants = Object.values(daily.participants());

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

    rmpIds.forEach((id) => {
      activeVideos.push({
        id,
        displayName: 'RMP',
      });
    });

    return activeVideos;
  }, [daily, localSessionId, participantIds, rmpIds, screens, userName]);

  const remoteTracksBySessionId = useMemo(() => {
    if (!daily) return {};

    const tracksBySessionId = {
      [localSessionId]: {
        track: videoTrack,
        userName,
      },
    };

    const participants = Object.values(daily.participants());

    participantIds.forEach((id) => {
      const participant = participants.find((p) => p.session_id === id);
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

    rmpIds.forEach((id) => {
      const participant = participants.find((p) => p.session_id === id);
      if (!participant) return;

      tracksBySessionId[id] = {
        track: participant.tracks.rmpVideo?.persistentTrack,
        userName: 'RMP',
      };
    });

    return tracksBySessionId;
  }, [
    daily,
    localSessionId,
    participantIds,
    rmpIds,
    screens,
    userName,
    videoTrack,
  ]);

  const filteredActiveVideoInputs = useMemo(() => {
    if (participantsState.showAllParticipants) return activeVideoInputs;

    return activeVideoInputs.filter((input) =>
      participantsState.participantIds.includes(input.id)
    );
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
