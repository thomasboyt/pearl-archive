import {Coordinates} from '../types';
import {BoundingBox} from '../Collider';

export const RADIANS_TO_DEGREES = 0.01745;

// a subset of Entity
export interface Collidable {
  center: Coordinates;
  size: Coordinates;
  angle?: number;
  boundingBox?: BoundingBox;
}

export function getBoundingBox(obj: Collidable): BoundingBox {
  return obj.boundingBox || BoundingBox.Rectangle;
}

export function rotated(obj: Collidable): boolean {
  return obj.angle !== undefined && obj.angle !== 0;
}

export function getAngle(obj: Collidable): number {
  return obj.angle === undefined ? 0 : obj.angle;
}

export function circlesIntersecting(obj1: Collidable, obj2: Collidable): boolean {
  return distance(obj1.center, obj2.center) < obj1.size.x / 2 + obj2.size.x / 2;
}

export function rectanglesIntersecting(obj1: Collidable, obj2: Collidable): boolean {
  if (!rotated(obj1) && !rotated(obj2)) {
    return unrotatedRectanglesIntersecting(obj1, obj2); // faster
  } else {
    return rotatedRectanglesIntersecting(obj1, obj2); // slower
  }
}

export function circleAndRectangleIntersecting(
  circleObj: Collidable, rectangleObj: Collidable
): boolean {
  const rectangleObjAngleRad = -getAngle(rectangleObj) * RADIANS_TO_DEGREES;

  const unrotatedCircleCenter = {
    x: Math.cos(rectangleObjAngleRad) *
      (circleObj.center.x - rectangleObj.center.x) -
      Math.sin(rectangleObjAngleRad) *
      (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.x,
    y: Math.sin(rectangleObjAngleRad) *
      (circleObj.center.x - rectangleObj.center.x) +
      Math.cos(rectangleObjAngleRad) *
      (circleObj.center.y - rectangleObj.center.y) + rectangleObj.center.y,
  };

  const closest = { x: 0, y: 0 };

  if (unrotatedCircleCenter.x < rectangleObj.center.x - rectangleObj.size.x / 2) {
    closest.x = rectangleObj.center.x - rectangleObj.size.x / 2;
  } else if (unrotatedCircleCenter.x > rectangleObj.center.x + rectangleObj.size.x / 2) {
    closest.x = rectangleObj.center.x + rectangleObj.size.x / 2;
  } else {
    closest.x = unrotatedCircleCenter.x;
  }

  if (unrotatedCircleCenter.y < rectangleObj.center.y - rectangleObj.size.y / 2) {
    closest.y = rectangleObj.center.y - rectangleObj.size.y / 2;
  } else if (unrotatedCircleCenter.y > rectangleObj.center.y + rectangleObj.size.y / 2) {
    closest.y = rectangleObj.center.y + rectangleObj.size.y / 2;
  } else {
    closest.y = unrotatedCircleCenter.y;
  }

  return distance(unrotatedCircleCenter, closest) < circleObj.size.x / 2;
}

export function unrotatedRectanglesIntersecting(obj1: Collidable, obj2: Collidable): boolean {
  if (obj1.center.x + obj1.size.x / 2 < obj2.center.x - obj2.size.x / 2) {
    return false;
  } else if (obj1.center.x - obj1.size.x / 2 > obj2.center.x + obj2.size.x / 2) {
    return false;
  } else if (obj1.center.y - obj1.size.y / 2 > obj2.center.y + obj2.size.y / 2) {
    return false;
  } else if (obj1.center.y + obj1.size.y / 2 < obj2.center.y - obj2.size.y / 2) {
    return false;
  } else {
    return true;
  }
}

export function rotatedRectanglesIntersecting(obj1: Collidable, obj2: Collidable): boolean {
  const obj1Normals = rectanglePerpendicularNormals(obj1);
  const obj2Normals = rectanglePerpendicularNormals(obj2);

  const obj1Corners = rectangleCorners(obj1);
  const obj2Corners = rectangleCorners(obj2);

  if (projectionsSeparate(
    getMinMaxProjection(obj1Corners, obj1Normals[1]),
    getMinMaxProjection(obj2Corners, obj1Normals[1]))) {
    return false;
  } else if (projectionsSeparate(
    getMinMaxProjection(obj1Corners, obj1Normals[0]),
    getMinMaxProjection(obj2Corners, obj1Normals[0]))) {
    return false;
  } else if (projectionsSeparate(
    getMinMaxProjection(obj1Corners, obj2Normals[1]),
    getMinMaxProjection(obj2Corners, obj2Normals[1]))) {
    return false;
  } else if (projectionsSeparate(
    getMinMaxProjection(obj1Corners, obj2Normals[0]),
    getMinMaxProjection(obj2Corners, obj2Normals[0]))) {
    return false;
  } else {
    return true;
  }
}

export function pointInsideObj(point: Coordinates, obj: Collidable): boolean {
  const objBoundingBox = getBoundingBox(obj);

  if (objBoundingBox === BoundingBox.Rectangle) {
    return pointInsideRectangle(point, obj);
  } else if (objBoundingBox === BoundingBox.Circle) {
    return pointInsideCircle(point, obj);
  } else {
    throw new Error('Tried to see if point inside object with unsupported bounding box.');
  }
}

export function pointInsideRectangle(point: Coordinates, obj: Collidable): boolean {
  const c = Math.cos(-getAngle(obj) * RADIANS_TO_DEGREES);
  const s = Math.sin(-getAngle(obj) * RADIANS_TO_DEGREES);

  const rotatedX = obj.center.x + c *
      (point.x - obj.center.x) - s * (point.y - obj.center.y);
  const rotatedY = obj.center.y + s *
      (point.x - obj.center.x) + c * (point.y - obj.center.y);

  const leftX = obj.center.x - obj.size.x / 2;
  const rightX = obj.center.x + obj.size.x / 2;
  const topY = obj.center.y - obj.size.y / 2;
  const bottomY = obj.center.y + obj.size.y / 2;

  return leftX <= rotatedX && rotatedX <= rightX &&
    topY <= rotatedY && rotatedY <= bottomY;
}

export function pointInsideCircle(point: Coordinates, obj: Collidable): boolean {
  return distance(point, obj.center) <= obj.size.x / 2;
}

export function distance(point1: Coordinates, point2: Coordinates): number {
  const x = point1.x - point2.x;
  const y = point1.y - point2.y;
  return Math.sqrt((x * x) + (y * y));
}

export function vectorTo(start: Coordinates, end: Coordinates): Coordinates {
  return {
    x: end.x - start.x,
    y: end.y - start.y,
  };
}

export function magnitude(vector: Coordinates): number {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function leftNormalizedNormal(vector: Coordinates): Coordinates {
  return {
    x: -vector.y,
    y: vector.x,
  };
}

export function dotProduct(vector1: Coordinates, vector2: Coordinates): number {
  return vector1.x * vector2.x + vector1.y * vector2.y;
}

export function unitVector(vector: Coordinates): Coordinates {
  return {
    x: vector.x / magnitude(vector),
    y: vector.y / magnitude(vector),
  };
}

export interface Projection {
  min: number;
  max: number;
}

export function projectionsSeparate(proj1: Projection, proj2: Projection): boolean {
  return proj1.max < proj2.min || proj2.max < proj1.min;
}

export function getMinMaxProjection(objCorners: Coordinates[], normal: Coordinates): Projection {
  let min = dotProduct(objCorners[0], normal);
  let max = dotProduct(objCorners[0], normal);

  for (let i = 1; i < objCorners.length; i++) {
    const current = dotProduct(objCorners[i], normal);
    if (min > current) {
      min = current;
    }

    if (current > max) {
      max = current;
    }
  }

  return { min: min, max: max };
}

export function rectangleCorners(obj: Collidable): Coordinates[] {
  const corners = [ // unrotated
    { x: obj.center.x - obj.size.x / 2, y: obj.center.y - obj.size.y / 2 },
    { x: obj.center.x + obj.size.x / 2, y: obj.center.y - obj.size.y / 2 },
    { x: obj.center.x + obj.size.x / 2, y: obj.center.y + obj.size.y / 2 },
    { x: obj.center.x - obj.size.x / 2, y: obj.center.y + obj.size.y / 2 },
  ];

  const angle = getAngle(obj) * RADIANS_TO_DEGREES;

  for (let i = 0; i < corners.length; i++) {
    const xOffset = corners[i].x - obj.center.x;
    const yOffset = corners[i].y - obj.center.y;
    corners[i].x = obj.center.x + xOffset * Math.cos(angle) - yOffset * Math.sin(angle);
    corners[i].y = obj.center.y + xOffset * Math.sin(angle) + yOffset * Math.cos(angle);
  }

  return corners;
}

export function rectangleSideVectors(obj: Collidable): Coordinates[] {
  const corners = rectangleCorners(obj);
  return [
    { x: corners[0].x - corners[1].x, y: corners[0].y - corners[1].y },
    { x: corners[1].x - corners[2].x, y: corners[1].y - corners[2].y },
    { x: corners[2].x - corners[3].x, y: corners[2].y - corners[3].y },
    { x: corners[3].x - corners[0].x, y: corners[3].y - corners[0].y },
  ];
}

export function rectanglePerpendicularNormals(obj: Collidable): Coordinates[] {
  const sides = rectangleSideVectors(obj);
  return [
    leftNormalizedNormal(sides[0]),
    leftNormalizedNormal(sides[1]),
  ];
}
