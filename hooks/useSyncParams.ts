import { useCallback, useEffect } from 'react';
import { Asset, useAssets } from '@/states/assetState';
import { useParams } from '@/states/params';
import {
  ParticipantsState,
  useParticipantsState,
} from '@/states/participantsState';
import { RTMP, useRTMP } from '@/states/rtmpState';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import { useAppMessage } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { getDiff } from '@/lib/getDiff';

interface SyncParams {
  type: 'params';
  params: Record<string, any>;
}

interface SyncParticipants {
  type: 'participants';
  participants: ParticipantsState;
}

interface SyncAssets {
  type: 'assets';
  assets: Record<string, Asset>;
}

interface SyncRTMP {
  type: 'rtmp';
  rtmps: Record<string, RTMP>;
}

type SyncParamsAppMessage =
  | SyncParams
  | SyncParticipants
  | SyncAssets
  | SyncRTMP;

export const useSyncParams = (vcsCompRef) => {
  const [params, setParams] = useParams();
  const [paxState, setPaxState] = useParticipantsState();
  const [assets, setAssets] = useAssets();
  const [rtmps, setRTMPs] = useRTMP();

  const sendAppMessage = useAppMessage<SyncParamsAppMessage>({
    onAppMessage: useCallback(
      (ev: DailyEventObjectAppMessage<SyncParamsAppMessage>) => {
        const { data } = ev;
        switch (data.type) {
          case 'params':
            setParams(data.params);
            break;
          case 'participants':
            if (dequal(data.participants, paxState)) return;
            setPaxState(data.participants);
            break;
          case 'assets':
            if (dequal(data.assets, assets)) return;
            setAssets(data.assets);
            break;
          case 'rtmp':
            if (dequal(data.rtmps, rtmps)) return;
            setRTMPs(data.rtmps);
            break;
          default:
            break;
        }
      },
      [assets, paxState, rtmps, setAssets, setParams, setPaxState, setRTMPs]
    ),
  });

  useEffect(() => {
    if (!vcsCompRef.current) return;

    const diff = getDiff(vcsCompRef.current?.paramValues, params);
    if (
      diff &&
      Object.keys(diff).length === 0 &&
      Object.getPrototypeOf(diff) === Object.prototype
    )
      return;

    for (const key in diff) {
      vcsCompRef.current.sendParam(key, diff[key]);
    }

    // send params to other participants
    sendAppMessage({ type: 'params', params });
  }, [params, sendAppMessage, vcsCompRef]);
};

export const useSyncParticipants = () => {
  const sendAppMessage = useAppMessage<SyncParticipants>();

  const updateParticipants = useCallback(
    (participants) => sendAppMessage({ type: 'participants', participants }),
    [sendAppMessage]
  );

  return { updateParticipants };
};

export const useSyncAssets = () => {
  const sendAppMessage = useAppMessage<SyncAssets>();

  const updateAssets = useCallback(
    (assets) => sendAppMessage({ type: 'assets', assets }),
    [sendAppMessage]
  );

  return { updateAssets };
};

export const useSyncRTMPs = () => {
  const sendAppMessage = useAppMessage<SyncRTMP>();

  const updateRTMPs = useCallback(
    (rtmps) => sendAppMessage({ type: 'rtmp', rtmps }),
    [sendAppMessage]
  );

  return { updateRTMPs };
};
