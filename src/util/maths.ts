/**
 * Convert radians to degrees.
 */
export const radiansToDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Convert degrees to radians.
 */
export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Simple unclamped lerp.
 */
export const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
