import Sprite from '../util/Sprite';
import Physical from './Physical';
import Component from '../Component';

interface Settings {
  sprite: Sprite;
}

export default class SpriteRenderer extends Component<Settings> {
  sprite: Sprite;

  scaleX: number = 1;
  scaleY: number = 1;

  create(settings: Settings) {
    if (settings.sprite) {
      this.sprite = settings.sprite;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const phys = this.getComponent(Physical);

    ctx.translate(phys.center.x, phys.center.y);
    ctx.rotate(phys.angle);

    const sprite = this.sprite;

    const destX = -sprite.width / 2;
    const destY = -sprite.height / 2;

    ctx.scale(this.scaleX, this.scaleY);

    sprite.draw(ctx, destX, destY);
  }
}
