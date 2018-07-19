import CircleShape from '../CircleShape';
import PolygonShape from '../PolygonShape';

describe('CircleShape', () => {
  describe('testShape', () => {
    it('collides with circles correctly', () => {
      const self = new CircleShape({
        radius: 5,
      });

      const other = new CircleShape({
        radius: 5,
      });

      let resp = self.testShape(
        other,
        { center: { x: 0, y: 0 } },
        { center: { x: 0, y: 0 } }
      );

      expect(resp).toBeDefined();
      expect(resp.overlap).toBe(10);
    });
  });
});
