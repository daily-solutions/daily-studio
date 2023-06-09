import { useCallback, useEffect } from 'react';
import { DailyEventObjectSendSettingsUpdated } from '@daily-co/daily-js';
import { useDaily, useDailyEvent } from '@daily-co/daily-react';
import { atom, useRecoilState } from 'recoil';

type SendSettingsQuality = 'low' | 'medium' | 'high';

const sendSettingsQualityState = atom<SendSettingsQuality>({
  key: 'send-settings-quality',
  default: 'high',
});

export const useSendSettingsQuality = () => {
  const daily = useDaily();

  const [quality, setQuality] = useRecoilState(sendSettingsQualityState);

  useDailyEvent(
    'send-settings-updated',
    useCallback(
      (ev: DailyEventObjectSendSettingsUpdated) => {
        const { video } = ev.sendSettings;
        if (typeof video === 'object' && 'maxQuality' in video) {
          setQuality(video.maxQuality || 'high');
        }
      },
      [setQuality]
    )
  );

  const updateQuality = useCallback(
    async (quality: SendSettingsQuality) => {
      if (!daily) return;

      await daily.updateSendSettings({
        video: {
          maxQuality: quality,
        },
      });
    },
    [daily]
  );

  useEffect(() => {
    if (!daily) return;

    const { video } = daily.getSendSettings();
    if (typeof video === 'object' && 'maxQuality' in video)
      setQuality(video.maxQuality || 'high');
  }, [daily, setQuality]);

  return { quality, updateQuality };
};
