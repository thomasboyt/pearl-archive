CollisionShape - this base class represents a shape that another CollisionShape can collide with. Currently, there are PolygonShape and CircleShape. These wrap SAT.js's SAT.Polygon and SAT.Circle classes, respectively. The abstraction benefit here is that (a) developers don't have to worry about SAT.js's API, and (b) when Pearl gets support for a real physics engine, like Box2D or whatever, these shape classes can be used to construct physics objects.

Collider - A base component defining the following API:

```
isTrigger: boolean;
isEnabled: boolean;
isColliding(ShapeCollider | CollisionShape): boolean;
getCollision(ShapeCollider | CollisionShape): CollisionResponse | undefined;
// this gets implemented by anything subclassing Collider
abstract testShape(shape: CollisionShape): CollisionResponse | undefined;
```

ShapeCollider - A Collider that has a PolygonShape or CircleShape attached (and is subclassed to PolygonCollider and CircleCollider). These colliders can handle collisions with other PolygonColliders and CircleColliders.