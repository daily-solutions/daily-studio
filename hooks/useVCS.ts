import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from '@/states/params';
import { useDaily, useMeetingState } from '@daily-co/daily-react';
import { DailyVCSWebRenderer } from '@daily-co/daily-vcs-web';
import * as comp from '@daily-co/vcs-composition-daily-baseline-web';
import { dequal } from 'dequal';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { useAspectRatio } from '@/hooks/useAspectRatio';

import { useMeetingSessionState } from './useMeetingSessionState';
import { useStage } from './useStage';

const getAssetUrlCb = (name: string, namespace: string, type: string) => {
  switch (type) {
    case 'font':
      return `/vcs/res/fonts/${name}`;
    case 'image':
      return namespace === 'composition'
        ? `/vcs/composition-assets/${name}`
        : `/vcs/res/test-assets/${name}`;
    default:
      return name;
  }
};

interface Props {
  aspectRatio: number;
  viewportRef: React.RefObject<HTMLDivElement>;
}

export const useVCS = ({ aspectRatio, viewportRef }: Props) => {
  const daily = useDaily();
  const meetingState = useMeetingState();

  const vcsCompRef = useRef<DailyVCSWebRenderer | null>(null);
  const outputElementRef = useRef<HTMLDivElement | null>(null);

  const [params] = useParams();
  const [{ assets }] = useMeetingSessionState<MeetingSessionState>();

  const [vcsInitialized, setVcsInitialized] = useState(false);

  const { width, height } = useAspectRatio({
    ref: viewportRef,
    aspectRatio,
  });

  const { orderedParticipantIds } = useStage();

  const createVCSView = useCallback(
    (el) => {
      if (
        !el ||
        meetingState !== 'joined-meeting' ||
        !width ||
        !height ||
        !daily
      )
        return;

      vcsCompRef.current = new DailyVCSWebRenderer(daily, comp, el, {
        getAssetUrlCb,
        viewportSize: { w: width, h: height },
        defaultParams: params,
        defaultAssets: Object.keys(assets ?? {}).reduce((acc, key) => {
          acc[key] = assets[key].url;
          return acc;
        }, {}),
        participantIds: orderedParticipantIds,
        callbacks: {
          onStart() {
            console.log('VCS Started');
            setVcsInitialized(true);
          },
          onStop() {
            console.log('VCS Stopped');
            setVcsInitialized(false);
          },
          onError(error) {
            console.error('VCS Error: ', error);
            setVcsInitialized(false);
          },
        },
      });
      vcsCompRef.current.start();
    },
    [meetingState, width, height, daily, params, orderedParticipantIds, assets],
  );

  useEffect(() => {
    if (vcsInitialized) return;

    createVCSView(outputElementRef.current);
  }, [createVCSView, vcsInitialized]);

  useEffect(() => {
    if (!vcsCompRef.current) return;

    const images = Object.keys(assets ?? {}).reduce((acc, key) => {
      acc[key] = assets[key].url;
      return acc;
    }, {});

    vcsCompRef.current.updateImageSources(images);
  }, [assets]);

  useEffect(() => {
    if (!vcsCompRef.current || dequal(vcsCompRef.current?.params, params))
      return;

    vcsCompRef.current.sendParams(params, 'replace');
  }, [params]);

  useEffect(() => {
    if (
      !vcsCompRef.current ||
      dequal(vcsCompRef.current.participants, orderedParticipantIds)
    )
      return;

    vcsCompRef.current.updateParticipantIds(orderedParticipantIds);
  }, [orderedParticipantIds]);

  return { outputElementRef, vcsCompRef, width, height };
};
