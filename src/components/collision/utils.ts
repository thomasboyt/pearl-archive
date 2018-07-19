import { Coordinates } from '../../types';
import * as SAT from 'sat';

export interface CollisionResponse {
  overlap: number;
  overlapVector: [number, number];
  aInB: boolean;
  bInA: boolean;
}

export function responseFromSAT(response: SAT.Response): CollisionResponse {
  const vector: [number, number] = [response.overlapV.x, response.overlapV.y];

  return {
    overlap: response.overlap,
    overlapVector: vector,
    aInB: response.aInB,
    bInA: response.bInA,
  };
}

export interface Position {
  center: Coordinates;
  angle?: number;
}

export type Point = [number, number];
