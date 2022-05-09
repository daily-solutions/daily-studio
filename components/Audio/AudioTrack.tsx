import {
  useAudioTrack,
  useScreenAudioTrack,
} from '@daily-co/daily-react-hooks';
import { useEffect, useRef } from 'react';

interface Props {
  sessionId: string;
}

const AudioTrack = ({ sessionId }: Props) => {
  const audioEl = useRef<HTMLAudioElement>(null);
  const screenAudioEl = useRef<HTMLAudioElement>(null);
  const audio = useAudioTrack(sessionId);
  const screenAudio = useScreenAudioTrack(sessionId);

  useEffect(() => {
    const audioTag = audioEl.current;
    if (!audioTag || !audio?.persistentTrack) return;
    let playTimeout: NodeJS.Timeout;
    const handleCanPlay = () => {
      playTimeout = setTimeout(() => {
        console.log(`Can't play audio for sessionId "${sessionId}".`);
      }, 1500);
    };
    const handlePlay = () => {
      clearTimeout(playTimeout);
    };
    audioTag.addEventListener('canplay', handleCanPlay);
    audioTag.addEventListener('play', handlePlay);
    audioTag.srcObject = new MediaStream([audio?.persistentTrack]);

    return () => {
      audioTag?.removeEventListener('canplay', handleCanPlay);
      audioTag?.removeEventListener('play', handlePlay);
    };
  }, [audio?.persistentTrack, sessionId]);

  useEffect(() => {
    const screenAudioTag = screenAudioEl.current;
    if (!screenAudioTag || !screenAudio?.persistentTrack) return;
    let playTimeout: NodeJS.Timeout;
    const handleCanPlay = () => {
      playTimeout = setTimeout(() => {
        console.log(`Can't play screenAudio for sessionId "${sessionId}".`);
      }, 1500);
    };
    const handlePlay = () => {
      clearTimeout(playTimeout);
    };
    screenAudioTag.addEventListener('canplay', handleCanPlay);
    screenAudioTag.addEventListener('play', handlePlay);
    screenAudioTag.srcObject = new MediaStream([screenAudio?.persistentTrack]);

    return () => {
      screenAudioTag?.removeEventListener('canplay', handleCanPlay);
      screenAudioTag?.removeEventListener('play', handlePlay);
    };
  }, [screenAudio?.persistentTrack, sessionId]);

  return (
    <>
      <audio autoPlay playsInline ref={audioEl} />
      <audio autoPlay playsInline ref={screenAudioEl} />
    </>
  );
};

export default AudioTrack;
