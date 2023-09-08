import { useCallback, useState } from 'react';
import { useVideoLayer } from '@/states/videoLayerState';
import { DailyEventObject, DailyNetworkStats } from '@daily-co/daily-js';
import { useThrottledDailyEvent } from '@daily-co/daily-react';

import { VIDEO_QUALITY_LAYERS } from '@/types/videoQualityLayers';

export function NetworkThresholdListener() {
  const [prevThresholds, setPrevThresholds] = useState<
    DailyNetworkStats['threshold'][]
  >([]);
  const [, setVideoLayer] = useVideoLayer();

  useThrottledDailyEvent(
    'network-quality-change',
    useCallback(
      (events: DailyEventObject<'network-quality-change'>[]) => {
        events.forEach((ev) => {
          const { threshold } = ev;

          const recentThresholds = prevThresholds.slice(-5);
          const hasLowThreshold = recentThresholds.some((t) => t === 'low');
          const hasVeryLowThreshold = recentThresholds.some(
            (t) => t === 'very-low',
          );

          switch (threshold) {
            case 'good':
              setVideoLayer((prev) => {
                return {
                  ...prev,
                  send: {
                    ...prev.send,
                    layerBasedOnNetwork: hasVeryLowThreshold
                      ? VIDEO_QUALITY_LAYERS.LOW
                      : hasLowThreshold
                      ? VIDEO_QUALITY_LAYERS.MEDIUM
                      : VIDEO_QUALITY_LAYERS.HIGH,
                  },
                };
              });
              break;
            case 'low':
              setVideoLayer((prev) => {
                return {
                  ...prev,
                  send: {
                    ...prev.send,
                    layerBasedOnNetwork: hasVeryLowThreshold
                      ? VIDEO_QUALITY_LAYERS.LOW
                      : VIDEO_QUALITY_LAYERS.MEDIUM,
                  },
                };
              });
              break;
            case 'very-low':
              setVideoLayer((prev) => {
                return {
                  ...prev,
                  send: {
                    ...prev.send,
                    layerBasedOnNetwork: VIDEO_QUALITY_LAYERS.LOW,
                  },
                };
              });
              break;
          }

          setPrevThresholds((prev) => [...prev, threshold]);
        });
      },
      [prevThresholds, setVideoLayer],
    ),
  );

  return null;
}
