import { useCallback, useMemo } from 'react';
import { DailyParticipant } from '@daily-co/daily-js';
import { useDaily, useParticipantIds } from '@daily-co/daily-react';

type ActiveVideoInput = {
  id: string;
  displayName: string;
};

export const useVideoTracks = () => {
  const daily = useDaily();

  const participantIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) =>
        p.permissions.hasPresence &&
        (p.userData?.['onStage'] ||
          p.participantType === 'remote-media-player'),
      []
    ),
    sort: useCallback((a: DailyParticipant, b: DailyParticipant) => {
      const aSort = a.joined_at;
      const bSort = b.joined_at;

      if (a.local || b.local) return 1;
      if (aSort === undefined) return -1;
      if (bSort === undefined) return 1;
      if (aSort > bSort) return 1;
      if (aSort < bSort) return -1;
      return 0;
    }, []),
  });
  const screenIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) =>
        Boolean(p.tracks.screenVideo.persistentTrack) &&
        p.userData?.['onStage'],
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

    const participants = Object.values(daily.participants());

    participantIds.forEach((id) => {
      const participant = participants.find((p) => p.session_id === id);
      if (!participant) return;

      const isRMP = participant.participantType === 'remote-media-player';

      const displayName = isRMP ? 'RMP' : participant.user_name;
      const { video, rmpVideo } = participant.tracks;
      const isOff = ['off', 'interrupted'].includes(video.state);

      const track = isRMP
        ? rmpVideo?.persistentTrack
        : isOff
        ? undefined
        : video.persistentTrack;
      addActiveVideo(id, displayName, track);
    });

    screenIds.forEach((id) => {
      const participant = participants.find((p) => p.session_id === id);
      if (!participant) return;

      const isOff = ['off', 'interrupted'].includes(
        participant.tracks.screenVideo.state
      );
      const track = isOff
        ? undefined
        : participant.tracks.screenVideo.persistentTrack;
      addActiveVideo(`${id}-screen`, 'Screen', track);
    });

    return {
      activeVideoInputs: activeVideos,
      remoteTracksBySessionId: tracksBySessionId,
    };
  }, [daily, participantIds, screenIds]);

  return {
    activeVideoInputs,
    remoteTracksBySessionId,
  };
};
