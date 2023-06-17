import { useEffect } from 'react';
import {
  DailyCpuLoadStats,
  DailyEventObjectCpuLoadEvent,
} from '@daily-co/daily-js';
import { useDaily, useDailyEvent } from '@daily-co/daily-react';
import { atom, useRecoilState } from 'recoil';

const cpuLoadStatsState = atom<
  Pick<DailyCpuLoadStats, 'cpuLoadState' | 'cpuLoadStateReason'>
>({
  key: 'cpu-load-state',
  default: undefined,
});

export const useCPULoad = () => {
  const daily = useDaily();
  const [cpuLoadStats, setCPULoadStats] = useRecoilState(cpuLoadStatsState);

  useEffect(() => {
    if (!daily || daily.isDestroyed()) return;
    const handleInitCPULoad = async () => {
      const { cpuLoadState, cpuLoadStateReason } =
        await daily.getCpuLoadStats();
      setCPULoadStats({ cpuLoadState, cpuLoadStateReason });
    };

    handleInitCPULoad();
  }, [daily, setCPULoadStats]);

  useDailyEvent('cpu-load-change', (ev: DailyEventObjectCpuLoadEvent) =>
    setCPULoadStats({
      cpuLoadState: ev.cpuLoadState,
      cpuLoadStateReason: ev.cpuLoadStateReason,
    })
  );

  return { ...cpuLoadStats };
};
