import Mario from '/mario.js'; 

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


// Array of blocks
let blocks = [q1, q2, q3];

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
    requestAnimationFrame(animate); // Request next frame
}

// Start animation loop
requestAnimationFrame(animate);
