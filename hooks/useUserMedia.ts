import { useCallback, useEffect, useState } from 'react';

export const useUserMedia = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [error, setError] = useState<any>(null);

  const getUserMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);

      const videoTrack = mediaStream.getVideoTracks()[0];
      setVideoTrack(videoTrack);
    } catch (e) {
      setError(e);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    videoTrack,
    getUserMedia,
    error,
  };
};
