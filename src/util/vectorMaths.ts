import { Vector2 } from '../types';

const vectorOp = (fn: (a: number, b: number) => number) => {
  return (aVec: Vector2, b: Vector2 | number): Vector2 => {
    const bVec = vectorCast(b);
    return {
      x: fn(aVec.x, bVec.x),
      y: fn(aVec.y, bVec.y),
    };
  };
};

function vectorCast(vecOrScalar: Vector2 | number): Vector2 {
  if (typeof vecOrScalar === 'number') {
    return { x: vecOrScalar, y: vecOrScalar };
  }

  return vecOrScalar;
}

export const add = vectorOp((a, b) => a + b);
export const subtract = vectorOp((a, b) => a - b);
export const multiply = vectorOp((a, b) => a * b);
export const divide = vectorOp((a, b) => a / b);

export function negative(v: Vector2): Vector2 {
  return { x: -v.x, y: -v.y };
}

export function equals(a: Vector2, b: Vector2): boolean {
  return a.x === b.x && a.y === b.y;
}

export function dot(a: Vector2, b: Vector2): number {
  return a.x * b.x + a.y * b.y;
}

export function length(v: Vector2): number {
  return Math.sqrt(dot(v, v));
}

export function unit(v: Vector2): Vector2 {
  return divide(v, length(v));
}

export function toAngle(v: Vector2): number {
  return Math.atan2(v.y, v.x);
}

/**
 * Convert an angle (in radians) to a unit vector.
 */
export function fromAngle(radians: number): Vector2 {
  return {
    x: Math.cos(radians),
    y: Math.sin(radians),
  };
}

export function toArray(v: Vector2): [number, number] {
  return [v.x, v.y];
}

export function fromArray(a: [number, number]): Vector2 {
  return { x: a[0], y: a[1] };
}

export function lerp(a: Vector2, b: Vector2, f: number): Vector2 {
  return add(multiply(subtract(b, a), f), a);
}

export function rotate(v: Vector2, radians: number): Vector2 {
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    x: cos * v.x - sin * v.y,
    y: cos * v.y + sin * v.x,
  };
}
