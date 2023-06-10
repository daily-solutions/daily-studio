import { PositionCorner } from '@/constants/positions';

import { Param } from '@/types/params';

export const pipParams: Param[] = [
  {
    id: 'pip-layout-heading',
    type: 'heading',
    label: 'PiP Layout Settings',
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.position',
    label: 'Picture in Picture position',
    type: 'enum',
    defaultValue: PositionCorner.TOP_RIGHT,
    values: Object.values(PositionCorner),
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.height_gu',
    label: 'Height of the Picture in Picture',
    type: 'range',
    defaultValue: 0.3,
    step: 0.1,
    min: 0,
    max: 1,
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.margin_gu',
    label: 'Margin around the Picture in Picture layout',
    type: 'range',
    defaultValue: 0.04,
    step: 0.01,
    min: 0,
    max: 0.1,
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.aspectRatio',
    label: 'PIP Aspect ratio',
    type: 'range',
    defaultValue: 1,
    step: 0.1,
    min: 0,
    max: 1,
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.followDomFlag',
    label: 'Follow active speaker',
    type: 'boolean',
    defaultValue: false,
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.sharpCornersOnMain',
    label: 'Sharp corners on main video',
    type: 'boolean',
    defaultValue: true,
    render: { key: 'mode', value: 'pip' },
  },
];
