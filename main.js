const gameCanvas = document.getElementById("gameCanvas");
gameCanvas.width = window.innerWidth
gameCanvas.height = 500
const gameCtx = gameCanvas.getContext("2d")






  let m = new Mario(25, (gameCanvas.height - 25) / 2, 25, 25)
  let g = new Ground(-500, 450, 2000, 1000)
  let q1 = new Question(200, 320, 25, 25, "projects")
  let q2 = new Question(500, 320, 25, 25, "experience")
  let q3 = new Question(800, 320, 25, 25, "cock")
  animate();

function draw() { 
  gameCtx.clearRect(0,0, gameCanvas.width, gameCanvas.height)
  Entity.allEntities.forEach((entity) => entity.draw(gameCtx))
}

function cock(text) {
  document.getElementById("section").innerText = text;
}

function animate(time) {
  m.move()
  draw()
  Entity.update()
  Entity.allEntities.forEach((entity) => entity.tick())
  gameCtx.font = "10px Arial";
  // gameCtx.fillText(m.x + " " + m.y,m.x,m.y);
  gameCtx.restore();
  requestAnimationFrame(animate)
}
