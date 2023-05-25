import React from 'react';

import { useSendSettingsQuality } from '@/hooks/useSendSettings';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const qualities = [
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

export function QualityToggle() {
  const { quality, updateQuality } = useSendSettingsQuality();

  return (
    <div className="flex flex-col gap-y-3">
      <Label>Send Quality</Label>
      <Select value={quality} onValueChange={updateQuality}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={quality} />
        </SelectTrigger>
        <SelectContent>
          {qualities.map((quality) => (
            <SelectItem key={quality.value} value={quality.value}>
              {quality.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
