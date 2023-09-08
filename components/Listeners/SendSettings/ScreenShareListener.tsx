import { useCallback } from 'react';
import { useVideoLayer } from '@/states/videoLayerState';
import { DailyEventObject } from '@daily-co/daily-js';
import { useThrottledDailyEvent } from '@daily-co/daily-react';

import { VIDEO_QUALITY_LAYERS } from '@/types/videoQualityLayers';

export function ScreenShareListener() {
  const [, setVideoLayer] = useVideoLayer();

  useThrottledDailyEvent(
    ['local-screen-share-started', 'local-screen-share-stopped'],
    useCallback(
      (
        events: DailyEventObject<
          'local-screen-share-started' | 'local-screen-share-stopped'
        >[],
      ) => {
        events.forEach((ev) => {
          switch (ev.action) {
            case 'local-screen-share-started':
              setVideoLayer((prev) => {
                return {
                  ...prev,
                  send: {
                    ...prev.send,
                    layerBasedOnScreenShare: VIDEO_QUALITY_LAYERS.MEDIUM,
                  },
                };
              });
              break;
            case 'local-screen-share-stopped':
              setVideoLayer((prev) => {
                return {
                  ...prev,
                  send: {
                    ...prev.send,
                    layerBasedOnScreenShare: VIDEO_QUALITY_LAYERS.HIGH,
                  },
                };
              });
              break;
          }
        });
      },
      [setVideoLayer],
    ),
  );

  return null;
}
