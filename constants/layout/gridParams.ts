import { Param } from '@/types/params';

export const gridParams: Param[] = [
  {
    id: 'grid-layout-heading',
    type: 'heading',
    label: 'Grid Layout Settings',
    render: { key: 'mode', value: 'grid' },
  },
  {
    id: 'videoSettings.grid.preserveAspectRatio',
    label: 'Preserve Grid Aspect Ratio',
    type: 'boolean',
    defaultValue: true,
    render: { key: 'mode', value: 'grid' },
  },
  {
    id: 'videoSettings.grid.highlightDominant',
    label: 'Grid Highlight Active Speaker',
    type: 'boolean',
    defaultValue: true,
    render: { key: 'mode', value: 'grid' },
  },
  {
    id: 'videoSettings.grid.useDominantForSharing',
    label: 'Switch to dominant when sharing',
    type: 'boolean',
    defaultValue: false,
    render: { key: 'mode', value: 'grid' },
  },
  {
    id: 'videoSettings.grid.itemInterval_gu',
    label: 'Margin between grid tiles (-1 for auto)',
    type: 'number',
    defaultValue: -1,
    render: { key: 'mode', value: 'grid' },
  },
  {
    id: 'videoSettings.grid.outerPadding_gu',
    label: 'Padding around grid tiles (-1 for auto)',
    type: 'number',
    defaultValue: -1,
    render: { key: 'mode', value: 'grid' },
  },
];
