import { useCallback } from 'react';
import { useRMPState } from '@/states/rmpState';
import {
  DailyRemoteMediaPlayerSettings,
  DailyRemoteMediaPlayerStartOptions,
} from '@daily-co/daily-js';
import { useDaily, useDailyEvent } from '@daily-co/daily-react';

interface Props {
  onError?: (error: string) => void;
}

export const useRMP = ({ onError = () => {} }: Props = {}) => {
  const daily = useDaily();
  const [rmp, setRMP] = useRMPState();

  useDailyEvent(
    'remote-media-player-started',
    useCallback(
      (ev) => {
        setRMP({
          isPlaying: ev.remoteMediaPlayerState === 'playing',
          isPaused: ev.remoteMediaPlayerState === 'paused',
          sessionId: ev.session_id,
        });
      },
      [setRMP]
    )
  );

  useDailyEvent(
    'remote-media-player-updated',
    useCallback(
      (ev) => {
        setRMP({
          isPlaying: ev.remoteMediaPlayerState.state === 'playing',
          isPaused: ev.remoteMediaPlayerState.state === 'paused',
          sessionId: ev.session_id,
        });
      },
      [setRMP]
    )
  );

  useDailyEvent(
    'remote-media-player-stopped',
    useCallback(() => {
      setRMP({
        isPlaying: false,
        isPaused: false,
        sessionId: '',
      });
    }, [setRMP])
  );

  useDailyEvent(
    'nonfatal-error',
    useCallback(
      (ev) => {
        if (ev.type !== 'remote-media-player-error') return;

        setRMP({
          isPlaying: false,
          isPaused: false,
          sessionId: '',
        });
        onError?.(ev.errorMsg);
      },
      [onError, setRMP]
    )
  );

  const startRemoteMediaPlayer = useCallback(
    async (options: DailyRemoteMediaPlayerStartOptions) => {
      if (!daily) return;

      await daily.startRemoteMediaPlayer(options);
    },
    [daily]
  );

  const updateRemoteMediaPlayer = useCallback(
    async (settings: DailyRemoteMediaPlayerSettings) => {
      if (!daily || !rmp.sessionId) return;

      await daily.updateRemoteMediaPlayer({
        session_id: rmp.sessionId,
        settings,
      });
    },
    [daily, rmp.sessionId]
  );

  const stopRemoteMediaPlayer = useCallback(async () => {
    if (!daily || !rmp.sessionId) return;

    await daily.stopRemoteMediaPlayer(rmp.sessionId);
  }, [daily, rmp.sessionId]);

  return {
    ...rmp,
    startRemoteMediaPlayer,
    updateRemoteMediaPlayer,
    stopRemoteMediaPlayer,
  };
};
