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

// Make camera position globally accessible for Mario boundary checks
window.gameCameraX = cameraX;

// Update camera threshold on window resize
window.addEventListener('resize', () => {
    // Update canvas size to maintain aspect ratio
    gameCanvas.width = window.innerWidth * 2;
    gameCanvas.height = window.innerHeight;
    
    // Update camera threshold
    cameraThreshold = window.innerWidth * 0.3;
    
    // Update Mario's Y position to stay on ground
    if (m) {
        m.y = gameCanvas.height - 25; // Keep Mario on ground level
    }
    
    // Update ground to cover the full camera range and maintain proper height
    if (g) {
        g.w = window.innerWidth * 6;
        g.y = gameCanvas.height - 100; // Keep ground anchored to bottom of screen
        g.h = 1000; // Maintain ground height
    }
    
    // Update question block positions to maintain relative positioning
    if (q1 && q2 && q3) {
        q1.x = gameCanvas.width / 4 / 2;
        q2.x = gameCanvas.width / 4 * 2 / 2;
        q3.x = gameCanvas.width / 4 * 3 / 2;
        
        // Update question block Y positions to stay above ground
        const newY = gameCanvas.height - 210;
        q1.y = newY;
        q2.y = newY;
        q3.y = newY;
        
        // Update original Y positions to prevent falling
        q1.origy = newY;
        q2.origy = newY;
        q3.origy = newY;
    }
    
    // Update goomba positions to maintain relative spacing
    if (goomba1 && goomba2 && goomba3) {
        const screenWidth = window.innerWidth;
        goomba1.x = screenWidth * 0.5; // 50% of screen width
        goomba2.x = screenWidth * 1.5; // 150% of screen width
        goomba3.x = screenWidth * 2.5; // 250% of screen width
        
        // Update goomba Y positions to stay on ground
        goomba1.y = gameCanvas.height - 125;
        goomba2.y = gameCanvas.height - 125;
        goomba3.y = gameCanvas.height - 125;
        
        // Update goomba patrol ranges
        goomba1.leftBound = goomba1.x - 50;
        goomba1.rightBound = goomba1.x + 200;
        goomba2.leftBound = goomba2.x - 50;
        goomba2.rightBound = goomba2.x + 200;
        goomba3.leftBound = goomba3.x - 50;
        goomba3.rightBound = goomba3.x + 200;
    }
    
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
        
        // Update Luigi Y positions to stay on ground
        luigi1.y = gameCanvas.height - 125;
        luigi2.y = gameCanvas.height - 125;
        luigi3.y = gameCanvas.height - 125;
        luigi4.y = gameCanvas.height - 125;
        luigi5.y = gameCanvas.height - 125;
    }
});


// Create game entities
let m = new Mario(25, (gameCanvas.height - 25) / 2, 25, 25);
// Extend ground to cover the full camera range (6x screen width total)
let g = new Ground(0, gameCanvas.height - 100, window.innerWidth * 6, 1000);
let q1 = new Question(gameCanvas.width / 4 / 2, gameCanvas.height - 210, 25, 25, "Projects");
let q2 = new Question(gameCanvas.width / 4 * 2 / 2, gameCanvas.height - 210, 25, 25, "Experience");
let q3 = new Question(gameCanvas.width / 4 * 3 / 2, gameCanvas.height - 210, 25, 25, "Links");

// After creating Mario and other entities:
// Use relative positioning for goombas based on screen width
const screenWidth = window.innerWidth;
let goomba1 = new Goomba(screenWidth * 0.5, gameCanvas.height - 125, 25, 25, screenWidth * 0.5 - 50, screenWidth * 0.5 + 200, "goomba1");
let goomba2 = new Goomba(screenWidth * 1.5, gameCanvas.height - 125, 25, 25, screenWidth * 1.5 - 50, screenWidth * 1.5 + 200, "goomba2");
let goomba3 = new Goomba(screenWidth * 2.5, gameCanvas.height - 125, 25, 25, screenWidth * 2.5 - 50, screenWidth * 2.5 + 200, "goomba3");
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

// Camera update function with delta time
function updateCamera(deltaTime) {
    // Calculate Mario's screen position
    const marioScreenX = m.x - cameraX;
    
    // If Mario is past the threshold, move camera right
    if (marioScreenX > cameraThreshold) {
        const targetCameraX = m.x - cameraThreshold;
        cameraX += (targetCameraX - cameraX) * cameraSpeed * deltaTime * 60; // Scale by 60 for 60fps equivalent
    }
    
    // If Mario is near the left edge, move camera left
    if (marioScreenX < window.innerWidth * 0.2) {
        const targetCameraX = m.x - window.innerWidth * 0.2;
        cameraX += (targetCameraX - cameraX) * cameraSpeed * deltaTime * 60; // Scale by 60 for 60fps equivalent
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
    
    // Update global camera position for Mario boundary checks
    window.gameCameraX = cameraX;
}

// Function to reset camera to Mario's position
function resetCamera() {
    cameraX = Math.max(0, m.x - window.innerWidth * 0.5); // Center Mario on screen
    window.gameCameraX = cameraX; // Update global camera position
}

// Drawing function with viewport culling for better performance
function draw() {
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // Save the current context state
    gameCtx.save();
    
    // Apply camera offset
    gameCtx.translate(-cameraX, 0);
    
    // Viewport culling - only draw entities that are visible on screen
    const viewportLeft = cameraX;
    const viewportRight = cameraX + window.innerWidth;
    const viewportTop = 0;
    const viewportBottom = window.innerHeight;
    
    // Batch entities by type for better rendering performance
    const terrainEntities = [];
    const characterEntities = [];
    const otherEntities = [];
    
    // Categorize and filter visible entities
    Entity.allEntities.forEach((entity) => {
        // Check if entity is within viewport bounds
        if (entity.x + entity.w >= viewportLeft && 
            entity.x <= viewportRight && 
            entity.y + entity.h >= viewportTop && 
            entity.y <= viewportBottom) {
            
            // Batch by type for potential optimization
            if (Entity.terrainNames.includes(entity.name)) {
                terrainEntities.push(entity);
            } else if (entity.name === "mario" || entity.name.includes("goomba") || entity.name.includes("luigi")) {
                characterEntities.push(entity);
            } else {
                otherEntities.push(entity);
            }
        }
    });
    
    // Draw in batches (terrain first, then characters, then others)
    terrainEntities.forEach(entity => entity.draw(gameCtx));
    characterEntities.forEach(entity => entity.draw(gameCtx));
    otherEntities.forEach(entity => entity.draw(gameCtx));
    
    // Restore the context state
    gameCtx.restore();
}

// Delta time-based animation loop
let lastTime = 0;

// Animation loop with delta time
function animate(time) {
    // Calculate delta time (time since last frame in seconds)
    const deltaTime = (time - lastTime) / 1000; // Convert milliseconds to seconds
    lastTime = time;
    
    // Cap delta time to prevent large jumps when tab is inactive
    const cappedDeltaTime = Math.min(deltaTime, 1/30); // Max 30 FPS equivalent
    
    // Check how many Luigi characters Mario is to the right of and adjust speed
    let speedMultiplier = 1; // Base multiplier
    if (m.x > luigi1.x) speedMultiplier *= 2;
    if (m.x > luigi2.x) speedMultiplier *= 2;
    if (m.x > luigi3.x) speedMultiplier *= 2;
    if (m.x > luigi4.x) speedMultiplier *= 2;
    if (m.x > luigi5.x) speedMultiplier *= 2;
    
    m.xspd = 2 * speedMultiplier; // Base speed (2) multiplied by the multiplier
    m.deltaTime = cappedDeltaTime; // Pass delta time to Mario
    
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
    updateCamera(cappedDeltaTime); // Update camera position with delta time
    draw(); // Clear and redraw canvas
    Entity.update(); // Update all entities
    Entity.allEntities.forEach((entity) => {
        entity.deltaTime = cappedDeltaTime; // Pass delta time to all entities
        entity.tick(); // Update entity states
    });
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
