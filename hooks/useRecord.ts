import { useCallback, useEffect } from 'react';
import { useParams } from '@/states/params';
import { useToast } from '@/ui/useToast';
import { DailyUpdateStreamingCustomLayoutConfig } from '@daily-co/daily-js';
import { useRecording } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { useParticipants } from '@/hooks/useParticipants';

export const useRecord = () => {
  const { toast } = useToast();
  const {
    isRecording,
    layout,
    startRecording: dailyStartRecording,
    updateRecording,
    stopRecording: dailyStopRecording,
  } = useRecording({
    onRecordingError: useCallback(
      (ev) => {
        toast({
          title: 'Recording failed',
          description: ev.errorMsg,
          variant: 'destructive',
        });
      },
      [toast]
    ),
  });

  const [params] = useParams();
  const [{ assets }] = useMeetingSessionState<MeetingSessionState>();

  const { participantIds } = useParticipants();

  const startRecording = useCallback(() => {
    const session_assets = Object.values(assets ?? {}).reduce((acc, asset) => {
      acc[`images/${asset.name}`] = asset.url;
      return acc;
    }, {});

    dailyStartRecording({
      instanceId: '40000008-4008-4000-8008-800000000004',
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
  }, [assets, dailyStartRecording, params, participantIds]);

  useEffect(() => {
    if (!isRecording) return;

    const areParamsEqual = dequal(
      (layout as DailyUpdateStreamingCustomLayoutConfig).composition_params,
      params
    );

    const areParticipantsEqual = dequal(
      (layout as DailyUpdateStreamingCustomLayoutConfig).video,
      participantIds
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
  }, [params, layout, isRecording, updateRecording, participantIds]);

  const stopRecording = useCallback(
    () =>
      dailyStopRecording({
        instanceId: '40000008-4008-4000-8008-800000000004',
      }),
    [dailyStopRecording]
  );

  return { isRecording, stopRecording, startRecording };
};
