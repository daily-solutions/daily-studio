import { useCallback, useEffect } from 'react';
import { useAssets } from '@/states/assetState';
import { useParams } from '@/states/params';
import { useParticipantsState } from '@/states/participantsState';
import { DailyUpdateStreamingCustomLayoutConfig } from '@daily-co/daily-js';
import { useRecording } from '@daily-co/daily-react';
import { dequal } from 'dequal';

export const useRecord = () => {
  const {
    isRecording,
    layout,
    startRecording: dailyStartRecording,
    updateRecording,
    stopRecording: dailyStopRecording,
  } = useRecording();

  const [params] = useParams();
  const [paxState] = useParticipantsState();
  const [assets] = useAssets();

  const startRecording = useCallback(() => {
    const session_assets = Object.values(assets).reduce((acc, asset) => {
      acc[`image/${asset.name}`] = window.location.origin + asset.url;
      return acc;
    }, {});

    const participantIds = paxState.showAllParticipants
      ? ['*']
      : [...paxState.participantIds];

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
  }, [
    assets,
    dailyStartRecording,
    params,
    paxState.participantIds,
    paxState.showAllParticipants,
  ]);

  useEffect(() => {
    if (!isRecording) return;

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
  }, [
    params,
    layout,
    paxState.showAllParticipants,
    paxState.participantIds,
    isRecording,
    updateRecording,
  ]);

  const stopRecording = useCallback(
    () =>
      dailyStopRecording({
        instanceId: '40000008-4008-4000-8008-800000000004',
      }),
    [dailyStopRecording]
  );

  return { isRecording, stopRecording, startRecording };
};
