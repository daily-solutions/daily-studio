import { PositionCorner } from './positions';
import { Param } from '../types/params';

export const imageParams: Param[] = [
  {
    id: 'showImageOverlay',
    label: 'Show Image Overlay',
    type: 'boolean',
    defaultValue: false,
  },
  {
    id: 'image.assetName',
    label: 'Asset Name',
    type: 'string',
    defaultValue: 'overlay.png',
    render: { key: 'showImageOverlay', value: true },
  },
  {
    id: 'image.position',
    label: 'Image Position',
    type: 'enum',
    defaultValue: PositionCorner.TOP_RIGHT,
    values: Object.values(PositionCorner),
    render: { key: 'showImageOverlay', value: true },
  },
  {
    id: 'image.fullScreen',
    label: 'Full Screen',
    type: 'boolean',
    defaultValue: false,
    render: { key: 'showImageOverlay', value: true },
  },
  {
    id: 'image.aspectRatio',
    label: 'Image Aspect Ratio',
    type: 'number',
    defaultValue: 1.778,
    step: 0.1,
    render: { key: 'showImageOverlay', value: true },
  },
  {
    id: 'image.height_vh',
    label: 'Height of the Image',
    type: 'number',
    defaultValue: 0.3,
    step: 0.1,
    render: { key: 'showImageOverlay', value: true },
  },
  {
    id: 'image.margin_vh',
    label: 'Margin around the image',
    type: 'number',
    defaultValue: 0.04,
    step: 0.01,
    render: { key: 'showImageOverlay', value: true },
  },
  {
    id: 'image.opacity',
    label: 'Opacity',
    type: 'number',
    defaultValue: 1,
    step: 0.1,
    render: { key: 'showImageOverlay', value: true },
  },
];
