console.log('Flappy Bird - Felipe Assis');

const sound_Hit = new Audio();
sound_Hit.src = './effects/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let frames = 0;

// [Background]
const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
        context.fillStyle = '#70C5CE';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
            sprites,
            background.spriteX, background.spriteY, // Sprite X, Sprite Y
            background.width, background.height, // tamanho do recorte na sprite
            background.x, background.y,
            background.width, background.height
        );
        context.drawImage(
            sprites,
            background.spriteX, background.spriteY, // Sprite X, Sprite Y
            background.width, background.height, // tamanho do recorte na sprite
            (background.x + background.width), background.y,
            background.width, background.height
        );
    }
};

// [Actor]


// [Start Screen]
const getReadyMessage = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    draw() {
        context.drawImage(
            sprites,
            getReadyMessage.spriteX, getReadyMessage.spriteY,
            getReadyMessage.width, getReadyMessage.height,
            getReadyMessage.x, getReadyMessage.y,
            getReadyMessage.width, getReadyMessage.height
        );
    },
    update() {
        flappyBird.speed += flappyBird.gravity;
        flappyBird.y += flappyBird.speed;
    }
};

// 
// [Telas]
// 
let activeScene = {};
let globals = {};


const Scenes = {
    START: {
        click() {
            changeScene(Scenes.GAME);
        },
        draw() {
            background.draw();
            globals.flappyBird.draw();
            
            globals.floor.draw();
            getReadyMessage.draw();
        },
        initialize() {
            globals.floor = makeFloor();
            globals.pipes = makePipes();
            globals.flappyBird = makeFlappyBird();
        },
        update() {
            globals.floor.update();
        },
    },

};
Scenes.GAME = {
    click() {
        globals.flappyBird.toJump();
    },
    draw() {
        background.draw();
        globals.pipes.draw();
        globals.floor.draw();
        globals.flappyBird.draw();
    },
    update() {
        globals.pipes.update();
        globals.floor.update();
        globals.flappyBird.update();
        
    }
}

function changeScene(nextScene) {
    activeScene = nextScene;

    if (activeScene.initialize) {
        activeScene.initialize();
    }
}

function hasColision(flappyBird, floor) {
    const flappyBirdY = flappyBird.y + flappyBird.height;
    const floorY = floor.y;


    if (flappyBirdY >= floorY) {
        return true;
    }

    return false;
}

function loop() {
    activeScene.draw();
    activeScene.update();
    frames ++;
    requestAnimationFrame(loop);
}

function makeFloor() {
    const floor = {
        spriteX: 0,
        spriteY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        draw() {
            context.drawImage(
                sprites,
                floor.spriteX, floor.spriteY, // Sprite X, Sprite Y
                floor.width, floor.height, // tamanho do recorte na sprite
                floor.x, floor.y,
                floor.width, floor.height
            );
            context.drawImage(
                sprites,
                floor.spriteX, floor.spriteY, // Sprite X, Sprite Y
                floor.width, floor.height, // tamanho do recorte na sprite
                (floor.x + floor.width), floor.y,
                floor.width, floor.height
            );
        },
        update() {
            const floorMovement = 1;
            const loopAt = floor.width / 2;
            const movimentation = floor.x - floorMovement;
            floor.x = movimentation % loopAt;
        }
    }

    return floor;
}

function makeFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        moviments: [
            { spriteX: 0, spriteY: 0 }, // Asa para cima
            { spriteX: 0, spriteY: 26 }, // Asa para o meio
            { spriteX: 0, spriteY: 52 }, // Asa para baixo
            { spriteX: 0, spriteY: 26 } // Asa para o meio
        ],
        currentFrame: 0,
        gravity: 0.25,
        jump: 4.6,
        speed: 0,
        draw() {
            flappyBird.updateFrame();
            const { spriteX, spriteY } = flappyBird.moviments[flappyBird.currentFrame];

            context.drawImage(
                sprites,
                spriteX, spriteY, // Sprite X, Sprite Y
                flappyBird.width, flappyBird.height, // tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.width, flappyBird.height
            );
        },
        toJump() {
            flappyBird.speed = - flappyBird.jump;
        },
        update() {
            if (hasColision(flappyBird, globals.floor)) {
                sound_Hit.play();
                setTimeout(() => {
                    changeScene(Scenes.START);
                }, 500)
                return;
            }

            flappyBird.speed += flappyBird.gravity;
            flappyBird.y += flappyBird.speed;
        },
        updateFrame() {
            const framesInterval = 10;
            const hasIntervalPassed = frames % framesInterval === 0;

            if (hasIntervalPassed) {
                const incrementBase = 1;
                const increment = incrementBase + flappyBird.currentFrame;
                const repeatBase = flappyBird.moviments.length;
                flappyBird.currentFrame = increment %  repeatBase;
            }
        }
    };

    return flappyBird;
}

function makePipes() {
    const pipes = {
        width: 52,
        height: 400,
        floor: {
            spriteX: 0,
            spriteY: 169
        },
        sky: {
            spriteX: 52,
            spriteY: 169
        },
        space: 80,
        pairs: [],
        draw() {
            pipes.pairs.forEach(function (pair) {
                const yRandom = pair.y;
                const spacingBetweenPipes = 90;
                
                // [Cano do Céu]
                const skyPipeX = pair.x;
                const skyPipeY = yRandom;
                context.drawImage(
                    sprites,
                    pipes.sky.spriteX, pipes.sky.spriteY, // Sprite X, Sprite Y
                    pipes.width, pipes.height, // tamanho do recorte na sprite
                    skyPipeX, skyPipeY,
                    pipes.width, pipes.height
                );
    
                // [Cano do chão]
                const floorPipeX = pair.x;
                const floorPipeY = pipes.height + spacingBetweenPipes + yRandom;
                context.drawImage(
                    sprites,
                    pipes.floor.spriteX, pipes.floor.spriteY, // Sprite X, Sprite Y
                    pipes.width, pipes.height, // tamanho do recorte na sprite
                    floorPipeX, floorPipeY,
                    pipes.width, pipes.height
                );

                pair.skyPipe = {
                    x: skyPipeX,
                    y: pipes.height + skyPipeY
                };
                pair.floorPipe = {
                    x: floorPipeX,
                    y: floorPipeY
                }
            });
        },
        hasColisionWithFlappyBird(pair) {
            const flappyBirdHead = globals.flappyBird.y;
            const flappyBirdFoots = globals.flappyBird.y + globals.flappyBird.height;

            if (globals.flappyBird.x >= pair.x) {
                console.log('Flappy Bird invadiu a área dos canos');
                if (flappyBirdHead <= pair.skyPipe.y) {
                    return true;
                }
                if (flappyBirdFoots >= pair.floorPipe.y) {
                    return true;
                }
            }

            return false;
        },
        update() {
            const passed100Frames = frames % 100 === 0;
            
            if (passed100Frames) {
                this.pairs.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1)
                })
            }

            pipes.pairs.forEach(function (pair) {
                pair.x = pair.x - 2;

                if (pipes.hasColisionWithFlappyBird(pair)) {
                    console.log('Você perdeu!');
                    changeScene(Scenes.START);
                }

                if (pair.x + pipes.width <= 0) {
                    pipes.pairs.shift(pair);
                }
            });
        }
    }

    return pipes;
}

window.addEventListener('click', function () {
    if (activeScene.click) {
        activeScene.click();
    }
});

changeScene(Scenes.START);
loop();