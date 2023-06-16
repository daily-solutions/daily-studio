import { useCallback, useEffect, useMemo } from 'react';
import { useParams } from '@/states/params';
import { useToast } from '@/ui/useToast';
import { DailyUpdateStreamingCustomLayoutConfig } from '@daily-co/daily-js';
import { useLiveStreaming } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { useIsOwner } from '@/hooks/useIsOwner';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { useParticipants } from '@/hooks/useParticipants';

export const useLiveStream = () => {
  const { toast } = useToast();
  const isOwner = useIsOwner();
  const {
    layout,
    isLiveStreaming,
    stopLiveStreaming: dailyStopLiveStreaming,
    startLiveStreaming: dailyStartLiveStreaming,
    updateLiveStreaming,
  } = useLiveStreaming({
    onLiveStreamingError: useCallback(
      (ev) => {
        toast({
          title: 'Live-streaming failed',
          description: ev.errorMsg,
          variant: 'destructive',
        });
      },
      [toast]
    ),
  });

  const [params] = useParams();
  const [{ assets, rtmps }] = useMeetingSessionState<MeetingSessionState>();

  const { participantIds } = useParticipants();

  const startLiveStreaming = useCallback(() => {
    const rtmpURLs = Object.values(rtmps)
      .filter((rtmp) => rtmp.active)
      .map((rtmp) => rtmp.streamURL + rtmp.streamKey);
    const session_assets = Object.values(assets ?? {}).reduce((acc, asset) => {
      acc[`images/${asset.name}`] = asset.url;
      return acc;
    }, {});

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
  }, [assets, dailyStartLiveStreaming, params, participantIds, rtmps]);

  useEffect(() => {
    if (!isLiveStreaming || !isOwner) return;

    const areParamsEqual = dequal(
      (layout as DailyUpdateStreamingCustomLayoutConfig).composition_params,
      params
    );

    const areParticipantsEqual = dequal(
      (layout as DailyUpdateStreamingCustomLayoutConfig).video,
      participantIds
    );

    if (areParamsEqual && areParticipantsEqual) return;

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
    updateLiveStreaming,
    participantIds,
    isOwner,
  ]);

  const stopLiveStreaming = useCallback(
    () =>
      dailyStopLiveStreaming({
        instanceId: '40000000-4000-4000-8000-800000000000',
      }),
    [dailyStopLiveStreaming]
  );

  const enableBroadcast = useMemo(
    () => Object.values(rtmps ?? {}).some((rtmp) => rtmp.active),
    [rtmps]
  );

  return {
    enableBroadcast,
    isLiveStreaming,
    stopLiveStreaming,
    startLiveStreaming,
  };
};
