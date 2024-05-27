import { Application, Assets, Sprite } from "pixi.js";
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
	characterY: number = ground - 1
) {
	app.ticker.add(() => {
		// console.log("speedY: ", speedY, "character.y: ", character.y, "ground: ", ground);
		if (character.y <= characterY) {
			character.y += speedY[character.uid];
		}

		if (character.y > characterY) {
			character.y = characterY;
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
