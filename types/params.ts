export type BasicParam = {
  id: string;
  label: string;
  disabled?: boolean;
  render?: { key: string; value: string | boolean | number };
  description?: string;
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
  values: string[] | { label: string; value: string }[];
};

type StringParams = {
  type: 'string';
  defaultValue: string;
};

type TextParams = {
  type: 'text';
  defaultValue: string;
};

type ColorParams = {
  type: 'color';
  defaultValue: string;
};

type ButtonParams = {
  type: 'button';
  defaultValue: number;
};

type HeadingParams = {
  type: 'heading';
};

export type Param = BasicParam &
  (
    | BooleanParams
    | RangeParams
    | EnumParams
    | NumberParams
    | StringParams
    | TextParams
    | ColorParams
    | ButtonParams
    | HeadingParams
  );
