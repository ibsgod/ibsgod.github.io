class Controls {
    constructor(type) {
        this.reset()

        switch(type) {
            case "KEYS":
                this.#addKeyboardListeners()
                break;
            case "DUMMY":
                this.up = true;
                break;
        }
    }
    reset() {
        this.up = false;
        this.left = false;
        this.right = false;
        this.down = false;
    }
    #addKeyboardListeners() {
        document.onkeydown = (event)=>{

            switch(event.key) {
                case "a":
                case "ArrowLeft":
                    this.left = true;
                    break;
                case "d":
                case "ArrowRight":
                    this.right = true;
                    break;
                case "w":
                case "ArrowUp":
                    this.up = true;
                    break;
                case "s":
                case "ArrowDown":
                    this.down = true;
                    break;
            }
        }
        document.onkeyup = (event)=>{
            switch(event.key) {
                case "a":
                case "ArrowLeft":
                    this.left = false;
                    break;
                case "d":
                case "ArrowRight":
                    this.right = false;
                    break;
                case "w":
                case "ArrowUp":
                    this.up = false;
                    break;
                case "s":
                case "ArrowDown":
                    this.down = false;
                    break;
            }
        }
    }
}