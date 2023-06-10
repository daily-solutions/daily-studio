import { PositionEdge } from '@/constants/positions';

import { Param } from '@/types/params';

export const dominantParams: Param[] = [
  {
    id: 'dominant-layout-heading',
    type: 'heading',
    label: 'Dominant Layout Settings',
    render: { key: 'mode', value: 'dominant' },
  },
  {
    id: 'videoSettings.dominant.position',
    label: 'Active Speaker Position',
    type: 'enum',
    defaultValue: PositionEdge.LEFT,
    values: Object.values(PositionEdge),
    render: { key: 'mode', value: 'dominant' },
  },
  {
    id: 'videoSettings.dominant.splitPos',
    label: 'Active Speaker Width',
    type: 'range',
    defaultValue: 0.8,
    step: 0.1,
    min: 0,
    max: 1,
    render: { key: 'mode', value: 'dominant' },
  },
  {
    id: 'videoSettings.dominant.numChiclets',
    label: 'Number of tiles to display (except active speaker)',
    type: 'number',
    defaultValue: 5,
    render: { key: 'mode', value: 'dominant' },
  },
  {
    id: 'videoSettings.dominant.followDomFlag',
    label: 'Follow active speaker',
    type: 'boolean',
    defaultValue: true,
    render: { key: 'mode', value: 'dominant' },
  },
  {
    id: 'videoSettings.dominant.itemInterval_gu',
    label: 'Margin between chiclet items',
    type: 'number',
    defaultValue: 0.7,
    render: { key: 'mode', value: 'dominant' },
  },
  {
    id: 'videoSettings.dominant.outerPadding_gu',
    label: 'Padding around chiclet items',
    type: 'number',
    defaultValue: 0.5,
    render: { key: 'mode', value: 'dominant' },
  },
  {
    id: 'videoSettings.dominant.splitMargin_gu',
    label: 'Margin between active speaker and chiclet items',
    type: 'number',
    defaultValue: 0,
    render: { key: 'mode', value: 'dominant' },
  },
  {
    id: 'videoSettings.dominant.sharpCornersOnMain',
    label: 'Dominant view sharp corners',
    type: 'boolean',
    defaultValue: true,
    render: { key: 'mode', value: 'dominant' },
  },
];
