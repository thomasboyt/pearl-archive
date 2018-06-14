import Component from '../Component';
import Physical from './Physical';

import PolygonCollider from './PolygonCollider';

export interface Options {
  fillStyle?: string;
  strokeStyle?: string;
}

export default class PolygonRenderer extends Component<Options> {
  fillStyle: string | null = null;
  strokeStyle: string | null = null;

  init(opts: Options = {}) {
    this.fillStyle = opts.fillStyle || null;
    this.strokeStyle = opts.strokeStyle || null;
  }

  render(ctx: CanvasRenderingContext2D) {
    const phys = this.getComponent(Physical);
    const poly = this.getComponent(PolygonCollider);

    const points = poly.points;
    ctx.translate(phys.center.x, phys.center.y);
    ctx.rotate(poly.angle);

    ctx.beginPath();

    ctx.moveTo(points[0][0], points[0][1]);

    for (let point of points.slice(1)) {
      ctx.lineTo(point[0], point[1]);
    }

    ctx.lineTo(points[0][0], points[0][1]);

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
