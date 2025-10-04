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
    
    // Get camera position from the global scope (assuming it's accessible)
    const cameraX = window.gameCameraX || 0;
    const screenWidth = window.innerWidth;
    
    if (this.controls.right) {
      // Check if Mario would move past the right edge of the screen
      const newX = this.x + this.xspd * deltaTime * 60;
      const newScreenX = newX - cameraX;
      
      // Only move if Mario won't go past the right edge of the screen
      if (newScreenX + this.w <= screenWidth) {
        this.x = newX;
        this.image.src = "mario.png"
      }
    }
    if (this.controls.left) {
      // Check if Mario would move past the left edge of the screen
      const newX = this.x - this.xspd * deltaTime * 60;
      const newScreenX = newX - cameraX;
      
      // Only move if Mario won't go past the left edge of the screen
      if (newScreenX >= 0) {
        this.x = newX;
        this.image.src = "marioflip.png"
      }
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
      this.yspd -= 5
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
