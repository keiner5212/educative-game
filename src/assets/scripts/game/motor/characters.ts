import {
	Application,
	Assets,
	ColorMatrixFilter,
	Container,
	Sprite,
	Text,
	TextStyle,
} from "pixi.js";
import { animateSmoothsprite, updateCharacterSprite } from "./animations";
import {
	JumperInterval,
	ground,
	isTouchingGround,
	keys,
	speedX,
	speedY,
	tickers,
	wallLeft,
	wallRight,
	xIntervalLeft,
	xIntervalRight,
	yInterval,
} from "./variables";
import {
	aleatoryJump,
	startJump,
	startMovementLeft,
	startMovementRight,
} from "./movement";
import { Constants } from "../../constants";
import { enemyCollector, groundCollector } from "./spriteCollectors";
import { DetectColision, DetectJump } from "./utils";
import { emptyHeart, filledHeart } from "../resources";
import { playSound } from "./music";

export async function CreateSprite(
	initialQuietSprites: string[],
	x?: number,
	y?: number,
	height?: number,
	width?: number,
	controlled?: boolean,
	app?: Application
) {
	const texture = await Assets.get(initialQuietSprites[0]);
	const character = new Sprite(texture);
	character.anchor.set(0.5);
	texture.source.scaleMode = "nearest";
	character.width = width ?? Constants.CHARACTER_WIDTH;
	character.height = height ?? Constants.CHARACTER_HEIGHT;
	character.x = x ?? window.innerWidth / 2;
	character.y = y ?? ground - 1;
	speedY[character.uid] = Constants.GRAVITY * 3;
	speedX[character.uid] = 0;
	updateCharacterSprite(character, initialQuietSprites, "quiet");

	if (controlled && app) {
		yInterval[character.uid] = 1;
		setInterval(() => {
			const isTouching = groundCollector.some((c) =>
				DetectColision(character, c, 5, 15)
			);
			isTouchingGround[character.uid] = isTouching;
		}, 40);

		setInterval(() => {
			enemyCollector.forEach(async (enemy) => {
				if (DetectJump(character, enemy)) {
					await animateDeath(enemy, app);
				}
			});
		}, 40);
	}

	return character;
}

export function setCharacterPos(character: Sprite, x: number, y: number) {
	character.x = x;
	character.y = y;
}

export function characterMovement(
	character: Sprite,
	app: Application,
	initialDir: number,
	chGround: number = ground
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
		if (
			(keys["ArrowRight"] || keys["d"]) &&
			!(keys["ArrowLeft"] || keys["a"])
		) {
			startMovementRight(character, Constants.MAX_SPEED_X, initialDir);
		}

		if (
			(keys["ArrowLeft"] || keys["a"]) &&
			!(keys["ArrowRight"] || keys["d"])
		) {
			startMovementLeft(character, -Constants.MAX_SPEED_X, -initialDir);
		}

		if (keys["ArrowUp"] || keys["w"] || keys[" "]) {
			startJump(character, chGround);
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
	jumper: { value: boolean; probability: number },
	groundLimit: number
) {
	if (jumper.value) {
		if (!JumperInterval[character.uid]) {
			JumperInterval[character.uid] = setInterval(() => {
				aleatoryJump(character, 6, groundLimit, jumper.probability);
			}, Constants.JUMPER_INTERVAL);
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

let lifeContainer: Container;

export async function createLifesContainer(
	lifes_left: number,
	app: Application
) {
	if (lifeContainer) {
		app.stage.removeChild(lifeContainer);
	}

	const container = new Container();

	const textStyle = new TextStyle({
		fontFamily: Constants.FONT_FAMILY,
		fontSize: 24,
		fill: "black",
	});
	const lifesText = new Text("Lifes", textStyle);
	lifesText.anchor.set(0.5);
	lifesText.x = 0;
	lifesText.y = 0;
	container.addChild(lifesText);

	const heartTexture = await Assets.get(filledHeart);
	const heartemptyTexture = await Assets.get(emptyHeart);
	heartTexture.source.scaleMode = "nearest";
	const heartSize = Constants.HEART_SIZE;

	for (let i = 0; i < lifes_left; i++) {
		const heart = new Sprite(heartTexture);
		heart.width = heartSize;
		heart.height = heartSize;
		heart.x = i * (heartSize + 10);
		heart.y = heartSize * 2;
		container.addChild(heart);
	}

	for (let i = lifes_left; i < Constants.INITIAL_LIFES; i++) {
		const emptyHeart = new Sprite(heartemptyTexture);
		emptyHeart.width = heartSize;
		emptyHeart.height = heartSize;
		emptyHeart.x = i * (heartSize + 10);
		emptyHeart.y = heartSize * 2;
		container.addChild(emptyHeart);
	}

	container.x = wallRight - 6 * Constants.HEART_SIZE;
	container.y = Constants.HEART_SIZE * 2;
	container.width = 6 * Constants.HEART_SIZE;

	lifeContainer = container;
	return container;
}

let playingSound = false;
export async function animateDeath(character: Sprite, app: Application) {
	if (!playingSound) {
		playingSound = true;
		playSound("monster-death");
	}
	const redFilter = new ColorMatrixFilter();
	redFilter.greyscale(0.5, false);
	redFilter.brightness(1.5, false);
	redFilter.tint(0xff0000, false);
	character.filters = [redFilter];

	await animateSmoothsprite(
		character,
		character.x,
		ground + character.height
	);

	app.ticker.remove(tickers[character.uid]);
	delete tickers[character.uid];

	setTimeout(() => {
		app.stage.removeChild(character);
	}, 1000);
}
