import { useCallback, useEffect } from 'react';
import { useParams } from '@/states/params';
import { RTMP, useRTMP } from '@/states/rtmpState';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import { useAppMessage } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { getDiff } from '@/lib/getDiff';

interface SyncParams {
  type: 'params';
  params: Record<string, any>;
}

interface SyncRTMP {
  type: 'rtmp';
  rtmps: Record<string, RTMP>;
}

type SyncParamsAppMessage = SyncParams | SyncRTMP;

export const useSyncParams = (vcsCompRef) => {
  const [params, setParams] = useParams();
  const [rtmps, setRTMPs] = useRTMP();

  const sendAppMessage = useAppMessage<SyncParamsAppMessage>({
    onAppMessage: useCallback(
      (ev: DailyEventObjectAppMessage<SyncParamsAppMessage>) => {
        const { data } = ev;
        switch (data.type) {
          case 'params':
            setParams(data.params);
            break;
          case 'rtmp':
            if (dequal(data.rtmps, rtmps)) return;
            setRTMPs(data.rtmps);
            break;
          default:
            break;
        }
      },
      [rtmps, setParams, setRTMPs]
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

export const useSyncRTMPs = () => {
  const sendAppMessage = useAppMessage<SyncRTMP>();

  const updateRTMPs = useCallback(
    (rtmps) => sendAppMessage({ type: 'rtmp', rtmps }),
    [sendAppMessage]
  );

  return { updateRTMPs };
};
