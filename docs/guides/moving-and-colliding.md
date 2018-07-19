# Moving & Colliding

{% hint style="warning" %}
This documentation hasn't been finished yet! Sorry about that.
{% endhint %}

## Collisions Overview

Collisions in Pearl are handled with _Collider_ components.

Pearl ships with three core shape colliders - `PolygonCollider`, `CircleCollider`, and `BoxCollider`. These colliders each have `CollisionShape` objects that define their shapes.

- show example of importing and attaching a collider to an entity
- show isColliding/getCollision API

### Collision Details

Under the hood, Pearl currently uses [SAT.js](https://github.com/jriecken/sat-js) for collisions. SAT.js supports collisions between convex polygons (including simple line segments) and circles.

In the future, a different library may be used to allow more types of collision shapes. For now, this should be good enough for most games.

The `SAT.Polygon` and `SAT.Circle` classes are wrapped by `PolygonShape` and `CircleShape` classes, respectively. These wrapper classes abstract over the SAT API (so if the underlying library changes, the Pearl API won't have to change). In addition, when Pearl has support for a RigidBody component and a physics engine, these shape classes will be used to generate physics objects.

### Custom Colliders

- maybe leave this section blank for a long time

## Kinematic movement with KinematicBody

Pearl includes a KinematicBody component patterned after Godot's KinematicBody2D. A _KinematicBody_ is a component that handles movement and collision resolution in one step.

This is different from how collisions are handled in most physics engines, or in other frameworks that you may have used in the past. In those, you might be used to the pattern being:

- On update(), move all objects in the world based on input/forces/etc
- After update(), check to see if any objects have collided
- If they have, resolve each collision in turn, and trigger collision handlers

This pattern works well for real physics engines, but usually not so well for simple game movement. This kind of collision often leads to subtle and tricky bugs.

With KinematicBody, things are much simpler:

- In update(), _attempt_ to move an object based on input/forces/etc
- Check to see if the object has collided with anything. If it has, move the object back to its previous location, and trigger collision handlers

KinematicBody has two methods, `moveAndCollide(vec2)` and `moveAndSlide(vec2)`. These methods are used to move the entity

- collide vs slide
-