import { DailyEventObjectTrack } from '@daily-co/daily-js';
import { useDailyEvent } from '@daily-co/daily-react-hooks';
import React, { memo, useEffect, useRef } from 'react';
import { useCallback } from 'react';

import { Loopback } from '../../utils/loopback';

const WAT = () => {
  const audioEl = useRef<HTMLAudioElement>(null);
  const audioCtx = useRef<AudioContext>(null);
  const destination = useRef<MediaStreamAudioDestinationNode>(null);
  const inputNodes = useRef<Record<string, MediaStreamAudioSourceNode>>({});

  useEffect(() => {
    if (!audioEl.current) return;
    // webkitAudioContext is not defined in TS.
    // @ts-ignore
    const AC = AudioContext || webkitAudioContext;
    // @ts-ignore
    audioCtx.current = window.audioContext ?? new AC();
    destination.current = audioCtx.current.createMediaStreamDestination();
    // @ts-ignore
    window['dailyAudioNodes'] = inputNodes.current;

    let loopback: Loopback;
    async function setupLoopback() {
      loopback = new Loopback();
      await loopback.start(destination.current.stream);
      const loopbackStream = loopback.getLoopback();
      audioEl.current.srcObject = loopbackStream;
      try {
        await audioEl.current.play();
      } catch (e) {
        if (e instanceof DOMException && e.name === 'NotAllowedError') {
          console.log('Audio Autoplay failed');
        }
      }
    }
    setupLoopback();

    return () => {
      loopback.destroy();
    };
  }, []);

  useDailyEvent(
    'track-started',
    useCallback(async ({ participant, track }: DailyEventObjectTrack) => {
      if (track.kind !== 'audio' || participant?.local) return;
      if (Object.keys(inputNodes.current).includes(track.id)) return;
      const mediaStream = new MediaStream([track]);
      const node = new MediaStreamAudioSourceNode(audioCtx.current, {
        mediaStream,
      });

      const mutedAudio = new Audio();
      mutedAudio.muted = true;
      mutedAudio.srcObject = mediaStream;
      try {
        await mutedAudio.play();
      } catch (e) {
        if (e instanceof DOMException && e.name === 'NotAllowedError') {
          console.log('Audio Autoplay failed');
        }
      }

      inputNodes.current[track.id] = node;
      node.connect(destination.current);
    }, []),
  );

  useDailyEvent(
    'track-stopped',
    useCallback(({ participant, track }: DailyEventObjectTrack) => {
      if (track.kind !== 'audio' || participant?.local) return;
      const node = inputNodes.current?.[track.id];
      if (!node) return;
      node.disconnect();
      delete inputNodes.current[track.id];
    }, []),
  );

  return <audio autoPlay playsInline ref={audioEl} />;
};

export const WebAudioTracks = memo(WAT);
WebAudioTracks.displayName = 'WebAudioTracks';
