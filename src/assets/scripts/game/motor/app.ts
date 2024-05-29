import { Application, Assets, Container, Sprite } from "pixi.js";
import { ground, speedX, speedY, wallLeft, wallRight } from "./variables";

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
	return app;
}

export async function SetBackground(app: Application, b_img: string) {
	const texture = await Assets.get(b_img);

	const background = new Sprite(texture);
	background.width = app.screen.width;
	background.height = app.screen.height;

	app.stage.addChild(background);
}

export function physics(
	character: Sprite,
	app: Application,
	characterGround: number = ground - 1
) {
	app.ticker.add(() => {
		// console.log("speedY: ", speedY, "character.y: ", character.y, "ground: ", characterGround);
		if (character.y <= characterGround && speedY[character.uid] !== 0) {
			character.y += speedY[character.uid];
		}

		if (character.y > characterGround) {
			character.y = characterGround;
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
	ground?: number,
	scaleFactor: number = 2
) {
	const texture = await Assets.get(g_img);

	texture.source.scaleMode = "nearest";

	const textureWidth = texture.width;
	const textureHeight = texture.height;
	const screenWidth = window.innerWidth;

	const groundH = (ground ?? c.height) - textureHeight * scaleFactor;

	const repeatCount = Math.ceil(screenWidth / textureWidth);

	for (let i = 0; i < repeatCount; i++) {
		const sprite = new Sprite(texture);

		sprite.x = i * textureWidth * scaleFactor;
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
	heightReducer: number = 0
) {
	const subgH = await SetGround(
		c,
		g_imgs[0],
		ground + heightReducer,
		scaleFactor
	);
	await SetGround(c, g_imgs[1], ground - subgH + heightReducer, scaleFactor);
}
