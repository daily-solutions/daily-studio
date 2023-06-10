import { Param } from '@/types/params';

import { PositionHorizontal, PositionVertical } from './positions';

export const textParams: Param[] = [
  {
    id: 'showTextOverlay',
    label: 'Show Text Overlay?',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'text.content',
    label: 'Text',
    type: 'string',
    defaultValue: 'An example text overlay',
  },
  {
    id: 'text.align_horizontal',
    label: 'Horizontal Text Alignment',
    type: 'enum',
    defaultValue: PositionHorizontal.CENTER,
    values: Object.values(PositionHorizontal),
  },
  {
    id: 'text.align_vertical',
    label: 'Vertical Text Alignment',
    type: 'enum',
    defaultValue: PositionVertical.CENTER,
    values: Object.values(PositionVertical),
  },
  {
    id: 'text.offset_x_gu',
    label: 'X offset to text overlay position',
    type: 'number',
    defaultValue: 0,
  },
  {
    id: 'text.offset_y_gu',
    label: 'Y offset to text overlay position',
    type: 'number',
    defaultValue: 0,
  },
  {
    id: 'text.rotation_deg',
    label: 'Degrees to rotate (positive for clock-wise rotation)',
    type: 'number',
    defaultValue: 0,
    min: -360,
    max: 360,
  },
  {
    id: 'text.fontWeight',
    label: 'Font Weight',
    type: 'enum',
    defaultValue: '500',
    values: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    id: 'text.fontFamily',
    label: 'Font Family',
    type: 'enum',
    defaultValue: 'Roboto',
    values: [
      'Roboto',
      'RobotoCondensed',
      'Anton',
      'Bangers',
      'Bitter',
      'Exo',
      'Magra',
      'PermanentMarker',
      'SuezOne',
      'Teko',
    ],
  },
  {
    id: 'text.fontStyle',
    label: 'Font Style',
    type: 'enum',
    defaultValue: 'normal',
    values: ['normal', 'italic'],
  },
  {
    id: 'text.fontSize_gu',
    label: 'Font Size',
    type: 'number',
    defaultValue: 2.5,
  },
  {
    id: 'text.color',
    label: 'Text Color',
    type: 'color',
    defaultValue: '#FFFAC8',
  },
  {
    id: 'text.strokeColor',
    label: 'Text Stroke Color',
    type: 'color',
    defaultValue: '#000000',
  },
];
