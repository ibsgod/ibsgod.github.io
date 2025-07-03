import Entity from './entity.js';

class Goomba extends Entity {
  constructor(x, y, w, h, patrolMinX, patrolMaxX, name) {
    super(x, y, w, h, name, "goomba.png");
    this.speed = 1.2;
    this.direction = 1; // 1 for right, -1 for left
    this.patrolMinX = patrolMinX;
    this.patrolMaxX = patrolMaxX;
  }

  tick() {
    this.x += this.speed * this.direction;
    if (this.x <= this.patrolMinX) {
      this.x = this.patrolMinX;
      this.direction = 1;
    } else if (this.x + this.w >= this.patrolMaxX) {
      this.x = this.patrolMaxX - this.w;
      this.direction = -1;
    }
  }

  draw(ctx) {
    // ctx.globalAlpha = 1.0; // Force full opacity
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
  }
}

export default Goomba; 