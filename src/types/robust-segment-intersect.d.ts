declare module 'robust-segment-intersect' {
  type Point = [number, number];
  export default function crosses(
    a0: Point,
    a1: Point,
    b0: Point,
    b1: Point
  ): boolean;
}
