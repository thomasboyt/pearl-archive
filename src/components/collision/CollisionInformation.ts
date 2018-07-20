import Collider from './Collider';
import { CollisionResponse } from './utils';
import GameObject from '../../GameObject';
import * as V from '../../util/vectorMaths';

export default class CollisionInformation {
  collider: Collider;
  gameObject: GameObject;
  response: CollisionResponse;

  constructor(collider: Collider, response: CollisionResponse) {
    this.collider = collider;
    this.gameObject = collider.gameObject;
    this.response = response;
  }

  static invertResponse(response: CollisionResponse): CollisionResponse {
    return {
      aInB: response.bInA,
      bInA: response.aInB,
      overlap: -response.overlap,
      overlapVector: V.negative(response.overlapVector),
    };
  }
}
