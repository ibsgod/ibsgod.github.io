class Entity {
  static allEntities = []
  static terrainNames = ["ground", "question"]
  constructor(x, y, w, h, name, image) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.name = name
    this.image = new Image()
    this.image.src = image
    this.collided = {}
    Entity.allEntities.push(this)
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.w, this.h)
  }
  collide(collider) {
    let leftDis = 9999
    let rightDis = 9999
    let upDis = 9999
    let downDis = 9999
    if (
      this.y >= collider.y && this.y <= collider.y + collider.h ||
      this.y <= collider.y && this.y + this.h >= collider.y
    ) {
      if (this.x <= collider.x && this.x + this.w >= collider.x) {
        leftDis = this.x + this.w - collider.x
      }
      if (this.x >= collider.x && this.x <= collider.x + collider.w) {
        rightDis = collider.x + collider.w - this.x
      }
    }
    if (
      this.x <= collider.x && this.x + this.w >= collider.x ||
      this.x >= collider.x && this.x <= collider.x + collider.w
    ) {
      if (this.y <= collider.y && this.y + this.h >= collider.y) {
        upDis = this.y + this.h - collider.y
      }
      if (this.y >= collider.y && this.y <= collider.y + collider.h) {
        downDis = collider.y + collider.h - this.y
      }
    }
    
    let minDis = Math.min(leftDis, rightDis, upDis, downDis)
    if (minDis == 9999) {
      return false
    }
    if (minDis == leftDis) {
      return "right"
    }
    if (minDis == rightDis) {
      return "left"
    }
    if (minDis == upDis) {
      return "down"
    }
    if (minDis == downDis) {
      return "up"
    }
  }
  static opposite(dir) {
    switch(dir) {
      case "left":
        return "right"
      case "right":
        return "left"
      case "up":
        return "down"
      case "down":
        return "up"
    }
  }
  tick() {
    
  }
  static update() {
    for (let i = 0; i < Entity.allEntities.length; i++) {
      Entity.allEntities[i].collided = {}
      Entity.allEntities[i].onGround = null
    }
    for (let i = 0; i < Entity.allEntities.length; i++) {
      for (let j = i + 1; j < Entity.allEntities.length; j++) {
        let obj1 = Entity.allEntities[i]
        let obj2 = Entity.allEntities[j]
        let collision = Entity.allEntities[i].collide(obj2)
        if (collision) {
          obj1.collided[obj2.name] = collision
          obj2.collided[obj1.name] = Entity.opposite(collision)
          if (!Entity.terrainNames.includes(obj1.name) && Entity.terrainNames.includes(obj2.name)) {
            if (collision == "down") {
              obj1.onGround = obj2
            }
            if (collision == "right") {
              obj1.x = obj2.x - obj1.w
            }
            if (collision == "left") {
              obj1.x = obj2.x + obj2.w
            }
            if (collision == "up") {
              obj1.y = obj2.y + obj2.h
            }
            if (collision == "down") {
              obj1.y = obj2.y - obj1.h
            }
          }
          else if (Entity.terrainNames.includes(obj1.name) && !Entity.terrainNames.includes(obj2.name)) {
            if (collision == "up") {
              obj2.onGround = obj1
            }
            if (collision == "right") {
              obj2.x = obj1.x - obj2.w
            }
            if (collision == "left") {
              obj2.x = obj1.x + obj1.w
            }
            if (collision == "up") {
              obj2.y = obj1.y + obj1.h
            }
            if (collision == "down") {
              obj2.y = obj1.y - obj2.h
            }
          }
        }
      }
    }

  }
}