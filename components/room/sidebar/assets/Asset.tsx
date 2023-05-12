import Image from 'next/image';
import { Asset as AssetType } from '@/states/assetState';

const bytesToSize = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function Asset({ asset }: { asset: AssetType }) {
  return (
    <div className="flex gap-2">
      <Image src={asset.url} alt={asset.name} width={100} height={50} />
      <div className="flex flex-col justify-center">
        <h3 className="text-ellipsis text-sm font-medium">{asset.name}</h3>
        <p className="text-sm">Size: {bytesToSize(asset.size)}</p>
      </div>
    </div>
  );
}
