const ORIENTATION = {
    LEFT: {
        value: 'left',
        keyCode: 37
    },
    RIGHT: {
        value: 'right',
        keyCode: 39
    },
    UP: {
        value: 'up',
        keyCode: 38
    },
    DOWN: {
        value: 'down',
        keyCode: 40
    }
};

class Part {
    widht;
    height;
    positionX;
    positionY;
    isSnake;
    id;

    constructor ({ widht, height, positionX, positionY, orientation, isSnake = true}) {
        this.widht = widht;
        this.height = height;
        this.positionX = positionX;
        this.positionY = positionY;
        this.orientation = orientation;
        this.isSnake = isSnake;
        this.id = Date.now();
    }

    draw (ctx) {
        ctx.fillRect(this.positionX, this.positionY, this.widht, this.height);
    }

    move (ctx) {
        if (this.orientation === ORIENTATION.UP.value || this.orientation === ORIENTATION.DOWN.value) {
            this.positionY = this.orientation === ORIENTATION.UP.value ? 
                this.positionY - 10 : this.positionY + 10;
            
            if (this.orientation === ORIENTATION.UP.value) {
                ctx.clearRect(this.positionX, this.positionY + 10, this.widht, this.height);
            } else {
                ctx.clearRect(this.positionX, this.positionY - 10, this.widht, this.height);
            }    
            
            if (this.positionY === 300) {
                this.positionY = 0;
            } else if (this.positionY === -10) {
                this.positionY = 290;
            }
        }

        if (this.orientation === ORIENTATION.LEFT.value || this.orientation === ORIENTATION.RIGHT.value) {
            this.positionX = this.orientation === ORIENTATION.LEFT.value ? 
                this.positionX - 10 : this.positionX + 10;
            
            if (this.orientation === ORIENTATION.LEFT.value) {
                ctx.clearRect(this.positionX + 10, this.positionY, this.widht, this.height);
            } else {
                ctx.clearRect(this.positionX - 10, this.positionY, this.widht, this.height);
            }  
            
            if (this.positionX === 300) {
                this.positionX = 0;
            } else if (this.positionX === -10) {
                this.positionX = 290;
            }
        }
    }
}

class Snake {
    parts;
    orientation;
    areaSnake;

    constructor (parts) {
        this.parts = [];
        this.orientation = ORIENTATION.RIGHT.value;
        this.areaSnake = [];

        parts.forEach(part => {
            part.orientation = this.orientation;
            this.parts.push(new Part(part));
        });
    }

    drawSnake (ctx) {
        this.parts.forEach(part => {
            part.draw(ctx);
        });
    }

    defineAreaSnake () {
        this.parts.forEach(part => {
            this.areaSnake.push([part.positionX, part.positionY]);
        })
    }

    moveSnake (ctx) {
        this.parts.forEach(part => {
            part.move(ctx);
        });
    }

    changeOrientation (orientation) {
        this.orientation = orientation;
    }

    checkOrientation () {
        const mapOrientation = new Set(this.parts.map(part => part.orientation));

        this.parts.forEach((part, index) => {
            switch(this.orientation) {
                case ORIENTATION.RIGHT.value: {
                    if (mapOrientation.size === 1 && part.orientation === ORIENTATION.LEFT.value) {
                        //part.orientation = ORIENTATION.RIGHT.value;
                    } else {
                        if (index === this.parts.length - 1) {
                            part.orientation = ORIENTATION.RIGHT.value;
                        } else {
                            part.orientation = this.parts[index + 1].orientation;
                        }
                    }
                }
                break;
                case ORIENTATION.LEFT.value: {
                    if (mapOrientation.size === 1 && part.orientation === ORIENTATION.RIGHT.value) {
                        //part.orientation = ORIENTATION.LEFT.value;
                    } else {
                        if (index === this.parts.length - 1) {
                            part.orientation = ORIENTATION.LEFT.value;
                        } else {
                            part.orientation = this.parts[index + 1].orientation;
                        }
                    }
                }
                break;
                case ORIENTATION.UP.value: {
                    if (mapOrientation.size === 1 && part.orientation === ORIENTATION.DOWN.value) {
                        //part.orientation = ORIENTATION.UP.value;
                    } else {
                        if (index === this.parts.length - 1) {
                            part.orientation = ORIENTATION.UP.value;
                        } else {
                            part.orientation = this.parts[index + 1].orientation;
                        }
                    }
                }
                break;
                case ORIENTATION.DOWN.value: {
                    if (mapOrientation.size === 1 && part.orientation === ORIENTATION.UP.value) {
                        //part.orientation = ORIENTATION.DOWN.value;
                    } else {
                        if (index === this.parts.length - 1) {
                            part.orientation = ORIENTATION.DOWN.value;
                        } else {
                            part.orientation = this.parts[index + 1].orientation;
                        }
                    }
                }
                break;
            }
        });
    }
}

const canvas = document.getElementById('content');
const ctx = canvas.getContext('2d');
const snake = new Snake([
    { widht: 10, height: 10, positionX: 0, positionY: 0 }, 
    { widht: 10, height: 10, positionX: 10, positionY: 0 },
    { widht: 10, height: 10, positionX: 20, positionY: 0 },
    { widht: 10, height: 10, positionX: 30, positionY: 0 },
    { widht: 10, height: 10, positionX: 40, positionY: 0 }]);
const appels = new Map(); 

snake.drawSnake(ctx);
snake.defineAreaSnake();

setInterval(() => {
    snake.checkOrientation();
    snake.moveSnake(ctx);
    snake.drawSnake(ctx);
    snake.areaSnake = [];
    snake.defineAreaSnake();
}, 1000);

setInterval(() => {
    const randomPositionX = Math.floor(Math.random() * 29) * 10;
    const randomPositionY = Math.floor(Math.random() * 29) * 10;
    if (!snake.areaSnake.some((coordinates) => coordinates[0] === randomPositionX && coordinates[1] === randomPositionY)) {
        const newApple = new Part({ widht: 10, height: 10, positionX: randomPositionX, positionY: randomPositionY, isSnake: false });
        appels.set(newApple.id, newApple);
        appels.get(newApple.id).draw(ctx);
    }
}, 4000);

document.addEventListener('keydown', (event) => {
    //move left
    if (event.keyCode === ORIENTATION.LEFT.keyCode) {
        if (snake.orientation !== ORIENTATION.RIGHT.value) {
            snake.changeOrientation(ORIENTATION.LEFT.value);
        }
    }
    //move right
    if (event.keyCode === ORIENTATION.RIGHT.keyCode) {
        if (snake.orientation !== ORIENTATION.LEFT.value) {
            snake.changeOrientation(ORIENTATION.RIGHT.value);
        }
    }
    // move up
    if (event.keyCode === ORIENTATION.UP.keyCode) {
        if (snake.orientation !== ORIENTATION.DOWN.value) {
            snake.changeOrientation(ORIENTATION.UP.value);
        }  
    }
    //move down
    if (event.keyCode === ORIENTATION.DOWN.keyCode) {
        if (snake.orientation !== ORIENTATION.UP.value) {
            snake.changeOrientation(ORIENTATION.DOWN.value);
        }
    }
})

