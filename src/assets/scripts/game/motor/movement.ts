import { Sprite } from "pixi.js";
import { Constants } from "../../constants";
import { ground, speedX, speedY, wallLeft, wallRight, xIntervalLeft, xIntervalRight, yInterval } from "./variables";

export function startMovementRight(character: Sprite, speed: number, facing: number) {
    if (!xIntervalRight[character.uid]) {
        character.scale.x = facing;
        character.width = Constants.CHARACTER_WIDTH;
        xIntervalRight[character.uid] = setInterval(() => {
            if (
                character.x < wallRight &&
                character.x > wallLeft &&
                speedX[character.uid] < speed
            ) {
                speedX[character.uid] += 1;
            }
        }, 90);
    }
}

export function startMovementLeft(character: Sprite, speed: number, facing: number) {
    if (!xIntervalLeft[character.uid]) {
        character.scale.x = facing;
        character.width = Constants.CHARACTER_WIDTH;
        xIntervalLeft[character.uid] = setInterval(() => {
            if (
                character.x < wallRight &&
                character.x > wallLeft &&
                speedX[character.uid] > speed
            ) {
                speedX[character.uid] -= 1;
            }
        }, 90);
    }
}

export function startJump(character: Sprite) {
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

export function aleatoryJump(character: Sprite, maxSpeed: number, groundLimit: number) {
    const random = Math.random();
    if (random < 0.5) {
        if (!yInterval[character.uid]) {
            speedY[character.uid] = -maxSpeed;
            yInterval[character.uid] = setInterval(() => {
                if (character.y < groundLimit) {
                    speedY[character.uid] += Constants.GRAVITY;
                } else {
                    clearInterval(yInterval[character.uid]);
                    delete yInterval[character.uid];
                }
            }, 90);
        }

    }
}
