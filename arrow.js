import Entity from './entity.js';

class Arrow extends Entity {
  constructor(x, y, w, h, name, controls) {
    super(x, y, w, h, name,  name + ".png")
    this.controls = controls
  }
}