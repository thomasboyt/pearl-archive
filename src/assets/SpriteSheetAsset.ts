import AssetBase from './AssetBase';
import SpriteSheet from '../util/SpriteSheet';
import loadImage from './loadImage';

export default class SpriteSheetAsset extends AssetBase<SpriteSheet> {
  spriteWidth: number;
  spriteHeight: number;

  constructor(path: string, spriteWidth: number, spriteHeight: number) {
    super(path);
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
  }

  async load(path: string) {
    const img = await loadImage(path);
    return this.createSpriteSheet(img);
  }

  private createSpriteSheet(img: HTMLImageElement): SpriteSheet {
    return new SpriteSheet(img, this.spriteWidth, this.spriteHeight);
  }
}
