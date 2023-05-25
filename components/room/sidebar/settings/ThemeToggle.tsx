import React from 'react';
import { useTheme } from 'next-themes';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ThemeToggle() {
  const { theme, themes, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-y-3">
      <Label>Theme</Label>
      <Select value={theme} onValueChange={setTheme}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={theme} />
        </SelectTrigger>
        <SelectContent>
          {themes.map((field) => (
            <SelectItem key={field} value={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
