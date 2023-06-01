import React from 'react';

import { Badge } from '@/components/ui/badge';
import { TabsTrigger } from '@/components/ui/tabs';

interface Props {
  name: string;
  value: string;
  count: number;
  active: boolean;
}

export function TabHeader({ name, value, count, active }: Props) {
  return (
    <TabsTrigger value={value} className="w-20 rounded-md">
      <div className="flex flex-col items-center justify-center gap-2">
        <Badge variant={active ? 'secondary' : 'default'}>{count}</Badge>
        {name}
      </div>
    </TabsTrigger>
  );
}
