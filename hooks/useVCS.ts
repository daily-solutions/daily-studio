import React, { useCallback, useEffect, useRef } from 'react';
import { useParams } from '@/states/params';
import { useDaily } from '@daily-co/daily-react';
import { DailyVCSWebRenderer } from '@daily-co/daily-vcs-web';
// @ts-ignore
import * as comp from '@daily-co/vcs-composition-daily-baseline-web';
import { dequal } from 'dequal';

import { MeetingSessionState } from '@/types/meetingSessionState';

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
  const vcsCompRef = useRef<DailyVCSWebRenderer | null>(null);
  const vcsContainerRef = useRef<HTMLDivElement | null>(null);

  const [params] = useParams();
  const [{ assets }] = useMeetingSessionState<MeetingSessionState>();
  const { orderedParticipantIds } = useStage();

  const createVCSView = useCallback(() => {
    if (!vcsContainerRef.current || !daily) return;

    if (vcsCompRef.current) {
      vcsCompRef.current.stop();
      vcsCompRef.current = null;
    }

    vcsCompRef.current = new DailyVCSWebRenderer(
      daily,
      comp,
      vcsContainerRef.current,
      {
        getAssetUrlCb,
        viewportSize: { w: 1280, h: 720 },
        defaultParams: params,
        defaultAssets: Object.keys(assets ?? {}).reduce(
          (acc: { [key: string]: string }, key) => {
            acc[key] = assets[key].url;
            return acc;
          },
          {},
        ),
        participantIds: orderedParticipantIds,
        callbacks: {
          onStart() {
            console.log('VCS Started');
          },
          onStop() {
            console.log('VCS Stopped');
          },
          onError(error) {
            console.error('VCS Error: ', error);
          },
        },
      },
    );
    vcsCompRef.current.start();
  }, [daily, params, orderedParticipantIds, assets]);

  useEffect(() => {
    if (vcsCompRef.current) return;

    createVCSView();
  }, [createVCSView]);

  useEffect(() => {
    if (!vcsCompRef.current) return;

    const images = Object.keys(assets ?? {}).reduce(
      (acc: { [key: string]: string }, key) => {
        acc[key] = assets[key].url;
        return acc;
      },
      {},
    );

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

  useEffect(() => {
    if (!vcsCompRef.current || vcsCompRef.current.ratio === aspectRatio) return;

    vcsCompRef.current?.updateAspectRatio(aspectRatio);
  }, [aspectRatio]);

  useEffect(() => {
    const vcsComp = vcsCompRef.current;
    return () => vcsComp?.stop();
  }, [vcsCompRef]);

  return { vcsCompRef, vcsContainerRef };
};
