import {
  dominantParams,
  gridParams,
  pipParams,
  singleParams,
  splitParams,
} from '@/constants/layout';

import { Param } from '@/types/params';

export const viewParams = (
  participants: { label: string; value: string }[]
): Param[] => [
  ...gridParams,
  ...dominantParams,
  ...splitParams(participants),
  ...pipParams(participants),
  ...singleParams(participants),
  {
    id: 'label-heading',
    type: 'heading',
    label: 'Label Settings',
  },
  {
    id: 'videoSettings.showParticipantLabels',
    label: 'Show Participant Labels',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'videoSettings.labels.fontFamily',
    label: 'Participant Label Font Family',
    type: 'enum',
    defaultValue: 'Roboto',
    values: [
      'Roboto',
      'RobotoCondensed',
      'Bitter',
      'Exo',
      'Magra',
      'SuezOne',
      'Teko',
    ],
  },
  {
    id: 'videoSettings.labels.fontWeight',
    label: 'Participant Label Font Weight',
    type: 'enum',
    defaultValue: '600',
    values: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    id: 'videoSettings.labels.fontSize_pct',
    label: 'Participant Label Font Size',
    type: 'number',
    defaultValue: 100,
  },
  {
    id: 'videoSettings.labels.offset_x_gu',
    label: 'Participant Label Offset X',
    type: 'number',
    defaultValue: 0,
  },
  {
    id: 'videoSettings.labels.offset_y_gu',
    label: 'Participant Label Offset Y',
    type: 'number',
    defaultValue: 0,
  },
  {
    id: 'videoSettings.labels.color',
    label: 'Participant Label Text Color',
    type: 'color',
    defaultValue: '#ffffff',
  },
  {
    id: 'videoSettings.labels.strokeColor',
    label: 'Participant Label Stroke Color',
    type: 'color',
    defaultValue: '#000000',
  },
];
