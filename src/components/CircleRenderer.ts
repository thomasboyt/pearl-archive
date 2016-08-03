import Component from '../Component';
import Physical from './Physical';
import CircleCollider from './CircleCollider';

export interface Options {
  fillStyle?: string;
  strokeStyle?: string;
}

export default class CircleRenderer extends Component<Options> {
  fillStyle: string | null = null;
  strokeStyle: string | null = null;

  init(opts: Options = {}) {
    this.fillStyle = opts.fillStyle || null;
    this.strokeStyle = opts.strokeStyle || null;
  }

  render(ctx: CanvasRenderingContext2D) {
    const phys = this.getComponent(Physical);
    const circle = this.getComponent(CircleCollider);

    ctx.beginPath();

    ctx.arc(phys.center.x, phys.center.y, circle.radius, 0, 2 * Math.PI);

    if (this.fillStyle) {
      ctx.fillStyle = this.fillStyle;
      ctx.fill();
    }
    if (this.strokeStyle) {
      ctx.strokeStyle = this.strokeStyle;
      ctx.stroke();
    }

    ctx.closePath();
  }
}