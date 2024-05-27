import { Application, Assets, Sprite } from "pixi.js";
import { updateCharacterSprite } from "./animations";
import {
	JumperInterval,
	ground,
	keys,
	speedX,
	speedY,
	wallLeft,
	wallRight,
	xIntervalLeft,
	xIntervalRight,
} from "./variables";
import {
	aleatoryJump,
	startJump,
	startMovementLeft,
	startMovementRight,
} from "./movement";
import { Constants } from "../../constants";

export async function addCharacter(
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
	speedY[character.uid] = 0;
	speedX[character.uid] = 0;
	app.stage.addChild(character);
	updateCharacterSprite(character, initialQuietSprites, "quiet");
	return character;
}

export function setCharacterPos(character: Sprite, x: number, y: number) {
	character.x = x;
	character.y = y;
}

export function characterMovement(
	character: Sprite,
	app: Application,
	initialDir: number
) {
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

	function updateCharacterMovement(character: Sprite) {
		if (keys["ArrowRight"] || keys["d"]) {
			startMovementRight(character, Constants.MAX_SPEED_X, initialDir);
		} else if (keys["ArrowLeft"] || keys["a"]) {
			startMovementLeft(character, -Constants.MAX_SPEED_X, -initialDir);
		}

		if (keys["ArrowUp"] || keys["w"] || keys[" "]) {
			startJump(character);
		}
	}

	app.ticker.add(() => {
		updateCharacterMovement(character);
	});
}

export function enemyMovement(
	character: Sprite,
	player: Sprite,
	app: Application,
	initialDir: number,
	jumper: boolean,
	groundLimit: number
) {
	if (jumper) {
		if (!JumperInterval[character.uid]) {
			JumperInterval[character.uid] = setInterval(() => {
				aleatoryJump(character, 6, groundLimit);
			}, 500);
		}
	}
	app.ticker.add(() => {
		if (character.x < player.x && character.x < wallRight) {
			startMovementRight(
				character,
				Constants.ENEMY_MOVE_SPEED,
				initialDir
			);
			if (xIntervalLeft[character.uid]) {
				setTimeout(() => {
					clearInterval(xIntervalLeft[character.uid]);
					delete xIntervalLeft[character.uid];
					speedX[character.uid] = 0;
				}, 50);
			}
		} else if (character.x > player.x && character.x > wallLeft) {
			startMovementLeft(
				character,
				-Constants.ENEMY_MOVE_SPEED,
				-initialDir
			);
			if (xIntervalRight[character.uid]) {
				setTimeout(() => {
					clearInterval(xIntervalRight[character.uid]);
					delete xIntervalRight[character.uid];
					speedX[character.uid] = 0;
				}, 50);
			}
		}
	});
}
