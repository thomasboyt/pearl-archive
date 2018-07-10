import { Coordinates } from '../types';

export function rotatePoint(
  [x, y]: [number, number],
  radians: number
): [number, number] {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return [cos * x - sin * y, cos * y + sin * x];
}

export const addVector = (a: Coordinates, b: Coordinates): Coordinates => ({
  x: a.x + b.x,
  y: a.y + b.y,
});
