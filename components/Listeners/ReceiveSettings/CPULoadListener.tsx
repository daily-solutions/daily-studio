import { useCallback } from 'react';
import { useVideoLayer } from '@/states/videoLayerState';
import { DailyEventObject } from '@daily-co/daily-js';
import { useThrottledDailyEvent } from '@daily-co/daily-react';

import { VIDEO_QUALITY_LAYERS } from '@/types/videoQualityLayers';

export function CPULoadListener() {
  const [, setVideoLayer] = useVideoLayer();

  useThrottledDailyEvent(
    'cpu-load-change',
    useCallback(
      (events: DailyEventObject<'cpu-load-change'>[]) => {
        events.forEach((ev) => {
          const { cpuLoadState, cpuLoadStateReason } = ev;
          switch (cpuLoadState) {
            case 'high':
              setVideoLayer((prev) => {
                return {
                  ...prev,
                  receive: {
                    ...prev.receive,
                    layerBasedOnCPU:
                      cpuLoadStateReason === 'decode'
                        ? VIDEO_QUALITY_LAYERS.LOW
                        : VIDEO_QUALITY_LAYERS.MEDIUM,
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
                    layerBasedOnCPU: VIDEO_QUALITY_LAYERS.HIGH,
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
