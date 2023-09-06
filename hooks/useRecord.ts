import { useCallback, useEffect } from 'react';
import { useParams } from '@/states/params';
import { useToast } from '@/ui/useToast';
import {
  DailyEventObjectRecordingError,
  DailyUpdateStreamingCustomLayoutConfig,
} from '@daily-co/daily-js';
import { useRecording } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { useIsOwner } from '@/hooks/useIsOwner';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { useStage } from '@/hooks/useStage';

export const useRecord = () => {
  const { toast } = useToast();
  const isOwner = useIsOwner();
  const {
    isRecording,
    layout,
    startRecording: dailyStartRecording,
    updateRecording,
    stopRecording: dailyStopRecording,
  } = useRecording({
    // @ts-expect-error bug in @daily-co/daily-react
    onRecordingError: useCallback(
      (ev: DailyEventObjectRecordingError) => {
        toast({
          title: 'Recording failed',
          description: ev.errorMsg,
          variant: 'destructive',
        });
      },
      [toast],
    ),
  });

  const [params] = useParams();
  const [{ assets }] = useMeetingSessionState<MeetingSessionState>();

  const { participantIds } = useStage();

  const startRecording = useCallback(() => {
    const session_assets = Object.values(assets ?? {}).reduce(
      (acc: { [key: string]: string }, asset) => {
        acc[`images/${asset.name}`] = asset.url;
        return acc;
      },
      {},
    );

    const viewport = params?.['custom.viewport'];
    const { width, height } =
      viewport === 'portrait'
        ? { width: 720, height: 1280 }
        : { width: 1280, height: 720 };

    dailyStartRecording({
      instanceId: '40000008-4008-4000-8008-800000000004',
      width,
      height,
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
    toast({
      title: 'Starting recording',
      description: 'Your recording will be started in a few seconds',
    });
  }, [assets, dailyStartRecording, params, participantIds, toast]);

  useEffect(() => {
    if (!isRecording || !isOwner) return;

    const areParamsEqual = dequal(
      (layout as DailyUpdateStreamingCustomLayoutConfig).composition_params,
      params,
    );

    const areParticipantsEqual = dequal(
      (layout as DailyUpdateStreamingCustomLayoutConfig).video,
      participantIds,
    );

    if (areParamsEqual && areParticipantsEqual) return;

    updateRecording({
      instanceId: '40000008-4008-4000-8008-800000000004',
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
  }, [params, layout, isRecording, updateRecording, participantIds, isOwner]);

  const stopRecording = useCallback(
    () =>
      dailyStopRecording({
        instanceId: '40000008-4008-4000-8008-800000000004',
      }),
    [dailyStopRecording],
  );

  return { isRecording, stopRecording, startRecording };
};
