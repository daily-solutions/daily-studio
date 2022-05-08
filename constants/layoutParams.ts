import { ReactComponent as GridView } from '../icons/grid-md.svg';
import { ReactComponent as SingleView } from '../icons/single-md.svg';
import { ReactComponent as PIPView } from '../icons/pip-md.svg';
import { ReactComponent as SpeakerView } from '../icons/speaker-md.svg';
import { ReactComponent as SplitView } from '../icons/split-md.svg';
import { Param } from '../types/params';

export const layoutParams: Param[] = [
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
];
