import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMeetingState } from '@/states/meetingState';
import { useParams } from '@/states/params';
import { useParticipantsState } from '@/states/participantsState';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import { useAppMessage, useLocalSessionId } from '@daily-co/daily-react';

import { getDiff } from '@/lib/getDiff';
import { useParticipantCount } from '@/hooks/useParticipantCount';
import { useSyncParams } from '@/hooks/useSyncParams';
import { useVideoTracks } from '@/hooks/useVideoTracks';
import { VCSCompositionWrapper } from '@/components/vcs/vcsCompositionWrapper';

const getAssetUrlCb = (name: string, namespace: string, type: string) => {
  switch (type) {
    case 'font':
      return `/vcs/res/fonts/${name}`;
    case 'image':
      return namespace === 'composition'
        ? `/vcs/composition-assets/${name}`
        : `/vcs/res/test-assets/${name}`;
    default:
      return name;
  }
};

export const useVCSCompositionWrapper = () => {
  const localSessionId = useLocalSessionId();
  const { present: participantCount } = useParticipantCount();

  const vcsCompRef = useRef<VCSCompositionWrapper | null>(null);
  const outputElementRef = useRef<HTMLDivElement | null>(null);

  useSyncParams(vcsCompRef);

  const [params] = useParams();
  const [meetingState] = useMeetingState();

  const { activeVideoInputs, remoteTracksBySessionId } = useVideoTracks();

  const [vcsInitialized, setVcsInitialized] = useState(false);

  const createVCSView = useCallback(
    (el) => {
      if (!el) return;
      const viewport = document.getElementById('vcs-viewport');
      if (!viewport || meetingState !== 'joined-meeting') return;

      if (vcsCompRef.current) {
        setVcsInitialized(false);
        vcsCompRef.current?.stop();
        vcsCompRef.current = null;
      }

      vcsCompRef.current = new VCSCompositionWrapper(
        el,
        { w: viewport.clientWidth, h: viewport.clientHeight },
        params,
        { getAssetUrlCb }
      );
      vcsCompRef.current.start().then(() => {
        console.log('VCS started');
        setVcsInitialized(true);
      });
    },
    [meetingState, params]
  );

  useEffect(() => {
    createVCSView(outputElementRef.current);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!vcsCompRef.current || !localSessionId) return;

    if (participantCount > 0) {
      vcsCompRef.current.applyMeetingTracksAndOrdering(
        remoteTracksBySessionId,
        activeVideoInputs
      );
    } else {
      vcsCompRef.current.reconcileMeetingTracks(remoteTracksBySessionId);
    }
  }, [
    vcsInitialized,
    activeVideoInputs,
    localSessionId,
    participantCount,
    remoteTracksBySessionId,
    vcsCompRef,
  ]);

  useEffect(() => {
    const outputElement = outputElementRef.current;
    window.addEventListener('resize', () => createVCSView(outputElement));
    return () =>
      window.removeEventListener('resize', () => createVCSView(outputElement));
  }, [createVCSView]);

  return { outputElementRef, vcsCompRef };
};
