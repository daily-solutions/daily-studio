import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from '@/states/params';
import { useLocalSessionId, useMeetingState } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { getDiff } from '@/lib/getDiff';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { useParticipantCount } from '@/hooks/useParticipantCount';
import { useVideoTracks } from '@/hooks/useVideoTracks';
import { VCSCompositionWrapper } from '@/components/Vcs/VcsCompositionWrapper';

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

interface Props {
  viewport: {
    width: number;
    height: number;
  };
}

export const useVCS = ({ viewport: { width, height } }: Props) => {
  const localSessionId = useLocalSessionId();
  const meetingState = useMeetingState();
  const { present: participantCount } = useParticipantCount();

  const vcsCompRef = useRef<VCSCompositionWrapper | null>(null);
  const outputElementRef = useRef<HTMLDivElement | null>(null);

  const [params] = useParams();
  const [{ assets }] = useMeetingSessionState<MeetingSessionState>();

  const { activeVideoInputs, remoteTracksBySessionId } = useVideoTracks();

  const [vcsInitialized, setVcsInitialized] = useState(false);

  const createVCSView = useCallback(
    (el) => {
      if (!el || meetingState !== 'joined-meeting' || !width || !height) return;

      if (vcsInitialized) {
        vcsCompRef.current?.rootDisplaySizeChanged();
        return;
      }

      vcsCompRef.current = new VCSCompositionWrapper(
        el,
        { w: width, h: height },
        params,
        { getAssetUrlCb }
      );
      vcsCompRef.current
        .start()
        .then(() => {
          console.log('VCS started');
          setVcsInitialized(true);
        })
        .catch((err) => console.error(`VCS start failed: ${err}`));
    },
    [height, meetingState, params, vcsInitialized, width]
  );

  useEffect(() => {
    createVCSView(outputElementRef.current);
  }, [createVCSView]);

  useEffect(() => {
    if (!vcsCompRef.current || !localSessionId) return;

    if (participantCount > 0) {
      vcsCompRef.current?.applyMeetingTracksAndOrdering(
        remoteTracksBySessionId,
        activeVideoInputs
      );
    } else {
      vcsCompRef.current?.reconcileMeetingTracks(remoteTracksBySessionId);
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
    if (!vcsCompRef.current) return;

    const updateAssets = async () => {
      const promises: Promise<any>[] = [];

      for (const asset of Object.values(assets ?? {})) {
        promises.push(
          new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
              resolve({ name: asset.name, image: img });
            };
            img.onerror = () => {
              const msg = `Image load failed, asset ${asset.name}`;
              console.error(msg);
              reject(new Error(msg));
            };
            img.src = asset.url;
          })
        );
      }

      const results = await Promise.all(promises);
      const imagesByName = {};
      for (const item of results) {
        imagesByName[item.name] = item.image;
        console.log('loaded test image: ', item.name);
      }
      return imagesByName;
    };

    updateAssets()
      .then((assets) => {
        if (!vcsCompRef.current) return;

        vcsCompRef.current.sources.assetImages = assets;
        vcsCompRef.current?.sendUpdateImageSources();
      })
      .catch((err) => console.error(err));
  }, [assets]);

  useEffect(() => {
    if (!vcsCompRef.current || dequal(vcsCompRef.current?.paramValues, params))
      return;

    const diff = getDiff(vcsCompRef.current?.paramValues, params);
    if (
      diff &&
      Object.keys(diff).length === 0 &&
      Object.getPrototypeOf(diff) === Object.prototype
    )
      return;

    for (const key in diff) {
      vcsCompRef.current.sendParam(key, diff[key]);
    }
  }, [height, params, width]);

  return { outputElementRef, vcsCompRef };
};