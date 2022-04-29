import { FC, SVGProps } from 'react';

export type MenuItem = {
  label: string;
  value: string;
  icon: FC<SVGProps<SVGSVGElement>>;
};

export type BasicParam = {
  id: string;
  label: string;
  render?: { key: string; value: string | boolean | number };
};

export type MenuParams = {
  type: 'menu';
  defaultValue: 'single' | 'split' | 'grid' | 'dominant' | 'pip';
  menu: MenuItem[];
};

export type NumberParams = {
  type: 'number';
  defaultValue: number;
  step?: number;
  min?: number;
  max?: number;
};

export type BooleanParams = {
  type: 'boolean';
  defaultValue: boolean;
};

export type RangeParams = {
  type: 'range';
  defaultValue: number;
  step?: number;
  min: number;
  max: number;
};

export type EnumParams = {
  type: 'enum';
  defaultValue: string;
  values: string[];
};

type StringParams = {
  type: 'string';
  defaultValue: string;
};

type ColorParams = {
  type: 'color';
  defaultValue: string;
};

export type Param = BasicParam &
  (
    | MenuParams
    | BooleanParams
    | RangeParams
    | EnumParams
    | NumberParams
    | StringParams
    | ColorParams
  );
