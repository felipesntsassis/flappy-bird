console.log('Flappy Bird - Felipe Assis');

const sound_Hit = new Audio();
sound_Hit.src = './effects/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

//[Floor]
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
    }
}

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
        console.log(flappyBird.speed);
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
            floor.draw();
            getReadyMessage.draw();
            globals.flappyBird.draw();
        },
        initialize() {
            globals.flappyBird = makeFlappyBird();
        },
        update() {
 
        },
    },

};
Scenes.GAME = {
    click() {
        globals.flappyBird.toJump();
    },
    draw() {
        background.draw();
        floor.draw();
        globals.flappyBird.draw();
    },
    update() {
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
    requestAnimationFrame(loop);
}

function makeFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        gravity: 0.25,
        jump: 4.6,
        speed: 0,
        draw() {
            context.drawImage(
                sprites,
                flappyBird.spriteX, flappyBird.spriteY, // Sprite X, Sprite Y
                flappyBird.width, flappyBird.height, // tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.width, flappyBird.height
            );
        },
        toJump() {
            console.log('I must jump!');
            console.log('[before]', flappyBird.speed);
            flappyBird.speed = - flappyBird.jump;
            console.log('[after]', flappyBird.speed);
        },
        update() {
            if (hasColision(flappyBird, floor)) {
                console.log('has colision');
                sound_Hit.play();
                setTimeout(() => {
                    changeScene(Scenes.START);
                }, 500)
                return;
            }

            flappyBird.speed += flappyBird.gravity;
            flappyBird.y += flappyBird.speed;
        }
    };

    return flappyBird;
}

window.addEventListener('click', function () {
    if (activeScene.click) {
        activeScene.click();
    }
});

changeScene(Scenes.START);
loop();