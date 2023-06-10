import { Param } from '@/types/params';

import { PositionCorner } from './positions';

export const imageParams = (
  options: string[],
  defaultValue?: string
): Param[] => {
  return [
    {
      id: 'showImageOverlay',
      label: 'Show Image Overlay',
      type: 'boolean',
      defaultValue: false,
    },
    {
      id: 'image.assetName',
      label: 'Asset Name',
      type: 'enum',
      defaultValue: defaultValue ? defaultValue : 'overlay.png',
      values: ['overlay.png', ...options],
    },
    {
      id: 'image.enableFade',
      label: 'Enable Fade Animation',
      type: 'boolean',
      defaultValue: true,
    },
    {
      id: 'image.position',
      label: 'Image Position',
      type: 'enum',
      defaultValue: PositionCorner.TOP_RIGHT,
      values: Object.values(PositionCorner),
    },
    {
      id: 'image.fullScreen',
      label: 'Full Screen',
      type: 'boolean',
      defaultValue: false,
    },
    {
      id: 'image.aspectRatio',
      label: 'Image Aspect Ratio',
      type: 'number',
      defaultValue: 1.778,
      step: 0.1,
    },
    {
      id: 'image.height_gu',
      label: 'Height of the Image',
      type: 'number',
      defaultValue: 12,
      step: 0.1,
    },
    {
      id: 'image.margin_gu',
      label: 'Margin around the image',
      type: 'number',
      defaultValue: 1.5,
      step: 0.1,
    },
    {
      id: 'image.opacity',
      label: 'Opacity',
      type: 'number',
      defaultValue: 1,
      step: 0.1,
    },
  ];
};
