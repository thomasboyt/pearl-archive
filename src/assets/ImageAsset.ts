import AssetBase from './AssetBase';
import loadImage from './loadImage';

export default class ImageAsset extends AssetBase<HTMLImageElement> {
  load(path: string) {
    return loadImage(path);
  }
}
