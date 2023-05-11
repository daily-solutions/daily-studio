import React from 'react';
import { useParams } from '@/states/params';

import { Param } from '@/types/params';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

type Props = {
  field: Param;
};

export const FormField = ({ field }: Props) => {
  const [params, setParams] = useParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field.type === 'boolean') {
      setParams((params: { [key: string]: any }) => ({
        ...params,
        [e.target.name]: e.target.checked,
      }));
    } else {
      setParams((params: { [key: string]: any }) => ({
        ...params,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleOnSelectChange = (value: string) => {
    setParams((params: { [key: string]: any }) => ({
      ...params,
      [field.id]: value,
    }));
  };

  const handleCheckedChange = (checked: boolean) => {
    setParams((params: { [key: string]: any }) => ({
      ...params,
      [field.id]: checked,
    }));
  };

  const handleSlideChange = (value: number[]) => {
    setParams((params: { [key: string]: any }) => ({
      ...params,
      [field.id]: value[0],
    }));
  };

  const handleOnClick = (field: Param) => {
    setParams((params: { [key: string]: any }) => ({
      ...params,
      [field.id]: (params[field.id] ?? field.defaultValue) + 1,
    }));
  };

  const render = () => {
    switch (field.type) {
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
              <Input
                type="color"
                name={field.id}
                value={params?.[field.id] || field.defaultValue}
                onChange={handleChange}
                className="w-20 rounded-md border-none p-0 outline-none"
              />
              <Input
                type="text"
                name={field.id}
                value={params?.[field.id] || field.defaultValue}
                onChange={handleChange}
              />
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
