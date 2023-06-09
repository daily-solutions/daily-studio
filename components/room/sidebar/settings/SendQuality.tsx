import React, { useCallback, useMemo } from 'react';
import { Quality, useSendQualityState } from '@/states/sendQualityState';
import { usePermissions } from '@daily-co/daily-react';

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
  { label: 'High definition (720p)', value: 'high' },
  { label: 'Standard definition (360p)', value: 'medium' },
  { label: 'Low definition (180p)', value: 'low' },
];

export function SendQuality() {
  const [quality, setQuality] = useSendQualityState();
  const { quality: sendQuality, updateQuality } = useSendSettingsQuality();
  const { hasPresence } = usePermissions();

  const handleQualityChange = useCallback(
    async (value: Quality) => {
      setQuality(value);

      if (value === 'auto') return;
      await updateQuality(value);
    },
    [setQuality, updateQuality]
  );

  const presentQuality = useMemo(
    () => qualities.find((q) => q.value === sendQuality)?.label,
    [sendQuality]
  );

  if (!hasPresence) return null;

  return (
    <div className="flex flex-col gap-y-3">
      <Label>Send Quality</Label>
      <Select value={quality} onValueChange={handleQualityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={quality} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto - {presentQuality}</SelectItem>
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
