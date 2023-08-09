import { atom, useRecoilState } from 'recoil';

type VideoSimulcastLayers = 0 | 1 | 2;

type VideoLayerTypeState = {
  layerBasedOnNetwork: VideoSimulcastLayers;
  layerBasedOnCPU: VideoSimulcastLayers;
};

type SendVideoLayerTypeState = VideoLayerTypeState & {
  layerBasedOnScreenShare: VideoSimulcastLayers;
};

type ReceiveVideoLayerTypeState = VideoLayerTypeState & {
  layerBasedOnParticipantCount: VideoSimulcastLayers;
};

type VideoLayerState = {
  send: SendVideoLayerTypeState;
  receive: ReceiveVideoLayerTypeState;
};

const videoLayerState = atom<VideoLayerState>({
  key: 'video-layer-state',
  default: {
    send: {
      layerBasedOnNetwork: 2,
      layerBasedOnCPU: 2,
      layerBasedOnScreenShare: 2,
    },
    receive: {
      layerBasedOnNetwork: 2,
      layerBasedOnParticipantCount: 2,
      layerBasedOnCPU: 2,
    },
  },
});

export const useVideoLayer = () => useRecoilState(videoLayerState);
