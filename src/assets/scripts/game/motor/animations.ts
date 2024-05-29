import { Application, Assets, Sprite } from "pixi.js";
import { animating, isQuietInterval, speedX, speedY } from "./variables";
import { Constants } from "../../constants";
import { filmSepiaFilter, noiseFilter } from "../sprites";

export function deleteAnimation(character: Sprite) {
	clearInterval(isQuietInterval[character.uid]);
	delete isQuietInterval[character.uid];
	delete animating[character.uid];
}

export async function updateCharacterSprite(
	character: Sprite,
	spriteImages: string[],
	feature: string,
	reset: boolean = false,
	spriteSpeed: number = Constants.ANIMATION_UPDATE
) {
	if (
		animating[character.uid] &&
		(animating[character.uid] === feature ||
			animating[character.uid] === "jumping")
	) {
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

export async function updateSpriteTexture(
	character: Sprite,
	spriteImage: string
) {
	const texture = await Assets.get(spriteImage);
	texture.source.scaleMode = "nearest";
	character.texture = texture;
}

export function setJumpingAnimations(
	character: Sprite,
	app: Application,
	sprites: string[]
) {
	if (sprites.length !== 2) {
		throw new Error("Jumping animations must have 2 sprites");
	}
	app.ticker.add(() => {
		if (speedY[character.uid] != 0) {
			animating[character.uid] = "jumping";
			clearInterval(isQuietInterval[character.uid]);
			if (speedY[character.uid] < 0) {
				updateSpriteTexture(character, sprites[0]);
			} else {
				updateSpriteTexture(character, sprites[1]);
			}
		} else if (animating[character.uid] === "jumping") {
			delete animating[character.uid];
		}
	});
}

export function setQuietAnimations(
	character: Sprite,
	app: Application,
	sprites: string[],
	spriteSpeed?: number
) {
	app.ticker.add(() => {
		if (speedY[character.uid] === 0 && speedX[character.uid] === 0) {
			updateCharacterSprite(
				character,
				sprites,
				"quiet",
				true,
				spriteSpeed
			);
		}
	});
}

export function setMovingAnimations(
	character: Sprite,
	app: Application,
	sprites: string[],
	spriteSpeed?: number
) {
	app.ticker.add(() => {
		if (speedX[character.uid] != 0 && speedY[character.uid] === 0) {
			updateCharacterSprite(
				character,
				sprites,
				"walking",
				true,
				spriteSpeed
			);
		}
	});
}

export async function animateSmoothsprite(
	sprite: Sprite,
	targetx: number,
	targety: number
) {
	const deltay = targety - sprite.y;
	const deltax = targetx - sprite.x;

	if (deltax === 0 || deltay === 0) {
		const speedx = 1;
		const speedy = 1;
		const interval = setInterval(() => {
			if (sprite.x != targetx || sprite.y != targety) {
				if (sprite.x < targetx) {
					sprite.x += speedx;
				} else if (sprite.x > targetx) {
					sprite.x -= speedx;
				}

				if (sprite.y < targety) {
					sprite.y += speedy;
				} else if (sprite.y > targety) {
					sprite.y -= speedy;
				}
			} else {
				clearInterval(interval);
			}
		}, 5);
	} else {
		const numSteps = Math.round(Math.sqrt(Math.round(deltax * deltax + deltay * deltay)));
		const dx = deltax / numSteps;
		const dy = deltay / numSteps;
		
		const interval = setInterval(() => {
			// console.log("sprite.x: ", sprite.x, "targetx: ", targetx, "dx: ", dx, "sprite.y: ", sprite.y, "targety: ", targety, "dy: ", dy, "numSteps: ", numSteps);
			if (Math.round(sprite.x) != targetx || Math.round(sprite.y) != targety) {
				sprite.x += dx;
				sprite.y += dy;
			} else {
				clearInterval(interval);
			}
		}, 5);
	}
}

export function animateNoise() {
	const time = Date.now();
	const noiseValue = Math.sin(time * 0.001) * 0.07 + 0.1;
	noiseFilter.noise = noiseValue;
}
export function SepiaOldFilter() {
	const time = Date.now();
	const noiseValue = Math.sin(time * 0.001) * 0.07 + 0.3;
	filmSepiaFilter.vignetting = noiseValue;
}
