import Mario from '/mario.js' 

const gameCanvas = document.getElementById("gameCanvas");
const gameCtx = gameCanvas.getContext("2d")




  gameCanvas.width = window.innerWidth
  gameCanvas.height = window.innerHeight

  let m = new Mario(25, (gameCanvas.height - 25) / 2, 25, 25)
  let g = new Ground(0, gameCanvas.height - 100, gameCanvas.width * 2, 1000)
  let q1 = new Question(gameCanvas.width / 4, (gameCanvas.height) / 1.5, 25, 25, "Projects")
  let q2 = new Question(gameCanvas.width / 4 * 2, (gameCanvas.height) / 1.5, 25, 25, "Experience")
  let q3 = new Question(gameCanvas.width / 4 * 3, (gameCanvas.height) / 1.5, 25, 25, "cock")
  let right = new Arrow(gameCanvas.width / 20 * 19 - 28, (gameCanvas.height - 25) / 1.5, 55, 25, "right", m.controls)
  let left = new Arrow(gameCanvas.width / 20 * 17, (gameCanvas.height - 25) / 1.5, 55, 25, "left", m.controls)
  let up = new Arrow(gameCanvas.width / 20 * 18, (gameCanvas.height - 100) / 1.5, 25, 55, "up", m.controls)
  let arrows = [left, right, up]
  animate()
  document.onmousemove = (event) => {
    m.controls.reset()
    var rect = gameCanvas.getBoundingClientRect();
    arrows.forEach((arrow) => {
      if (pointInBox(event.clientX - rect.left, event.clientY - rect.top, {x: arrow.x, y: arrow.y, w: arrow.w, h: arrow.h})) {
      m.controls[arrow.name] = true
    }
    })
    
  }

function draw() {
  gameCanvas.width = window.innerWidth
  gameCanvas.height = window.innerHeight
  gameCtx.clearRect(0,0, gameCanvas.width, gameCanvas.height)
  Entity.allEntities.forEach((entity) => entity.draw(gameCtx))
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

