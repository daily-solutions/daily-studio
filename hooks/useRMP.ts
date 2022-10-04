import {
  DailyEventObject,
  DailyEventObjectNonFatalError,
  DailyEventObjectRemoteMediaPlayerStopped,
  DailyEventObjectRemoteMediaPlayerUpdate,
  DailyRemoteMediaPlayerStartOptions,
  DailyRemoteMediaPlayerState,
  DailyRemoteMediaPlayerUpdateOptions,
} from '@daily-co/daily-js';
import { useDaily, useDailyEvent } from '@daily-co/daily-react-hooks';
import { useCallback } from 'react';
import { atom, useRecoilCallback, useRecoilValue } from 'recoil';

interface UseRMPArgs {
  onMediaPlayerStarted?(ev: DailyEventObject): void;
  onMediaPlayerStopped?(ev: DailyEventObjectRemoteMediaPlayerStopped): void;
  onMediaPlayerUpdated?(ev: DailyEventObjectRemoteMediaPlayerUpdate): void;
  onMediaPlayerError?(ev: DailyEventObject): void;
}

interface RMPState {
  error?: boolean;
  isPlaying: boolean;
  session_id: string;
  updatedBy?: string;
  remoteMediaPlayerState?: DailyRemoteMediaPlayerState;
}

const rmpState = atom<RMPState>({
  key: 'remote-media-player',
  default: {
    isPlaying: false,
    session_id: '',
  },
});

export const useRMP = ({
  onMediaPlayerError,
  onMediaPlayerStarted,
  onMediaPlayerStopped,
  onMediaPlayerUpdated,
}: UseRMPArgs = {}) => {
  const daily = useDaily();
  const state = useRecoilValue(rmpState);

  useDailyEvent(
    'remote-media-player-started',
    useRecoilCallback(
      ({ set }) =>
        (ev: DailyEventObject) => {
          set(rmpState, {
            error: false,
            isPlaying: ev.remoteMediaPlayerState.state === 'playing',
            session_id: ev.session_id,
            updatedBy: ev.updatedBy,
            remoteMediaPlayerState: ev.remoteMediaPlayerState,
          });
          setTimeout(() => onMediaPlayerStarted?.(ev), 0);
        },
      [onMediaPlayerStarted],
    ),
  );
  useDailyEvent(
    'remote-media-player-updated',
    useRecoilCallback(
      ({ set }) =>
        (ev: DailyEventObjectRemoteMediaPlayerUpdate) => {
          set(rmpState, prevState => ({
            ...prevState,
            updatedBy: ev?.updatedBy,
            isPlaying: ev.remoteMediaPlayerState.state === 'playing',
            remoteMediaPlayerState: ev.remoteMediaPlayerState,
          }));
          setTimeout(() => onMediaPlayerUpdated?.(ev), 0);
        },
      [onMediaPlayerUpdated],
    ),
  );
  useDailyEvent(
    'remote-media-player-stopped',
    useRecoilCallback(
      ({ set }) =>
        (ev: DailyEventObjectRemoteMediaPlayerStopped) => {
          set(rmpState, prevState => ({
            ...prevState,
            updatedBy: ev?.updatedBy,
            isPlaying: false,
            remoteMediaPlayerState: null,
          }));
          setTimeout(() => onMediaPlayerStopped?.(ev), 0);
        },
      [onMediaPlayerStopped],
    ),
  );
  useDailyEvent(
    'nonfatal-error',
    useRecoilCallback(
      ({ set }) =>
        (ev: DailyEventObjectNonFatalError) => {
          if (ev.type === 'remote-media-player-error') {
            set(rmpState, prevState => ({
              ...prevState,
              error: true,
              isPlaying: false,
              remoteMediaPlayerState: null,
            }));
            setTimeout(() => onMediaPlayerError?.(ev), 0);
          }
        },
      [onMediaPlayerError],
    ),
  );

  /**
   * Starts the remote media player with given options.
   */
  const startRemoteMediaPlayer = useCallback(
    (options: DailyRemoteMediaPlayerStartOptions) => {
      if (!daily) return;
      daily.startRemoteMediaPlayer(options);
    },
    [daily],
  );

  /**
   * Update the remote media player with given options.
   */
  const updateRemoteMediaPlayer = useCallback(
    (options: DailyRemoteMediaPlayerUpdateOptions) => {
      if (!daily) return;
      daily.updateRemoteMediaPlayer(options);
    },
    [daily],
  );

  /**
   * Stops the media player
   */
  const stopRemoteMediaPlayer = useCallback(
    (sessionId: string) => {
      if (!daily) return;
      daily.stopRemoteMediaPlayer(sessionId);
    },
    [daily],
  );

  return {
    ...state,
    startRemoteMediaPlayer,
    updateRemoteMediaPlayer,
    stopRemoteMediaPlayer,
  };
};
