import { ReactComponent as GridView } from '../icons/gridd-md.svg';
import { ReactComponent as SingleView } from '../icons/user-md.svg';
import { ReactComponent as PIPView } from '../icons/pip-md.svg';
import { ReactComponent as SpeakerView } from '../icons/speaker-md.svg';
import { ReactComponent as SplitView } from '../icons/split-md.svg';
import { PositionEdge, PositionCorner } from './positions';
import { Param } from '../types/params';

export const viewParams: Param[] = [
  {
    id: 'mode',
    label: 'Mode',
    type: 'menu',
    defaultValue: 'grid',
    menu: [
      { label: 'Single', value: 'single', icon: SingleView },
      { label: 'Split', value: 'split', icon: SplitView },
      { label: 'Grid', value: 'grid', icon: GridView },
      { label: 'Speaker', value: 'dominant', icon: SpeakerView },
      { label: 'PIP', value: 'pip', icon: PIPView },
    ],
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
    id: 'videoSettings.pip.position',
    label: 'Picture in Picture position',
    type: 'enum',
    defaultValue: PositionCorner.TOP_RIGHT,
    values: Object.values(PositionCorner),
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.height_vh',
    label: 'Height of the Picture in Picture',
    type: 'number',
    defaultValue: 0.3,
    step: 0.1,
    min: 0,
    max: 1,
    render: { key: 'mode', value: 'pip' },
  },
  {
    id: 'videoSettings.pip.margin_vh',
    label: 'Margin around the Picture in Picture layout',
    type: 'number',
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
];
