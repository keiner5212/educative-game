import backgroundImg from "../../img/world/bg/bg-3.png";
import groundTile from "../../img/world/Tiles/tile_0002.png";
import subgroundTile from "../../img/world/Tiles/tile_0004.png";
import {
	JspriteImages,
	WspriteImages,
	slimeenemyJSprites,
	slimeenemySprites,
	spriteImages,
} from "./sprites";
import { loadContent } from "./motor/utils";
import {
	SetBackgroundRepeating,
	SetDoubleGround,
	physics,
	setupApp,
} from "./motor/app";
import {
	addCharacter,
	characterMovement,
	enemyMovement,
} from "./motor/characters";
import {
	setJumpingAnimations,
	setMovingAnimations,
	setQuietAnimations,
} from "./motor/animations";
import { Constants } from "../constants";

export async function CreateGame() {
	await loadContent([
		...spriteImages,
		...WspriteImages,
		...JspriteImages,
		backgroundImg,
		...slimeenemySprites,
		groundTile,
		subgroundTile,
		...slimeenemyJSprites,
	]);

	const app = await setupApp(60, window.innerWidth, window.innerHeight);
	await SetBackgroundRepeating(app, backgroundImg);
	await SetDoubleGround(app, [subgroundTile, groundTile], 2, 10);

	const character = await addCharacter(
		app,
		spriteImages,
		100,
		Constants.GROUND
	);
	setJumpingAnimations(character, app, JspriteImages);
	setQuietAnimations(character, app, spriteImages);
	setMovingAnimations(character, app, WspriteImages);

	const slime = await addCharacter(
		app,
		slimeenemySprites,
		200,
		Constants.GROUND + 15
	);

	enemyMovement(slime, character, app, -1, true, Constants.GROUND + 15);
	characterMovement(character, app, 1, Constants.GROUND);

	physics(character, app, Constants.GROUND);
	physics(slime, app, Constants.GROUND + 15);
	setJumpingAnimations(slime, app, slimeenemyJSprites);
	setQuietAnimations(slime, app, slimeenemySprites);
	setMovingAnimations(slime, app, slimeenemySprites);
}
