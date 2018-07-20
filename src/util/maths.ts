export const radiansToDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

export const degreesToRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};
