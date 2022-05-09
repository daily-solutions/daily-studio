import { useNetwork, useParticipantIds } from '@daily-co/daily-react-hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Portal } from 'react-portal';

import { isIOSMobile, isSafari } from '../../utils/browserConfig';
import AudioTrack from './AudioTrack';
import { WebAudioTracks } from './WebAudioTracks';
import { DailyParticipant } from '@daily-co/daily-js';

export const AudioTracks = () => {
  const { topology } = useNetwork();
  const [isClient, setIsClient] = useState(false);

  const subscribedIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) =>
        !p.local &&
        (p.tracks.audio.subscribed === true ||
          p.tracks.screenAudio.subscribed === true),
      [],
    ),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const playTracks = () => {
      document
        .querySelectorAll('.audioTracks audio')
        // @ts-ignore
        .forEach(async (audio: HTMLAudioElement) => {
          try {
            if (audio.paused && audio.readyState === audio.HAVE_ENOUGH_DATA) {
              await audio?.play();
            }
          } catch (e) {
            if (e instanceof DOMException && e.name === 'NotAllowedError') {
              console.log('Autoplay failed');
            }
          }
        });
    };

    navigator.mediaDevices.addEventListener('devicechange', playTracks);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', playTracks);
    };
  }, []);

  const tracksComponent = useMemo(() => {
    if (isSafari() || isIOSMobile() || topology === 'peer') {
      return subscribedIds.map(sessionId => (
        // @ts-ignore
        <AudioTrack key={sessionId} sessionId={sessionId} />
      ));
    }
    return <WebAudioTracks />;
  }, [subscribedIds, topology]);

  // Only render audio tracks in browser
  if (!isClient) return null;

  return (
    <Portal key="AudioTracks">
      <div className="audioTracks">
        {tracksComponent}
        <style jsx>{`
          .audioTracks {
            position: absolute;
            visibility: hidden;
          }
        `}</style>
      </div>
    </Portal>
  );
};
