import Entity from './entity.js';
import Mario from '/mario.js'; 
import Goomba from './goomba.js';
import Ground from './ground.js';
import Question from './question.js';
import Luigi from './luigi.js';

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

// Set canvas size
gameCanvas.width = window.innerWidth * 2;
gameCanvas.height = window.innerHeight;

// Camera system for horizontal scrolling
let cameraX = 0;
let cameraThreshold = window.innerWidth * 0.3; // Start scrolling when Mario is 30% from the right edge
const cameraSpeed = 0.1; // How smoothly the camera follows Mario

// Update camera threshold on window resize
window.addEventListener('resize', () => {
    cameraThreshold = window.innerWidth * 0.3;
    
    // Update Luigi positions when window is resized
    const thirdBlockX = gameCanvas.width / 4 * 3 / 2;
    const halfScreenWidth = window.innerWidth / 2;
    const fullScreenWidth = window.innerWidth;
    
    if (luigi1 && luigi2 && luigi3 && luigi4 && luigi5) {
        luigi1.x = thirdBlockX + halfScreenWidth;
        luigi2.x = thirdBlockX + halfScreenWidth + fullScreenWidth;
        luigi3.x = thirdBlockX + halfScreenWidth + fullScreenWidth * 2;
        luigi4.x = thirdBlockX + halfScreenWidth + fullScreenWidth * 3;
        luigi5.x = thirdBlockX + halfScreenWidth + fullScreenWidth * 4;
    }
});

// Create game entities
let m = new Mario(25, (gameCanvas.height - 25) / 2, 25, 25);
// Extend ground to cover the full camera range (6x screen width total)
let g = new Ground(0, gameCanvas.height - 100, window.innerWidth * 6, 1000);
let q1 = new Question(gameCanvas.width / 4 / 2, gameCanvas.height - 200, 25, 25, "Projects");
let q2 = new Question(gameCanvas.width / 4 * 2 / 2, gameCanvas.height - 200, 25, 25, "Experience");
let q3 = new Question(gameCanvas.width / 4 * 3 / 2, gameCanvas.height - 200, 25, 25, "Links");

// After creating Mario and other entities:
let goomba1 = new Goomba(200, gameCanvas.height - 125, 25, 25, 150, 400, "goomba1");
let goomba2 = new Goomba(600, gameCanvas.height - 125, 25, 25, 550, 800, "goomba2");
let goomba3 = new Goomba(1000, gameCanvas.height - 125, 25, 25, 950, 1200, "goomba3");
let goombaCount = 3;

// Add multiple Luigi characters with progressively more humorous messages
const thirdBlockX = gameCanvas.width / 4 * 3 / 2;
const halfScreenWidth = window.innerWidth / 2; // First Luigi is half screen away
const fullScreenWidth = window.innerWidth; // Subsequent Luigi characters are full screen apart

let luigi1 = new Luigi(thirdBlockX + halfScreenWidth, gameCanvas.height - 125, 25, 25);
let luigi2 = new Luigi(thirdBlockX + halfScreenWidth + fullScreenWidth, gameCanvas.height - 125, 25, 25);
let luigi3 = new Luigi(thirdBlockX + halfScreenWidth + fullScreenWidth * 2, gameCanvas.height - 125, 25, 25);
let luigi4 = new Luigi(thirdBlockX + halfScreenWidth + fullScreenWidth * 3, gameCanvas.height - 125, 25, 25);
let luigi5 = new Luigi(thirdBlockX + halfScreenWidth + fullScreenWidth * 4, gameCanvas.height - 125, 25, 25);

// Set custom messages for each Luigi
luigi1.originalMessage = "There's nothing left here!";
luigi2.originalMessage = "No really, there's nothing";
luigi3.originalMessage = "Sankeeth ran out of ideas";
luigi4.originalMessage = "Bro stop this is the end";
luigi5.originalMessage = "If you're this bored please just hit Sankeeth up, he needs friends anyway";
luigi5.isLastLuigi = true; // Mark the last Luigi

// Array of blocks
let blocks = [q1, q2, q3];
let goombas = [goomba1, goomba2, goomba3];

// Mobile and Tablet Detection
window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a) {
        if (/android|bb\d+|meego|mobile|phone|tablet/i.test(a)) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

// if (window.mobileAndTabletCheck()) {
//     document.getElementById("section").innerText = "Hit the blocks to learn about me! (just touch them since you're on mobile)";
// }
let rect = gameCanvas.getBoundingClientRect();
// Handle mouse movement
document.onmousemove = (event) => {
    blocks.forEach((block) => {
        // Account for camera offset when checking mouse position
        const adjustedX = event.clientX - rect.left + cameraX;
        const adjustedY = event.clientY - rect.top;
        if (pointInBox(adjustedX, adjustedY, {x: block.x, y: block.y, w: block.w, h: block.h})) {
            if (currSection != block.section) {
              block.animating = true
                changeSection(block.section);
            }
        }
    });
};

// Joystick logic for mobile/touch devices
const joystickContainer = document.getElementById('joystick-container');
const joystickBase = document.getElementById('joystick-base');
const joystickKnob = document.getElementById('joystick-knob');
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joystickRadius = 50; // base radius

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

joystickContainer.style.display = 'block';

function setMarioControlsFromJoystick(dx, dy) {
  // Deadzone
  const deadzone = 10;
  m.controls.left = dx < -deadzone;
  m.controls.right = dx > deadzone;
  m.controls.up = dy < -deadzone;
  m.controls.down = dy > deadzone;
}

function resetMarioControls() {
  m.controls.left = false;
  m.controls.right = false;
  m.controls.up = false;
  m.controls.down = false;
}

// Mouse support for joystick
let mouseDown = false;
joystickBase.addEventListener('mousedown', function(e) {
  mouseDown = true;
  const rect = joystickBase.getBoundingClientRect();
  joystickCenter = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
  handleJoystickMove(e);
});

document.addEventListener('mousemove', function(e) {
  if (!mouseDown) return;
  handleJoystickMove(e);
});

document.addEventListener('mouseup', function(e) {
  if (!mouseDown) return;
  mouseDown = false;
  joystickKnob.style.left = '25px';
  joystickKnob.style.top = '25px';
  resetMarioControls();
});

function handleJoystickMove(evt) {
  let dx, dy;
  if (evt.touches && evt.touches.length > 0) {
    dx = evt.touches[0].clientX - joystickCenter.x;
    dy = evt.touches[0].clientY - joystickCenter.y;
  } else {
    dx = evt.clientX - joystickCenter.x;
    dy = evt.clientY - joystickCenter.y;
  }
  // Clamp to joystick radius
  let dist = Math.sqrt(dx*dx + dy*dy);
  let angle = Math.atan2(dy, dx);
  let clampedDist = Math.min(dist, joystickRadius);
  let knobX = Math.cos(angle) * clampedDist;
  let knobY = Math.sin(angle) * clampedDist;
  joystickKnob.style.left = (25 + knobX) + 'px';
  joystickKnob.style.top = (25 + knobY) + 'px';
  setMarioControlsFromJoystick(knobX, knobY);
}

// Touch support for joystick
joystickBase.addEventListener('touchstart', function(e) {
  joystickActive = true;
  const rect = joystickBase.getBoundingClientRect();
  joystickCenter = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
  if (e.touches.length > 0) {
    handleJoystickMove(e.touches[0]);
  }
}, { passive: false });

joystickBase.addEventListener('touchmove', function(e) {
  if (!joystickActive) return;
  if (e.touches.length > 0) {
    handleJoystickMove(e.touches[0]);
  }
  e.preventDefault();
}, { passive: false });

joystickBase.addEventListener('touchend', function(e) {
  joystickActive = false;
  joystickKnob.style.left = '25px';
  joystickKnob.style.top = '25px';
  resetMarioControls();
}, { passive: false });

// Camera update function
function updateCamera() {
    // Calculate Mario's screen position
    const marioScreenX = m.x - cameraX;
    
    // If Mario is past the threshold, move camera right
    if (marioScreenX > cameraThreshold) {
        const targetCameraX = m.x - cameraThreshold;
        cameraX += (targetCameraX - cameraX) * cameraSpeed;
    }
    
    // If Mario is near the left edge, move camera left
    if (marioScreenX < window.innerWidth * 0.2) {
        const targetCameraX = m.x - window.innerWidth * 0.2;
        cameraX += (targetCameraX - cameraX) * cameraSpeed;
    }
    
    // Don't let camera go negative (keep left boundary)
    if (cameraX < 0) {
        cameraX = 0;
    }
    
    // Don't let camera go too far right (keep right boundary)
    // Allow camera to go further right than canvas width to reach all Luigi characters
    const maxCameraX = (gameCanvas.width - window.innerWidth) + (window.innerWidth * 4); // Allow 4 more screen widths
    if (cameraX > maxCameraX) {
        cameraX = maxCameraX;
    }
}

// Function to reset camera to Mario's position
function resetCamera() {
    cameraX = Math.max(0, m.x - window.innerWidth * 0.5); // Center Mario on screen
}

// Drawing function
function draw() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Save the current context state
    gameCtx.save();
    
    // Apply camera offset
    gameCtx.translate(-cameraX, 0);
    
    // Draw all entities with camera offset
    Entity.allEntities.forEach((entity) => entity.draw(gameCtx));
    
    // Restore the context state
    gameCtx.restore();
}

// Animation loop
function animate(time) {    
    // Check how many Luigi characters Mario is to the right of and adjust speed
    let speedMultiplier = 1; // Base multiplier
    if (m.x > luigi1.x) speedMultiplier *= 2;
    if (m.x > luigi2.x) speedMultiplier *= 2;
    if (m.x > luigi3.x) speedMultiplier *= 2;
    if (m.x > luigi4.x) speedMultiplier *= 2;
    if (m.x > luigi5.x) speedMultiplier *= 2;
    
    m.xspd = 2 * speedMultiplier; // Base speed (2) multiplied by the multiplier
    
    m.move(); // Update Mario's position
    
    // Check if Mario fell off the screen (below the canvas height)
    if (m.y > gameCanvas.height) {
        // Mario fell off, reset him
        Entity.allEntities.splice(Entity.allEntities.indexOf(m), 1);
        m = new Mario(25, (gameCanvas.height - 25) / 2, 25, 25);
        resetCamera(); // Reset camera when Mario dies
        let sound = new Audio("waaa.mp3")
        sound.play();
    }
    updateCamera(); // Update camera position
    draw(); // Clear and redraw canvas
    Entity.update(); // Update all entities
    Entity.allEntities.forEach((entity) => entity.tick()); // Update entity states
    for (let index = 0; index < 3; index++) {
        let goombaIndex = index - (goombaCount - goombas.length)
        let collision = m.collided["goomba" + (index + 1)]
        if (collision) {
            if (collision == "down") {
                showFact(index);
                // Remove goomba from game
                const entityIndex = Entity.allEntities.indexOf(goombas[goombaIndex]);
                if (entityIndex > -1) {
                    Entity.allEntities.splice(entityIndex, 1);
                }
                // Remove from goombas array
                goombas.splice(goombaIndex, 1);
                let sound = new Audio("kill.mp3")
                sound.play();
            }
                    else {
            Entity.allEntities.splice(Entity.allEntities.indexOf(m), 1);
            m = new Mario(25, (gameCanvas.height - 25) / 2, 25, 25);
            resetCamera(); // Reset camera when Mario dies
            let sound = new Audio("waaa.mp3")
            sound.play();
        }
        }
    }

    requestAnimationFrame(animate); // Request next frame
}

// Start animation loop
requestAnimationFrame(animate);
