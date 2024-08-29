
class Mario extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h, "mario", "mario.png") 
    this.controls = new Controls("KEYS")
    this.xspd = 2
    this.yspd = 0
    this.gravity = 0
    this.onGround = null
    this.jumpRelease = true
  }
  move() {
    if (this.controls.right) {
      this.x += this.xspd;
      this.image.src = "mario.png"
    }
    if (this.controls.left) {
      this.x -= this.xspd;
      this.image.src = "marioflip.png"
    }
    if (!this.onGround) {
      this.gravity += 0.005
      this.yspd += this.gravity
    }
    else {
      this.gravity = 0
      this.yspd = 0
    }
    if (this.controls.up && this.jumpRelease && this.onGround) {
      this.yspd -= 4
      this.jumpRelease = false
      this.sound = new Audio("jump.mp3")
      this.sound.play();
    }
    else if (!this.controls.up) {
      this.jumpRelease = true
    }
    this.y += this.yspd
  } 

}
export default Mario