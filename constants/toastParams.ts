import { Param } from '../types/params';

export const toastParams: Param[] = [
  {
    id: 'toast.key',
    label: 'Send Toast',
    type: 'button',
    defaultValue: 0,
  },
  {
    id: 'toast.text',
    label: 'Text',
    type: 'string',
    defaultValue: 'Hello world',
  },
  {
    id: 'toast.duration_secs',
    label: 'Duration of Toast',
    type: 'number',
    min: 0,
    defaultValue: 4,
  },
  {
    id: 'toast.numTextLines',
    label: 'Number of text lines',
    type: 'number',
    min: 1,
    defaultValue: 2,
  },
  {
    id: 'toast.showIcon',
    label: 'Show Toast Icon',
    type: 'boolean',
    defaultValue: true,
  },
  {
    id: 'toast.icon.assetName',
    label: 'Toast Icon Asset Name',
    type: 'enum',
    defaultValue: 'party-popper_1f389.png',
    values: ['party-popper_1f389.png'],
  },
  {
    id: 'toast.color',
    label: 'Toast Color',
    type: 'color',
    defaultValue: 'rgba(15, 50, 110, 0.6)',
  },
  {
    id: 'toast.strokeColor',
    label: 'Toast Stroke Color',
    type: 'color',
    defaultValue: 'rgba(0, 0, 30, 0.44)',
  },
  {
    id: 'toast.text.color',
    label: 'Toast Text Color',
    type: 'string',
    defaultValue: '#fff',
  },
  {
    id: 'toast.text.fontFamily',
    label: 'Toast Font Family',
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
    id: 'toast.text.fontWeight',
    label: 'Toast Font Weight',
    type: 'enum',
    defaultValue: '500',
    values: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  },
  {
    id: 'toast.text.fontSize_pct',
    label: 'Toast Font Size',
    type: 'number',
    defaultValue: 100,
  },
];