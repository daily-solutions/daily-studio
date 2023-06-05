import { Asset } from './asset';

export type MeetingSessionState = {
  assets: {
    [key: string]: Asset;
  };
};
