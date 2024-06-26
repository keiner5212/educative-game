import { Sprite } from "pixi.js";
import { Constants } from "../../constants";
import {
	fallingInterval,
	speedX,
	speedY,
	wallLeft,
	wallRight,
	xIntervalLeft,
	xIntervalRight,
	yInterval,
} from "./variables";

export function startMovementRight(
	character: Sprite,
	speed: number,
	facing: number
) {
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
		}, Constants.ANIMATION_UPDATE);
	}
}

export function startMovementLeft(
	character: Sprite,
	speed: number,
	facing: number
) {
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
		}, Constants.MOVEMENT_UPDATE);
	}
}

export function startJump(character: Sprite, ground: number) {
	if (!yInterval[character.uid]) {
		speedY[character.uid] = -Constants.MAX_SPEED_Y;
		character.y = ground - 6;
		yInterval[character.uid] = setInterval(() => {
			speedY[character.uid] += Constants.GRAVITY;
		}, Constants.MOVEMENT_UPDATE);
	}
}

export function startFall(character: Sprite) {
	if (!fallingInterval[character.uid]) {
		fallingInterval[character.uid] = setInterval(() => {
			speedY[character.uid] += Constants.GRAVITY;
		}, Constants.MOVEMENT_UPDATE);
	}
}

export function aleatoryJump(
	character: Sprite,
	maxSpeed: number,
	groundLimit: number,
	probability: number
) {
	const random = Math.random();
	if (random < probability) {
		if (!yInterval[character.uid] && character.y <= groundLimit) {
			speedY[character.uid] = -maxSpeed;
			yInterval[character.uid] = setInterval(() => {
				if (character.y < groundLimit) {
					speedY[character.uid] += Constants.GRAVITY;
				} else {
					clearInterval(yInterval[character.uid]);
					delete yInterval[character.uid];
				}
			}, Constants.MOVEMENT_UPDATE);
		}
	}
}
