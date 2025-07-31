import Entity from './entity.js';

class Luigi extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h, "luigi", "luigi.png");
    this.speechBubble = null;
    this.speechTimer = 0;
    this.speechDuration = 180; // 3 seconds at 60fps
    this.detectionRange = 100; // Distance at which Luigi will speak
    this.isLastLuigi = false; // Track if this is the last Luigi
    this.originalMessage = null; // Store original message
    Luigi.lastLuigiReached = false;
  }

  tick() {
    // Check if Mario is close enough to trigger speech
    const mario = Entity.allEntities.find(entity => entity.name === "mario");
    if (mario) {
      const distance = Math.abs(this.x - mario.x);
      if (distance < this.detectionRange && !this.speechBubble) {
        // Check if the last Luigi has been reached
        const allLuigis = Entity.allEntities.filter(entity => entity.name === "luigi");
        const lastLuigi = allLuigis[allLuigis.length - 1];
        if (this.isLastLuigi) {
          Luigi.lastLuigiReached = true;
        }
        if (Luigi.lastLuigiReached && !this.isLastLuigi) {
          // If last Luigi was reached, all others say the same thing
          this.speak("Told you there's nothing left lol");
        } else {
          // Use original message
          this.speak(this.originalMessage || "There's nothing left here!");
        }
      }
    }

    // Update speech timer
    if (this.speechBubble) {
      this.speechTimer++;
      if (this.speechTimer >= this.speechDuration) {
        this.speechBubble = null;
        this.speechTimer = 0;
      }
    }
  }

  speak(message) {
    this.speechBubble = message;
    this.speechTimer = 0;
  }

  draw(ctx) {
    // Draw Luigi
    super.draw(ctx);
    
    // Draw speech bubble if active
    if (this.speechBubble) {
      this.drawSpeechBubble(ctx);
    }
  }

  drawSpeechBubble(ctx) {
    const textX = this.x + this.w / 2;
    const textY = this.y - 40;
    const text = this.speechBubble;
    
    // Use the same font as everything else
    ctx.font = "16px 'YourFontName', Arial, sans-serif";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.fillText(text, textX, textY);
    
    // Reset text alignment
    ctx.textAlign = "left";
  }
}

export default Luigi; 