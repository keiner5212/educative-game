import {
	Application,
	Assets,
	Container,
	Sprite,
	Text,
	TextStyle,
} from "pixi.js";
import { animateSmoothsprite, updateCharacterSprite } from "./animations";
import {
	JumperInterval,
	final,
	ground,
	isTouchingGround,
	keys,
	onRiddleDialog,
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
import { DetectColision, DetectJump, getRamdomRiddle } from "./utils";
import { dialogImg, emptyHeart, filledHeart, redFilter } from "../resources";
import { playSound } from "./music";
import { lifesLeft } from "./app";
import { createModal } from "../../components/modal";
import { openModal } from "../../utils";
import { createDialogInputForm, showDialog } from "./dialog";

export async function CreateSprite(
	initialQuietSprites: string[],
	x?: number,
	y?: number,
	height?: number,
	width?: number,
	controlled?: boolean,
	app?: Application,
	enemy?: boolean
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
		lifesLeft[character.uid] = Constants.INITIAL_LIFES;
		setInterval(() => {
			if (final[0]) return;
			const isTouching = groundCollector.some((c) =>
				DetectColision(character, c, 5, 15)
			);
			isTouchingGround[character.uid] = isTouching;
		}, 40);

		setInterval(() => {
			if (final[0]) return;
			enemyCollector.forEach(async (enemy) => {
				if (DetectJump(character, enemy)) {
					await animateDeath(enemy, app);
				} else if (DetectColision(character, enemy, 5, 15)) {
					await animateDeathPlayer(character, app);
					enemy.x += 800;

					if (lifesLeft[character.uid] <= 0) {
						app.stage.removeChild(enemy);
					}
				}
			});
		}, 20);
	} else if (enemy && app) {
		enemyCollector.push(character);
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
		if (final[0]) return;
		if (onRiddleDialog[character.uid]) return;
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
	chaser: boolean,
	groundLimit: number,
	startx: number = wallLeft,
	endx: number = wallRight - 200
) {
	if (jumper.value) {
		if (!JumperInterval[character.uid]) {
			JumperInterval[character.uid] = setInterval(() => {
				aleatoryJump(character, 6, groundLimit, jumper.probability);
			}, Constants.JUMPER_INTERVAL);
		}
	}
	let riggthTouched = false;
	let leftTouched = false;
	app.ticker.add(() => {
		if (chaser) {
			if (character.x < player.x && character.x < endx) {
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
			} else if (character.x > player.x && character.x > startx) {
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
		} else {
			if (character.x <= endx && !riggthTouched) {
				if (endx - character.x < 5) {
					riggthTouched = true;
					leftTouched = false;
				}

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
			} else if (character.x > startx && !leftTouched) {
				if (character.x - startx < 5) {
					leftTouched = true;
					riggthTouched = false;
				}
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

let loosingLife = false;
export async function animateDeathPlayer(character: Sprite, app: Application) {
	if (loosingLife) return;
	if (final[0]) return;
	loosingLife = true;
	onRiddleDialog[character.uid] = true;
	playSound("player-death");

	const riddle = getRamdomRiddle();
	const dialog1 = await showDialog(
		dialogImg,
		riddle.question,
		window.innerWidth / 2,
		window.innerHeight / 2 + 250
	);
	character.filters = [redFilter];
	character.x = Constants.CH_INITIAL_X;
	character.y = Constants.CH_INITIAL_Y;
	createDialogInputForm(
		window.innerWidth / 2,
		window.innerHeight / 2 + 350,
		"Answer",
		async (value) => {
			onRiddleDialog[character.uid] = false;
			app.stage.removeChild(dialog1);
			if (value === riddle.answer) {
				loosingLife = false;
				character.filters = [];
			} else {
				const heartsUI = await createLifesContainer(
					--lifesLeft[character.uid],
					app
				);

				app.stage.addChild(heartsUI);

				if (lifesLeft[character.uid] <= 0) {
					createModal(
						"Game Over",
						"You lost",
						"Play Again",
						"Decline",
						async () => {
							lifesLeft[character.uid] = Constants.INITIAL_LIFES;
							const heartsUI = await createLifesContainer(
								lifesLeft[character.uid],
								app
							);
							app.stage.addChild(heartsUI);
						},
						() => {
							location.reload();
						}
					);
					openModal();
				}
				character.filters = [];

				loosingLife = false;
			}
		}
	);

	app.stage.addChild(dialog1);
}
