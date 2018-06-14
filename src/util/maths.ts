export function rotatePoint(
  [x, y]: [number, number],
  radians: number
): [number, number] {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return [cos * x - sin * y, cos * y + sin * x];
}
