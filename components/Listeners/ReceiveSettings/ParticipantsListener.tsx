import { useEffect } from 'react';
import { useVideoLayer } from '@/states/videoLayerState';

import { VIDEO_QUALITY_LAYERS } from '@/types/videoQualityLayers';
import { useStage } from '@/hooks/useStage';

export function ParticipantsListener() {
  const { participantIds } = useStage();
  const [, setVideoLayer] = useVideoLayer();

  useEffect(() => {
    const participantCount = participantIds.length;
    const participantCountLayer =
      participantCount < 5
        ? VIDEO_QUALITY_LAYERS.HIGH
        : participantCount < 10
        ? VIDEO_QUALITY_LAYERS.MEDIUM
        : VIDEO_QUALITY_LAYERS.LOW;

    setVideoLayer((prev) => {
      return {
        ...prev,
        receive: {
          ...prev.receive,
          layerBasedOnParticipantCount: participantCountLayer,
        },
      };
    });
  }, [participantIds, setVideoLayer]);

  return null;
}
