import { Param } from '../types/params';

export const videoParams: Param[] = [
  {
    id: 'video.url',
    label: 'Video URL',
    type: 'string',
    defaultValue:
      'https://cdn.glitch.global/19d94244-6ec6-4f25-8081-f17f3afe6209/demuxed-2021.mp4?v=1664834487295',
  },
  {
    id: 'video.start',
    label: 'Start video',
    type: 'button',
    defaultValue: 0,
  },
];
