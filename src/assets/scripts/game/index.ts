import { Application, Sprite, Assets } from 'pixi.js';
import backgroundImg from "../../img/background.png"
//sprites

//quiet
import characterImg1 from "../../img/animations/estatico o off/esposo estatico1.png"
import characterImg2 from "../../img/animations/estatico o off/esposo estatico2.png"
import characterImg3 from "../../img/animations/estatico o off/esposo estatico3.png"
import characterImg4 from "../../img/animations/estatico o off/esposo estatico4.png"

//walk
import WcharacterImg1 from "../../img/animations/caminando/esposo caminando1.png"
import WcharacterImg2 from "../../img/animations/caminando/esposo caminando2.png"
import WcharacterImg3 from "../../img/animations/caminando/esposo caminando3.png"
import WcharacterImg4 from "../../img/animations/caminando/esposo caminando4.png"

//jump
import jumpImg4 from "../../img/animations/saltando/esposo saltando4.png"

import { Constants } from '../constants';

let speedX = 0;
let speedY = 0;
const ground = window.innerHeight - 135
const wallRight = window.innerWidth
const wallLeft = 0

let xIntervalRight: number | undefined = undefined
let xIntervalLeft: number | undefined = undefined
let yInterval: number | undefined = undefined

const spriteImages = [characterImg1, characterImg2, characterImg3, characterImg4];
const WspriteImages = [WcharacterImg1, WcharacterImg2, WcharacterImg3, WcharacterImg4];
const JspriteImages = [jumpImg4];

let animating: string | undefined = undefined

let isQuietInterval: number | undefined = undefined

async function addBackground(app: Application) {
    const texture = await Assets.load(backgroundImg);

    const background = new Sprite(texture);
    background.width = app.screen.width;
    background.height = app.screen.height;

    app.stage.addChild(background);
}

async function loadSprites(spriteImages: string[]) {
    for (const image of spriteImages) {
        await Assets.load(image);
    }
}

async function addCharacter(app: Application, spriteImages: string[]) {
    const texture = await Assets.get(spriteImages[0]);

    const character = new Sprite(texture);

    character.anchor.x = 0.5;

    texture.baseTexture.scaleMode = "nearest";
    character.width = Constants.CHARACTER_WIDTH;
    character.height = Constants.CHARACTER_HEIGHT;

    character.x = app.screen.width / 2;
    character.y = ground - 1;

    app.stage.addChild(character);

    updateCharacterSprite(character, spriteImages, "quiet");

    return character;
}

function startMovementRight(character: Sprite) {
    if (!xIntervalRight) {
        xIntervalRight = setInterval(() => {
            if (character.x < wallRight && character.x > wallLeft && speedX < Constants.MAX_SPEED_X) {
                speedX += 1;
            }
        }, 90);
    }
}

function startMovementLeft(character: Sprite) {
    if (!xIntervalLeft) {
        xIntervalLeft = setInterval(() => {
            if (character.x < wallRight && character.x > wallLeft && speedX > -Constants.MAX_SPEED_X) {
                speedX -= 1;
            }
        }, 90);
    }
}

function startJump(character: Sprite) {
    if (!yInterval) {
        speedY = -Constants.MAX_SPEED_Y;
        yInterval = setInterval(() => {
            if (character.y < ground - 1) {
                speedY += Constants.GRAVITY;
            } else {
                clearInterval(yInterval);
                yInterval = undefined;
            }
        }, 90);
    }
}

async function updateCharacterSprite(character: Sprite, spriteImages: string[], feature: string, reset: boolean = false) {
    if (animating && animating === feature) {
        return
    }
    if (reset) {
        clearInterval(isQuietInterval);
        isQuietInterval = undefined;
    }
    if (!isQuietInterval) {
        animating = feature
        let index = 0;
        isQuietInterval = setInterval(() => {
            const texture = Assets.get(spriteImages[index]);
            texture.baseTexture.scaleMode = "nearest";
            character.texture = texture
            index = (index + 1) % spriteImages.length;
        }, 200);
    }
}

const keys: { [key: string]: boolean } = {};

function characterMovement(character: Sprite) {
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        switch (e.key) {
            case 'ArrowRight':
            case 'd':
                setTimeout(() => {
                    clearInterval(xIntervalRight);
                    xIntervalRight = undefined;
                    speedX = 0;
                }, 50);
                break;
            case 'ArrowLeft':
            case 'a':
                setTimeout(() => {
                    clearInterval(xIntervalLeft);
                    xIntervalLeft = undefined;
                    speedX = 0;
                }, 50);
                break;
        }
    });

    function updateCharacterMovement() {
        if (keys['ArrowRight'] || keys['d']) {
            character.scale.x = 1;
            character.width = Constants.CHARACTER_WIDTH;
            startMovementRight(character);
        } else if (keys['ArrowLeft'] || keys['a']) {
            character.scale.x = -1;
            character.width = Constants.CHARACTER_WIDTH;
            startMovementLeft(character);
        }

        if (keys['ArrowUp'] || keys['w'] || keys[' ']) {
            startJump(character);
        }

        requestAnimationFrame(updateCharacterMovement);
    }

    updateCharacterMovement();
}

function physics(character: Sprite, app: Application) {
    app.ticker.add(() => {
        // console.log("speedY: ", speedY, "character.y: ", character.y, "ground: ", ground);
        if (character.y <= ground - 1) {
            character.y += speedY
        }

        if (character.y > ground) {
            character.y = ground - 1
            speedY = 0
        }

        // console.log("speedX: ", speedX, "character.x: ", character.x, "app.screen.width: ", app.screen.width);
        if ((character.x + speedX) < wallRight && (character.x + speedX) > wallLeft) {
            character.x += speedX
        } else {
            speedX = 0
        }

        if (speedY === 0 && speedX === 0) {
            updateCharacterSprite(character, spriteImages, "quiet", true);
        }

        if (speedY != 0) {
            updateCharacterSprite(character, JspriteImages, "jumping", true);
        }

        if (speedX != 0 && speedY === 0) {
            updateCharacterSprite(character, WspriteImages, "walking", true);
        }
    })

}


export async function CreateGame() {
    const app = new Application();

    await app.init();

    app.ticker.maxFPS = 60

    app.renderer.resize(window.innerWidth, window.innerHeight)

    document.body.appendChild(app.canvas);

    app.canvas.classList.add("game-camvas");

    await addBackground(app);

    await loadSprites([...spriteImages, ...WspriteImages, ...JspriteImages]);
    const character = await addCharacter(app, spriteImages);

    characterMovement(character);

    physics(character, app);

}