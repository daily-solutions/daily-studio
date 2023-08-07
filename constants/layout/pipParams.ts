import { PositionCorner } from '@/constants/positions';

import { Param } from '@/types/params';

export const pipParams = (
  participants: { label: string; value: string }[],
): Param[] => [
  {
    id: 'pip-layout-heading',
    type: 'heading',
    label: 'PiP Layout Settings',
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'custom.layout.pip.participant1',
    label: 'PiP Main Participant',
    type: 'enum',
    values: participants,
    defaultValue: participants?.[0]?.value,
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'custom.layout.pip.participant2',
    label: 'PiP Mini Participant',
    type: 'enum',
    values: participants,
    defaultValue: participants?.[1]?.value,
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
    type: 'number',
    defaultValue: 12,
    step: 1,
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.margin_gu',
    label: 'Margin around the Picture in Picture layout',
    type: 'number',
    defaultValue: 1.5,
    step: 0.1,
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.aspectRatio',
    label: 'PIP Aspect ratio',
    type: 'number',
    defaultValue: 1,
    step: 0.1,
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
