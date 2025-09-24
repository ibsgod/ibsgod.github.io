import Entity from './entity.js';

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
    // Use delta time for consistent movement across different frame rates
    const deltaTime = this.deltaTime || (1/60); // Default to 60fps if deltaTime not set
    
    if (this.controls.right) {
      this.x += this.xspd * deltaTime * 60; // Scale by 60 for 60fps equivalent
      this.image.src = "mario.png"
    }
    if (this.controls.left) {
      this.x -= this.xspd * deltaTime * 60; // Scale by 60 for 60fps equivalent
      this.image.src = "marioflip.png"
    }
    if (!this.onGround) {
      this.gravity += 0.005 * deltaTime * 60; // Scale gravity by delta time
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
      this.sound.volume = 0.05
      this.sound.play();
    }
    else if (!this.controls.up) {
      this.jumpRelease = true
    }
    this.y += this.yspd * deltaTime * 60; // Scale vertical movement by delta time
  } 

}
export default Mario
