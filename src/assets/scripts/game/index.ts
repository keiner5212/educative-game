import backgroundImg from "../../img/background.png";
import { ground } from "./motor/variables";
import {
	JspriteImages,
	WspriteImages,
	enemySprites,
	spriteImages,
} from "./motor/sprites";
import { loadContent } from "./motor/utils";
import { SetBackground, physics, setupApp } from "./motor/app";
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

export async function CreateGame() {
	await loadContent([
		...spriteImages,
		...WspriteImages,
		...JspriteImages,
		backgroundImg,
		...enemySprites,
	]);

	const app = await setupApp(60, window.innerWidth, window.innerHeight);
	await SetBackground(app, backgroundImg);

	const character = await addCharacter(app, spriteImages);
	setJumpingAnimations(character, app, JspriteImages);
	setQuietAnimations(character, app, spriteImages);
	setMovingAnimations(character, app, WspriteImages);

	const slime = await addCharacter(app, enemySprites, 200, ground + 15);

	enemyMovement(slime, character, app, -1, true, ground + 15);
	characterMovement(character, app, 1);

	physics(character, app);
	physics(slime, app, ground + 15);
}
