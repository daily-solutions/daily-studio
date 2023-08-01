import { Param } from '@/types/params';

export const singleParams = (
  participants: { label: string; value: string }[]
): Param[] => [
  {
    id: 'single-layout-heading',
    type: 'heading',
    label: 'Single Layout Settings',
    render: { key: 'mode', value: 'single' },
  },
  {
    id: 'custom.layout.single.participant',
    label: 'Single Participant',
    type: 'enum',
    values: participants,
    defaultValue: participants?.[0]?.value,
    render: { key: 'mode', value: 'single' },
  },
];
