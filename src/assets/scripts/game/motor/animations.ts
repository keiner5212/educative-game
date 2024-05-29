import { Application, Assets, Sprite } from "pixi.js";
import { animating, isQuietInterval, speedX, speedY } from "./variables";
import { Constants } from "../../constants";

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
