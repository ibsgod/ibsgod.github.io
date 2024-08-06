class Ground extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h, "ground", "ground.png")
    this.sz = 25
  }

  draw(ctx) {
    for (let i = this.x; i < this.x + this.w; i += this.sz) {
      for (let j = this.y; j < this.y + this.h; j += this.sz) {
        ctx.drawImage(this.image, i, j, this.sz, this.sz)
      }
    }
  }
}