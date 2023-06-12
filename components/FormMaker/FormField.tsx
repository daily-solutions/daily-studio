import React, { useCallback } from 'react';
import { useParams } from '@/states/params';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/Select';
import { Slider } from '@/ui/Slider';
import { Switch } from '@/ui/Switch';

import { Param } from '@/types/params';
import { useSyncParams } from '@/hooks/useSyncParams';

type Props = {
  field: Param;
};

export const FormField = ({ field }: Props) => {
  const [params] = useParams();
  const { updateParams } = useSyncParams();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field.type === 'boolean')
        updateParams({ [e.target.name]: e.target.checked });
      else updateParams({ [e.target.name]: e.target.value });
    },
    [field.type, updateParams]
  );

  const handleOnSelectChange = useCallback(
    (value: string) => updateParams({ [field.id]: value }),
    [field.id, updateParams]
  );

  const handleCheckedChange = useCallback(
    (checked: boolean) => updateParams({ [field.id]: checked }),
    [field.id, updateParams]
  );

  const handleSlideChange = useCallback(
    (value: number[]) => updateParams({ [field.id]: value[0] }),
    [field.id, updateParams]
  );

  const handleOnClick = useCallback(
    (field: Exclude<Param, { type: 'heading' }>) =>
      updateParams({
        [field.id]: (params[field.id] ?? field.defaultValue) + 1,
      }),
    [params, updateParams]
  );

  const render = () => {
    switch (field.type) {
      case 'heading':
        return (
          <div className="flex flex-col gap-y-2">
            <Label className="text-xs font-bold text-muted-foreground">
              {field.label}
            </Label>
          </div>
        );
      case 'boolean':
        return (
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Switch
              name={field.id}
              checked={params?.[field.id] ?? field.defaultValue}
              onCheckedChange={handleCheckedChange}
            />
          </div>
        );
      case 'enum':
        return (
          <div className="flex flex-col gap-y-2">
            <Label>{field.label}</Label>
            <Select
              value={params?.[field.id] || field.defaultValue}
              onValueChange={handleOnSelectChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={field.label} />
              </SelectTrigger>
              <SelectContent>
                {field.values.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'number':
        return (
          <div className="flex flex-col gap-y-2">
            <Label>{field.label}</Label>
            <Input
              type="number"
              name={field.id}
              value={params?.[field.id] || field.defaultValue}
              step={field?.step}
              min={field?.min}
              max={field?.max}
              onChange={handleChange}
            />
          </div>
        );
      case 'range':
        return (
          <div className="flex flex-col gap-y-4">
            <Label>{field.label}</Label>
            <Slider
              className="w-full"
              name={field.id}
              min={field.min}
              max={field.max}
              step={field.step}
              value={[params?.[field.id] || field.defaultValue]}
              onValueChange={handleSlideChange}
            />
          </div>
        );
      case 'color':
        return (
          <div className="flex flex-col gap-y-2">
            <Label>{field.label}</Label>
            <div className="flex items-center gap-x-2">
              <div className="relative w-full">
                <Input
                  type="text"
                  name={field.id}
                  value={params?.[field.id] || field.defaultValue}
                  onChange={handleChange}
                />
                <div className="absolute right-2 top-2">
                  <Input
                    type="color"
                    name={field.id}
                    value={params?.[field.id] || field.defaultValue}
                    onChange={handleChange}
                    className="m-0 h-6 w-6 border-none p-0"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'string':
        return (
          <div className="flex flex-col gap-y-2">
            <Label>{field.label}</Label>
            <Input
              name={field.id}
              value={params?.[field.id] || field.defaultValue}
              onChange={handleChange}
            />
          </div>
        );
      case 'button':
        return (
          <Button className="w-100" onClick={() => handleOnClick(field)}>
            {field.label}
          </Button>
        );
      default:
        return null;
    }
  };

  if (!field?.render || params?.[field.render.key] === field.render.value)
    return render();
  return null;
};
