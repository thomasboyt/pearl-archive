import Collider from './Collider';
import { CollisionResponse } from './utils';
import GameObject from '../../GameObject';

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
      overlapVector: [-response.overlapVector[0], -response.overlapVector[1]],
    };
  }
}
