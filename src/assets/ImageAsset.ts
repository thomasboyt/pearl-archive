import AssetBase from './AssetBase';

export default class ImageAsset extends AssetBase<HTMLImageElement> {
  load(path: string) {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (evt) => reject(evt.error);
      img.src = path;
    });
  }
}
