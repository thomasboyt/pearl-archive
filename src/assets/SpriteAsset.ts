import AssetBase from './AssetBase';
import Sprite from '../util/Sprite';
import loadImage from './loadImage';

export default class SpriteAsset extends AssetBase<Sprite> {
  constructor(path: string) {
    super(path);
  }

  async load(path: string) {
    const img = await loadImage(path);
    return this.createSprite(img);
  }

  private createSprite(img: HTMLImageElement): Sprite {
    return new Sprite(img, 0, 0, img.width, img.height);
  }
}
