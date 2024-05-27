import { Assets } from "pixi.js";

export async function loadContent(spriteImages: string[]) {
	for (const image of spriteImages) {
		await Assets.load(image);
	}
}
