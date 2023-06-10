import { Param } from '@/types/params';

export const configParams: Param[] = [
  {
    id: 'default-heading',
    type: 'heading',
    label: 'Default Settings',
  },
  {
    id: 'videoSettings.preferScreenshare',
    label: 'Prefer Screenshare',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'videoSettings.omitPausedVideo',
    label: 'Omit Paused Video',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'videoSettings.omitAudioOnly',
    label: 'Omit Audio Only',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'videoSettings.omitExtraScreenshares',
    label: 'Omit Extra Screenshares',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'videoSettings.roundedCorners',
    label: 'Round Corners',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'videoSettings.cornerRadius_gu',
    label: 'Corner Radius',
    type: 'number',
    defaultValue: 1.2,
  },
  {
    id: 'scale-heading',
    type: 'heading',
    label: 'Scale Settings',
  },
  {
    id: 'videoSettings.scaleMode',
    label: 'Scale Mode',
    type: 'enum',
    defaultValue: 'fill',
    values: ['fill', 'fit'],
  },
  {
    id: 'videoSettings.scaleModeForScreenshare',
    label: 'Screenshare Scale Mode',
    type: 'enum',
    defaultValue: 'fit',
    values: ['fill', 'fit'],
  },
  {
    id: 'highlight-heading',
    type: 'heading',
    label: 'Highlight Settings',
  },
  {
    id: 'videoSettings.highlight.color',
    label: 'Active Speaker Highlight Color',
    type: 'color',
    defaultValue: '#000000',
  },
  {
    id: 'videoSettings.highlight.stroke_gu',
    label: 'Active Speaker Highlight Stroke Width',
    type: 'number',
    defaultValue: 0.2,
  },
  {
    id: 'color-heading',
    type: 'heading',
    label: 'Color Settings',
  },
  {
    id: 'videoSettings.placeholder.bgColor',
    label: 'Video Placeholder BG',
    type: 'color',
    defaultValue: '#003250',
  },
  {
    id: 'margin-heading',
    type: 'heading',
    label: 'Margin Settings',
  },
  {
    id: 'videoSettings.margin.left_gu',
    label: 'Video Margin Left',
    type: 'number',
    defaultValue: 0,
  },
  {
    id: 'videoSettings.margin.right_gu',
    label: 'Video Margin Right',
    type: 'number',
    defaultValue: 0,
  },
  {
    id: 'videoSettings.margin.top_gu',
    label: 'Video Margin Top',
    type: 'number',
    defaultValue: 0,
  },
  {
    id: 'videoSettings.margin.bottom_gu',
    label: 'Video Margin Bottom',
    type: 'number',
    defaultValue: 0,
  },
];
