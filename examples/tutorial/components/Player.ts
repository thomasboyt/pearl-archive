import { Component, Physical, PolygonCollider, Keys } from '../../../src';

export default class Player extends Component<null> {
  playerSpeed = 0.1;
  isAlive = true;
  hasSword = false;

  update(dt: number) {
    if (!this.isAlive) {
      return;
    }

    this.move(dt);
    this.checkCollisions();
  }

  private move(dt: number) {
    let xVec = 0;
    let yVec = 0;

    if (this.pearl.inputter.isKeyDown(Keys.rightArrow)) {
      xVec = 1;
    } else if (this.pearl.inputter.isKeyDown(Keys.leftArrow)) {
      xVec = -1;
    }

    if (this.pearl.inputter.isKeyDown(Keys.downArrow)) {
      yVec = 1;
    } else if (this.pearl.inputter.isKeyDown(Keys.upArrow)) {
      yVec = -1;
    }

    this.getComponent(Physical).translate({
      x: xVec * this.playerSpeed * dt,
      y: yVec * this.playerSpeed * dt,
    });
  }

  private checkCollisions() {
    const enemy = this.pearl.entities.all('enemy')[0];

    if (
      enemy &&
      enemy
        .getComponent(PolygonCollider)
        .isColliding(this.getComponent(PolygonCollider))
    ) {
      if (this.hasSword) {
        this.pearl.entities.destroy(enemy);
      } else {
        this.isAlive = false;
      }
    }

    if (!this.hasSword) {
      const sword = this.pearl.entities.all('sword')[0];

      if (
        sword
          .getComponent(PolygonCollider)
          .isColliding(this.getComponent(PolygonCollider))
      ) {
        this.hasSword = true;
        this.gameObject.appendChild(sword);
        sword.getComponent(Physical).localCenter = {
          x: -5,
          y: 15,
        };
      }
    }
  }
}
