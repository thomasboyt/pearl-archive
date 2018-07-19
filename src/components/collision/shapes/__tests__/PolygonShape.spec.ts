import PolygonShape from '../PolygonShape';

// TODO: These test kinda suck
// Do some math and come back to them
describe('PolygonShape', () => {
  describe('testShape', () => {
    it('translates polygons correctly', () => {
      const self = PolygonShape.createBox({
        width: 5,
        height: 5,
      });
      const other = PolygonShape.createBox({
        width: 5,
        height: 5,
      });

      let resp = self.testShape(
        other,
        { center: { x: 0, y: 0 } },
        { center: { x: 0, y: 0 } }
      );

      expect(resp).toBeDefined();
      expect(resp.overlap).toBe(5);

      resp = self.testShape(
        other,
        { center: { x: 0, y: 0 } },
        { center: { x: 2.5, y: 0 } }
      );

      expect(resp).toBeDefined();
      expect(resp.overlap).toBe(2.5);
    });

    it('rotates polygons correctly', () => {
      const self = PolygonShape.createBox({
        width: 1,
        height: 1,
      });
      const other = PolygonShape.createBox({
        width: 5,
        height: 5,
      });

      let resp = self.testShape(
        other,
        { center: { x: 0, y: 0 } },
        { center: { x: 2.5, y: 2.5 } }
      );

      expect(resp).toBeDefined();
      expect(resp.overlap).toBe(0.5);

      resp = self.testShape(
        other,
        { center: { x: 0, y: 0 } },
        { center: { x: 2.5, y: 2.5 }, angle: 45 * (Math.PI / 180) }
      );

      expect(resp).toBeUndefined();
    });
  });
});
