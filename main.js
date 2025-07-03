import Entity from './entity.js';
import Mario from '/mario.js'; 
import Goomba from './goomba.js';
import Ground from './ground.js';
import Question from './question.js';

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d");

// Set canvas size
gameCanvas.width = window.innerWidth * 2;
gameCanvas.height = window.innerHeight;

// Create game entities
let m = new Mario(25, (gameCanvas.height - 25) / 2, 25, 25);
let g = new Ground(0, gameCanvas.height - 100, gameCanvas.width * 2 / 2, 1000);
let q1 = new Question(gameCanvas.width / 4 / 2, gameCanvas.height - 200, 25, 25, "Projects");
let q2 = new Question(gameCanvas.width / 4 * 2 / 2, gameCanvas.height - 200, 25, 25, "Experience");
let q3 = new Question(gameCanvas.width / 4 * 3 / 2, gameCanvas.height - 200, 25, 25, "Links");

// After creating Mario and other entities:
let goomba1 = new Goomba(200, gameCanvas.height - 125, 25, 25, 150, 400, "goomba1");
let goomba2 = new Goomba(600, gameCanvas.height - 125, 25, 25, 550, 800, "goomba2");
let goomba3 = new Goomba(1000, gameCanvas.height - 125, 25, 25, 950, 1200, "goomba3");
let goombaCount = 3;
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
        if (pointInBox(event.clientX - rect.left, event.clientY - rect.top, {x: block.x, y: block.y, w: block.w, h: block.h})) {
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

// Drawing function
function draw() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    Entity.allEntities.forEach((entity) => entity.draw(gameCtx));
}

// Animation loop
function animate(time) {    
    m.move(); // Update Mario's position
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
                let sound = new Audio("waaa.mp3")
                sound.play();
            }
        }
    }

    requestAnimationFrame(animate); // Request next frame
}

// Start animation loop
requestAnimationFrame(animate);
