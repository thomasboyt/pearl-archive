import { Vector2 } from '../types';

function getWindow(document: any): Window {
  return document.parentWindow || document.defaultView;
}

export function getElementPosition(element: HTMLElement): Vector2 {
  const rect = element.getBoundingClientRect();
  const document = element.ownerDocument;
  const body = document.body;
  const window = getWindow(document);
  return {
    x:
      rect.left +
      (window.pageXOffset || body.scrollLeft) -
      (body.clientLeft || 0),
    y:
      rect.top + (window.pageYOffset || body.scrollTop) - (body.clientTop || 0),
  };
}

export default function getPositionRelativeToElement(
  point: Vector2,
  element: HTMLElement
): Vector2 {
  const elementPosition = getElementPosition(element);

  return {
    x: point.x - elementPosition.x,
    y: point.y - elementPosition.y,
  };
}
