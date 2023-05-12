import { useCallback, useEffect, useMemo } from 'react';
import { useAssets } from '@/states/assetState';
import { useParams } from '@/states/params';
import { useParticipantsState } from '@/states/participantsState';
import { useRTMP } from '@/states/rtmpState';
import { DailyUpdateStreamingCustomLayoutConfig } from '@daily-co/daily-js';
import { useLiveStreaming } from '@daily-co/daily-react';
import { dequal } from 'dequal';

export const useLiveStream = () => {
  const {
    layout,
    isLiveStreaming,
    stopLiveStreaming: dailyStopLiveStreaming,
    startLiveStreaming: dailyStartLiveStreaming,
    updateLiveStreaming,
  } = useLiveStreaming();

  const [rtmps] = useRTMP();
  const [params] = useParams();
  const [paxState] = useParticipantsState();
  const [assets] = useAssets();

  const startLiveStreaming = useCallback(() => {
    const rtmpURLs = Object.values(rtmps)
      .filter((rtmp) => rtmp.active)
      .map((rtmp) => rtmp.streamURL + rtmp.streamKey);
    const session_assets = Object.values(assets).reduce((acc, asset) => {
      acc[asset.name] = asset.url;
      return acc;
    }, {});

    const participantIds = paxState.showAllParticipants
      ? ['*']
      : [...paxState.participantIds];

    dailyStartLiveStreaming({
      instanceId: '40000000-4000-4000-8000-800000000000',
      rtmpUrl: rtmpURLs,
      layout: {
        preset: 'custom',
        composition_params: params,
        session_assets,
        // @ts-ignore
        participants: {
          video: participantIds,
          audio: participantIds,
          sort: 'active',
        },
      },
    });
  }, [
    assets,
    dailyStartLiveStreaming,
    params,
    paxState.participantIds,
    paxState.showAllParticipants,
    rtmps,
  ]);

  useEffect(() => {
    if (!isLiveStreaming) return;

    const areParamsEqual = dequal(
      (layout as DailyUpdateStreamingCustomLayoutConfig).composition_params,
      params
    );

    const areParticipantsEqual = dequal(
      (layout as DailyUpdateStreamingCustomLayoutConfig).video,
      paxState.showAllParticipants ? ['*'] : paxState.participantIds
    );

    if (areParamsEqual && areParticipantsEqual) return;

    const participantIds = paxState.showAllParticipants
      ? ['*']
      : [...paxState.participantIds];

    updateLiveStreaming({
      instanceId: '40000000-4000-4000-8000-800000000000',
      layout: {
        preset: 'custom',
        composition_params: params,
        // @ts-ignore
        participants: {
          video: participantIds,
          audio: participantIds,
          sort: 'active',
        },
      },
    });
  }, [
    params,
    isLiveStreaming,
    layout,
    paxState.showAllParticipants,
    paxState.participantIds,
    updateLiveStreaming,
  ]);

  const stopLiveStreaming = useCallback(
    () =>
      dailyStopLiveStreaming({
        instanceId: '40000000-4000-4000-8000-800000000000',
      }),
    [dailyStopLiveStreaming]
  );

  const enableBroadcast = useMemo(
    () => Object.values(rtmps).some((rtmp) => rtmp.active),
    [rtmps]
  );

  return {
    enableBroadcast,
    isLiveStreaming,
    stopLiveStreaming,
    startLiveStreaming,
  };
};
