import Entity from './entity.js';

class Question extends Entity {
  constructor(x, y, w, h, section) {
    super(x, y, w, h, "question", "question.png")
    this.section = section
    this.animating = false
    this.origy = y
    this.colliding = false
  }

  tick() {
    if (this.collided["mario"] != "down") {
      this.colliding = false
    }
    if (this.collided["mario"] == "down" && !this.colliding) {
      changeSection(this.section)
      this.colliding = true
      this.animating = true
    }
    if (this.animating) {
      this.y -= 0.8
      if (this.origy - this.y > 9) {
        this.animating = false
      }
    }
    else if(this.origy != this.y) {
      this.y += 0.8
    }
  }
}

export default Question;
