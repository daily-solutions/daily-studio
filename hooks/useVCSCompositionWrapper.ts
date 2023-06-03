import { useCallback, useEffect, useRef, useState } from 'react';
import { useAssets } from '@/states/assetState';
import { useParams } from '@/states/params';
import { useLocalSessionId, useMeetingState } from '@daily-co/daily-react';

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

interface Props {
  viewport: {
    width: number;
    height: number;
  };
}

export const useVCSCompositionWrapper = ({
  viewport: { width, height },
}: Props) => {
  const localSessionId = useLocalSessionId();
  const { present: participantCount } = useParticipantCount();

  const vcsCompRef = useRef<VCSCompositionWrapper | null>(null);
  const outputElementRef = useRef<HTMLDivElement | null>(null);

  useSyncParams(vcsCompRef);

  const [params] = useParams();
  const meetingState = useMeetingState();
  const [assets] = useAssets();

  const { activeVideoInputs, remoteTracksBySessionId } = useVideoTracks();

  const [vcsInitialized, setVcsInitialized] = useState(false);

  const createVCSView = useCallback(
    (el) => {
      if (!el || meetingState !== 'joined-meeting' || !width || !height) return;

      if (vcsCompRef.current) {
        const elements = document.getElementsByClassName(
          'vcs-asset-preload-container'
        );
        for (const el of Array.from(elements)) {
          el.remove();
        }
        setVcsInitialized(false);
        vcsCompRef.current?.stop();
        vcsCompRef.current = null;
      }

      vcsCompRef.current = new VCSCompositionWrapper(
        el,
        { w: width, h: height },
        params,
        { getAssetUrlCb }
      );
      vcsCompRef.current.start().then(() => {
        console.log('VCS started');
        setVcsInitialized(true);
      });
    },
    [height, meetingState, params, width]
  );

  useEffect(() => {
    if (vcsInitialized) return;

    createVCSView(outputElementRef.current);
  }, [createVCSView, vcsInitialized]);

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

      for (const asset of Object.values(assets)) {
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

    updateAssets().then((assets) => {
      if (!vcsCompRef.current) return;

      vcsCompRef.current.sources.assetImages = assets;
      vcsCompRef.current?.sendUpdateImageSources();
    });
  }, [assets]);

  useEffect(() => {
    window.addEventListener('resize', () =>
      vcsCompRef.current?.rootDisplaySizeChanged()
    );
    return () =>
      window.removeEventListener('resize', () =>
        vcsCompRef.current?.rootDisplaySizeChanged()
      );
  }, []);

  return { outputElementRef, vcsCompRef };
};
