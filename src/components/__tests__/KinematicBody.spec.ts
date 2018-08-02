import { createPearl } from '../../PearlInstance';
import KinematicBody from '../KinematicBody';
import Entity from '../../Entity';
import Physical from '../Physical';
import BoxCollider from '../collision/BoxCollider';
import PolygonCollider from '../collision/PolygonCollider';
import Component from '../../Component';

jest.mock('../../AudioManager');

describe('KinematicBody', () => {
  describe('moveAndSlide', () => {
    it('fires only one onCollision() for collisions on multiple axes', async () => {
      const pearl = await createPearl({
        canvas: document.createElement('canvas'),
        width: 100,
        height: 100,
        rootComponents: [],
      });

      class BodyComponent extends Component<void> {}
      const bodyComponent = new BodyComponent();
      bodyComponent.onCollision = jest.fn();

      const body = new Entity({
        name: 'body',
        components: [
          new Physical({ center: { x: 0, y: 0 } }),
          new BoxCollider({ width: 10, height: 10 }),
          new KinematicBody(),
          bodyComponent,
        ],
      });

      pearl.entities.add(body);

      // represents a reverse L shape like:
      // ```
      // OX
      // XX
      // ```
      // where O is the placemenent of the body. body moves down and to the
      // right so it has to resolve collisions on both axes.
      const points = [[-5, -5], [5, -5], [5, 5], [-15, 5], [-15, 0], [5, 0]];

      const lShape = new Entity({
        name: 'lShape',
        components: [
          new Physical({ center: { x: 10, y: 10 } }),
          new PolygonCollider({ points }),
        ],
      });

      pearl.entities.add(lShape);

      // tick forward to add both entities to the world
      pearl.entities.update(0);

      const collisions = body.getComponent(KinematicBody).moveAndSlide({
        x: 5,
        y: 5,
      });

      expect(collisions).toHaveLength(2);
      expect(collisions.map((collision) => collision.entity.name)).toEqual([
        'lShape',
        'lShape',
      ]);

      const onCollisionMock = (bodyComponent.onCollision as jest.Mock).mock;
      expect(onCollisionMock.calls).toHaveLength(1);
      expect(onCollisionMock.calls[0][0].entity.name).toBe('lShape');
    });
  });
});
