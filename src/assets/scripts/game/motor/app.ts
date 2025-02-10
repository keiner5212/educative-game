/* eslint-disable @typescript-eslint/no-explicit-any */
import { Application, Assets, Container, Sprite } from "pixi.js";
import {
	fallingInterval,
	final,
	ground,
	isTouchingGround,
	speedX,
	speedY,
	tickers,
	wallLeft,
	wallRight,
	yInterval,
} from "./variables";
import { groundCollector } from "./spriteCollectors";
import { startFall } from "./movement";
import { Constants } from "../../constants";
import { createLifesContainer } from "./characters";
import { createModal } from "../../components/modal";
import { openModal } from "../../utils";
import { playSound } from "./music";

export async function setupApp(
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
	app.canvas.width = window.innerWidth;

	return app;
}

export async function SetBackground(app: Application, b_img: string) {
	const texture = await Assets.get(b_img);

	const background = new Sprite(texture);
	background.width = app.screen.width;
	background.height = app.screen.height;

	app.stage.addChild(background);
}

export const lifesLeft: { [key: string]: number } = {};
let loosingLife = false;
let playingSound = false;

export function Characterphysics(
	character: Sprite,
	app: Application,
	characterGround: number = ground - 1
) {
	const update = async () => {
		const isfalling =
			!isTouchingGround[character.uid] && !yInterval[character.uid];

		if (character.y < characterGround && speedY[character.uid] !== 0) {
			if (character.y + speedY[character.uid] < characterGround) {
				character.y += speedY[character.uid];
			} else {
				clearInterval(yInterval[character.uid]);
				delete yInterval[character.uid];
				character.y = characterGround;
				speedY[character.uid] = 0;
			}
		}

		if (
			fallingInterval[character.uid] &&
			character.y > characterGround + 200 &&
			!loosingLife
		) {
			if (final[0]) return;
			loosingLife = true;
			setTimeout(async () => {
				character.x = Constants.CH_INITIAL_X;
				character.y = Constants.CH_INITIAL_Y;
				const heartsUI = await createLifesContainer(
					--lifesLeft[character.uid],
					app
				);

				clearInterval(fallingInterval[character.uid]);
				delete fallingInterval[character.uid];

				app.stage.addChild(heartsUI);

				if (lifesLeft[character.uid] <= 0) {
					if (!playingSound) {
						playingSound = true;
						playSound("player-death");
					}
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

				loosingLife = false;
			}, 100);
		}

		if (isfalling) {
			startFall(character);
		} else {
			clearInterval(fallingInterval[character.uid]);
			delete fallingInterval[character.uid];
		}

		if (
			fallingInterval[character.uid] &&
			!isTouchingGround[character.uid] &&
			!yInterval[character.uid]
		) {
			character.y += speedY[character.uid];
		}

		if (
			character.y > characterGround &&
			!fallingInterval[character.uid] &&
			!yInterval[character.uid]
		) {
			character.y = characterGround;
			speedY[character.uid] = 0;
		}

		if (
			character.x + speedX[character.uid] < wallRight &&
			character.x + speedX[character.uid] > wallLeft
		) {
			character.x += speedX[character.uid];
		} else {
			speedX[character.uid] = 0;
		}
	};
	tickers[character.uid] = update;
	app.ticker.add(update);
}

export function physics(
	character: Sprite,
	app: Application,
	characterGround: number = ground - 1
) {
	const update = () => {
		if (character.y <= characterGround && speedY[character.uid] !== 0) {
			if (character.y + speedY[character.uid] < characterGround) {
				character.y += speedY[character.uid];
			} else {
				character.y = characterGround;
				speedY[character.uid] = 0;
			}
		}

		if (character.y > characterGround && speedY[character.uid] !== 0) {
			character.y = characterGround;
			speedY[character.uid] = 0;
		}

		if (
			character.x + speedX[character.uid] < wallRight &&
			character.x + speedX[character.uid] > wallLeft
		) {
			character.x += speedX[character.uid];
		} else {
			speedX[character.uid] = 0;
		}
	};
	tickers[character.uid] = update;
	app.ticker.add(update);
}

export async function SetBackgroundRepeating(c: Container<any>, b_img: string) {
	const texture = await Assets.get(b_img);
	texture.source.scaleMode = "nearest";

	const textureWidth = texture.width;
	const textureHeight = texture.height;
	const screenHeight = window.innerHeight;
	const screenWidth = window.innerWidth;

	const repeatCount = Math.ceil(screenWidth / textureWidth);

	const scaleFactor = screenHeight / textureHeight;

	for (let i = 0; i < repeatCount; i++) {
		const sprite = new Sprite(texture);

		sprite.x = i * textureWidth * scaleFactor;
		sprite.y = 0;
		sprite.width = textureWidth * scaleFactor;
		sprite.height = screenHeight;

		c.addChild(sprite);
	}
}

export async function SetGround(
	c: Container<any>,
	g_img: string,
	Collector: any[],
	ground?: number,
	scaleFactor: number = 2,
	startx: number = wallLeft,
	endx: number = wallRight,
	collectSprites: boolean = false
) {
	const texture = await Assets.get(g_img);

	texture.source.scaleMode = "nearest";

	const textureWidth = texture.width;
	const textureHeight = texture.height;
	const screenWidth = endx - startx;

	const groundH = (ground ?? c.height) - textureHeight * scaleFactor;

	const repeatCount = Math.ceil(screenWidth / (textureWidth * scaleFactor));

	for (let i = 0; i < repeatCount; i++) {
		const sprite = new Sprite(texture);

		if (collectSprites) {
			Collector.push(sprite);
		}

		sprite.x = startx + i * textureWidth * scaleFactor;
		sprite.y = groundH;
		sprite.width = textureWidth * scaleFactor;
		sprite.height = textureHeight * scaleFactor;

		c.addChild(sprite);
	}

	return textureHeight * scaleFactor;
}

export async function SetDoubleGround(
	c: Container<any>,
	g_imgs: string[],
	scaleFactor: number = 2,
	heightReducer: number = 0,
	startx: number = wallLeft,
	endx: number = wallRight,
	collectSprites: boolean = false
) {
	const subgH = await SetGround(
		c,
		g_imgs[0],
		[],
		ground + heightReducer,
		scaleFactor,
		startx,
		endx
	);
	await SetGround(
		c,
		g_imgs[1],
		groundCollector,
		ground - subgH + heightReducer,
		scaleFactor,
		startx,
		endx,
		collectSprites
	);
}
