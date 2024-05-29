import { Assets } from "pixi.js";

export async function loadContent(spriteImages: string[]) {
	const sprites=[]
	for (const image of spriteImages) {
		sprites.push(await Assets.load(image));
	}
	await Promise.all(sprites);
}
