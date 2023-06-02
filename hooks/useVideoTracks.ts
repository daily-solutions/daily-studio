import { useCallback, useMemo } from 'react';
import { DailyParticipant } from '@daily-co/daily-js';
import {
  useDaily,
  useLocalSessionId,
  useMediaTrack,
  useParticipantIds,
  useParticipantProperty,
  usePermissions,
  useScreenShare,
} from '@daily-co/daily-react';

type ActiveVideoInput = {
  id: string;
  displayName: string;
};

export const useVideoTracks = () => {
  const daily = useDaily();
  const localSessionId = useLocalSessionId();
  const [userName, userData, owner] = useParticipantProperty(localSessionId, [
    'user_name',
    'userData',
    'owner',
  ]);
  const { persistentTrack: videoTrack } = useMediaTrack(localSessionId);

  const { hasPresence } = usePermissions();

  const participantIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) =>
        p.permissions.hasPresence &&
        (p.owner || p.userData?.['onStage']) &&
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

  const { activeVideoInputs, remoteTracksBySessionId } = useMemo(() => {
    if (!daily) return { activeVideoInputs: [], remoteTracksBySessionId: {} };

    const activeVideos: ActiveVideoInput[] = [];
    const tracksBySessionId = {};

    const addActiveVideo = (id, displayName, track, userName = '') => {
      activeVideos.push({ id, displayName });
      tracksBySessionId[id] = { track, userName };
    };

    if (hasPresence && (owner || userData?.['onStage'])) {
      addActiveVideo(localSessionId, userName, videoTrack);
    }

    const participants = Object.values(daily.participants());

    participantIds.forEach((id) => {
      const participant = participants.find((p) => p.session_id === id);
      if (!participant) return;

      const displayName = participant.user_name;
      const isOff = ['off', 'interrupted'].includes(
        participant.tracks.video.state
      );
      const track = isOff
        ? undefined
        : participant.tracks.video.persistentTrack;
      addActiveVideo(id, displayName, track);
    });

    screens.forEach((screen) => {
      const isOff = ['off', 'interrupted'].includes(screen.screenVideo.state);
      const track = isOff ? undefined : screen.screenVideo.persistentTrack;
      addActiveVideo(`${screen.session_id}-screen`, '', track);
    });

    rmpIds.forEach((id) => {
      const participant = participants.find((p) => p.session_id === id);
      if (!participant) return;

      addActiveVideo(
        id,
        'RMP',
        participant.tracks.rmpVideo?.persistentTrack,
        'RMP'
      );
    });

    return {
      activeVideoInputs: activeVideos,
      remoteTracksBySessionId: tracksBySessionId,
    };
  }, [
    daily,
    hasPresence,
    localSessionId,
    owner,
    participantIds,
    rmpIds,
    screens,
    userData,
    userName,
    videoTrack,
  ]);

  return {
    activeVideoInputs,
    remoteTracksBySessionId,
  };
};
