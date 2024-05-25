import { Application, Sprite, Assets } from "pixi.js";
import backgroundImg from "../../img/background.png";
//sprites

//quiet
import characterImg1 from "../../img/animations/estatico o off/esposo estatico1.png";
import characterImg2 from "../../img/animations/estatico o off/esposo estatico2.png";
import characterImg3 from "../../img/animations/estatico o off/esposo estatico3.png";
import characterImg4 from "../../img/animations/estatico o off/esposo estatico4.png";

//walk
import WcharacterImg1 from "../../img/animations/caminando/esposo caminando1.png";
import WcharacterImg2 from "../../img/animations/caminando/esposo caminando2.png";
import WcharacterImg3 from "../../img/animations/caminando/esposo caminando3.png";
import WcharacterImg4 from "../../img/animations/caminando/esposo caminando4.png";

//jump
import jumpImg4 from "../../img/animations/saltando/esposo saltando4.png";

import { Constants } from "../constants";

const ground = window.innerHeight - 135;
const wallRight = window.innerWidth;
const wallLeft = 0;

const xIntervalRight: { [characterUID: number]: number } = {};
const xIntervalLeft: { [characterUID: number]: number } = {};
const yInterval: { [characterUID: number]: number } = {};
const speedX: { [characterUID: number]: number } = {};
const speedY: { [characterUID: number]: number } = {};
const animating: { [characterUID: number]: string } = {};
const isQuietInterval: { [characterUID: number]: number } = {};
const keys: { [key: string]: boolean } = {};

async function SetBackground(app: Application, b_img: string) {
    const texture = await Assets.get(b_img);

    const background = new Sprite(texture);
    background.width = app.screen.width;
    background.height = app.screen.height;

    app.stage.addChild(background);
}

async function loadContent(spriteImages: string[]) {
    for (const image of spriteImages) {
        await Assets.load(image);
    }
}

async function addCharacter(
    app: Application,
    initialQuietSprites: string[],
    x?: number,
    y?: number
) {
    const texture = await Assets.get(initialQuietSprites[0]);
    const character = new Sprite(texture);
    character.anchor.x = 0.5;
    texture.source.scaleMode = "nearest";
    character.width = Constants.CHARACTER_WIDTH;
    character.height = Constants.CHARACTER_HEIGHT;
    character.x = x ?? app.screen.width / 2;
    character.y = y ?? ground - 1;
    speedY[character.uid] = 0
    speedX[character.uid] = 0
    app.stage.addChild(character);
    updateCharacterSprite(character, initialQuietSprites, "quiet");
    return character;
}

function startMovementRight(character: Sprite) {
    if (!xIntervalRight[character.uid]) {
        xIntervalRight[character.uid] = setInterval(() => {
            if (
                character.x < wallRight &&
                character.x > wallLeft &&
                speedX[character.uid] < Constants.MAX_SPEED_X
            ) {
                speedX[character.uid] += 1;
            }
        }, 90);
    }
}

function startMovementLeft(character: Sprite) {
    if (!xIntervalLeft[character.uid]) {
        xIntervalLeft[character.uid] = setInterval(() => {
            if (
                character.x < wallRight &&
                character.x > wallLeft &&
                speedX[character.uid] > -Constants.MAX_SPEED_X
            ) {
                speedX[character.uid] -= 1;
            }
        }, 90);
    }
}

function startJump(character: Sprite) {
    if (!yInterval[character.uid]) {
        speedY[character.uid] = -Constants.MAX_SPEED_Y;
        yInterval[character.uid] = setInterval(() => {
            if (character.y < ground - 1) {
                speedY[character.uid] += Constants.GRAVITY;
            } else {
                clearInterval(yInterval[character.uid]);
                delete yInterval[character.uid];
            }
        }, 90);
    }
}

async function updateCharacterSprite(
    character: Sprite,
    spriteImages: string[],
    feature: string,
    reset: boolean = false,
    spriteSpeed: number = 200
) {
    if (animating[character.uid] && animating[character.uid] === feature) {
        return;
    }
    if (reset) {
        clearInterval(isQuietInterval[character.uid]);
        delete isQuietInterval[character.uid];
    }
    if (!isQuietInterval[character.uid]) {
        animating[character.uid] = feature;
        let index = 0;
        isQuietInterval[character.uid] = setInterval(() => {
            const texture = Assets.get(spriteImages[index]);
            texture.source.scaleMode = "nearest";
            character.texture = texture;
            index = (index + 1) % spriteImages.length;
        }, spriteSpeed);
    }
}

function characterMovement(character: Sprite) {
    window.addEventListener("keydown", (e) => {
        keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
        keys[e.key] = false;
        switch (e.key) {
            case "ArrowRight":
            case "d":
                setTimeout(() => {
                    clearInterval(xIntervalRight[character.uid]);
                    delete xIntervalRight[character.uid];
                    speedX[character.uid] = 0;
                }, 50);
                break;
            case "ArrowLeft":
            case "a":
                setTimeout(() => {
                    clearInterval(xIntervalLeft[character.uid]);
                    delete xIntervalLeft[character.uid];
                    speedX[character.uid] = 0;
                }, 50);
                break;
        }
    });

    function updateCharacterMovement(character:Sprite) {
        if (keys["ArrowRight"] || keys["d"]) {
            character.scale.x = 1;
            character.width = Constants.CHARACTER_WIDTH;
            startMovementRight(character);
        } else if (keys["ArrowLeft"] || keys["a"]) {
            character.scale.x = -1;
            character.width = Constants.CHARACTER_WIDTH;
            startMovementLeft(character);
        }

        if (keys["ArrowUp"] || keys["w"] || keys[" "]) {
            startJump(character);
        }

        requestAnimationFrame(()=>{updateCharacterMovement(character)});
    }

    updateCharacterMovement(character);
}

function physics(character: Sprite, app: Application) {
    app.ticker.add(() => {
        console.log(speedX);

        // console.log("speedY: ", speedY, "character.y: ", character.y, "ground: ", ground);
        if (character.y <= ground - 1) {
            character.y += speedY[character.uid];
        }

        if (character.y > ground) {
            character.y = ground - 1;
            speedY[character.uid] = 0;
        }

        // console.log("speedX: ", speedX, "character.x: ", character.x, "app.screen.width: ", app.screen.width);
        if (
            character.x + speedX[character.uid] < wallRight &&
            character.x + speedX[character.uid] > wallLeft
        ) {
            character.x += speedX[character.uid];
        } else {
            speedX[character.uid] = 0;
        }
    });
}

function setJumpingAnimations(
    character: Sprite,
    app: Application,
    sprites: string[]
) {
    app.ticker.add(() => {
        if (
            speedY[character.uid] != 0 &&
            speedY[character.uid] < -Constants.GRAVITY
        ) {
            updateCharacterSprite(character, sprites, "jumping", true);
        }
    });
}

function setQuietAnimations(
    character: Sprite,
    app: Application,
    sprites: string[]
) {
    app.ticker.add(() => {
        if (speedY[character.uid] === 0 && speedX[character.uid] === 0) {
            updateCharacterSprite(character, sprites, "quiet", true);
        }
    });
}

function setMovingAnimations(
    character: Sprite,
    app: Application,
    sprites: string[]
) {
    app.ticker.add(() => {
        if (speedX[character.uid] != 0 && speedY[character.uid] === 0) {
            updateCharacterSprite(character, sprites, "walking", true);
        }
    });
}

async function setupApp(
    fps: number,
    width: number,
    height: number
): Promise<Application> {
    const app = new Application();
    await app.init();
    app.ticker.maxFPS = fps;
    app.renderer.resize(width, height);
    document.body.appendChild(app.canvas);
    app.canvas.classList.add("game-camvas");
    return app;
}

function setCharacterPos(character: Sprite, x: number, y: number) {
    character.x = x;
    character.y = y;
}

export async function CreateGame() {
    const spriteImages = [
        characterImg1,
        characterImg2,
        characterImg3,
        characterImg4,
    ];
    const WspriteImages = [
        WcharacterImg1,
        WcharacterImg2,
        WcharacterImg3,
        WcharacterImg4,
    ];
    const JspriteImages = [jumpImg4];
    await loadContent([
        ...spriteImages,
        ...WspriteImages,
        ...JspriteImages,
        backgroundImg,
    ]);

    const app = await setupApp(60, window.innerWidth, window.innerHeight);
    await SetBackground(app, backgroundImg);

    const character = await addCharacter(app, spriteImages);
    setJumpingAnimations(character, app, JspriteImages);
    setQuietAnimations(character, app, spriteImages);
    setMovingAnimations(character, app, WspriteImages);

    characterMovement(character);

    physics(character, app);
}
