import { Asset } from '@/types/asset';
import { RTMP } from '@/types/rtmp';

export type MeetingSessionState = {
  assets: {
    [key: string]: Asset;
  };
  rtmps: {
    [key: string]: RTMP;
  };
};
