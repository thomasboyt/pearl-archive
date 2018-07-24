import { Vector2 } from '../../types';
import * as SAT from 'sat';

export interface CollisionResponse {
  overlap: number;
  overlapVector: Vector2;
  aInB: boolean;
  bInA: boolean;
}

export function responseFromSAT(
  response: SAT.Response
): CollisionResponse | undefined {
  if (!(response.overlap > 0)) {
    return undefined;
  }

  return {
    overlap: response.overlap,
    overlapVector: response.overlapV,
    aInB: response.aInB,
    bInA: response.bInA,
  };
}

export interface Position {
  center: Vector2;
  angle?: number;
}

export type Point = [number, number];

export interface Bounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}
