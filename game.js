console.log('Flappy Bird - Felipe Assis');

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
const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
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
    update() {
        flappyBird.speed += flappyBird.gravity;
        console.log(flappyBird.speed);
        flappyBird.y += flappyBird.speed;
    }
};

function loop() {
    background.draw();
    floor.draw();
    flappyBird.update();
    flappyBird.draw();

    requestAnimationFrame(loop);
}

loop();