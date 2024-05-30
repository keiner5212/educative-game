import { Assets, Sprite } from "pixi.js";

export async function loadContent(spriteImages: string[]) {
	const sprites = [];
	for (const image of spriteImages) {
		sprites.push(await Assets.load(image));
	}
	await Promise.all(sprites);
}

export function DetectColision(spriteA: Sprite, spriteB: Sprite, collisionDepthy: number = 5, collisionDepthx: number = 5): boolean {
	const aBounds = spriteA.getBounds();
	const bBounds = spriteB.getBounds();

	const aLeft = aBounds.x + collisionDepthx;
	const aRight = aBounds.x + aBounds.width - collisionDepthx;
	const aTop = aBounds.y + collisionDepthy;
	const aBottom = aBounds.y + aBounds.height - collisionDepthy;

	const bLeft = bBounds.x + collisionDepthx;
	const bRight = bBounds.x + bBounds.width - collisionDepthx;
	const bTop = bBounds.y + collisionDepthy;
	const bBottom = bBounds.y + bBounds.height - collisionDepthy;

	return (
		aRight > bLeft &&
		aLeft < bRight &&
		aBottom > bTop &&
		aTop < bBottom
	);
}
