class Question extends Entity {
  constructor(x, y, w, h, section) {
    super(x, y, w, h, "question", "question.png")
    this.section = section
  }

  tick() {
    if (this.collided["mario"] == "down") {
      cock(this.section)
    }
  }
}