import { useCallback } from 'react';
import { useVideoLayer } from '@/states/videoLayerState';
import { DailyEventObject } from '@daily-co/daily-js';
import { useThrottledDailyEvent } from '@daily-co/daily-react';

import { VIDEO_QUALITY_LAYERS } from '@/types/videoQualityLayers';

export function NetworkThresholdListener() {
  const [, setVideoLayer] = useVideoLayer();

  useThrottledDailyEvent(
    'network-quality-change',
    useCallback(
      (events: DailyEventObject<'network-quality-change'>[]) => {
        events.forEach((ev) => {
          const { threshold } = ev;
          switch (threshold) {
            case 'good':
              setVideoLayer((prev) => {
                return {
                  ...prev,
                  receive: {
                    ...prev.receive,
                    layerBasedOnNetwork: VIDEO_QUALITY_LAYERS.HIGH,
                  },
                };
              });
              break;
            case 'low':
              setVideoLayer((prev) => {
                return {
                  ...prev,
                  receive: {
                    ...prev.receive,
                    layerBasedOnNetwork: VIDEO_QUALITY_LAYERS.MEDIUM,
                  },
                };
              });
              break;
            case 'very-low':
              setVideoLayer((prev) => {
                return {
                  ...prev,
                  receive: {
                    ...prev.receive,
                    layerBasedOnNetwork: VIDEO_QUALITY_LAYERS.LOW,
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
