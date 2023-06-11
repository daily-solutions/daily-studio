import { Param } from '@/types/params';

export const splitParams: Param[] = [
  {
    id: 'split-layout-heading',
    type: 'heading',
    label: 'Split Layout Settings',
    render: { key: 'mode', value: 'split' },
  },
  {
    id: 'videoSettings.split.margin_gu',
    label: 'Split Layout Margin',
    type: 'number',
    defaultValue: 0,
    step: 0.1,
    render: { key: 'mode', value: 'split' },
  },
  {
    id: 'videoSettings.split.direction',
    label: 'Split Layout Direction',
    type: 'enum',
    defaultValue: 'auto-by-viewport',
    values: ['auto-by-viewport', 'vertical', 'horizontal'],
    render: { key: 'mode', value: 'split' },
  },
];
