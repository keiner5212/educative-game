import {
	JspriteImages,
	WspriteImages,
	backgroundImg,
	dialogImg,
	emptyHeart,
	enemygif,
	filledHeart,
	filmSepiaFilter,
	finalSceneImg1,
	groundTile,
	mangif,
	noiseFilter,
	platformImg,
	slimeenemyJSprites,
	slimeenemySprites,
	spriteImages,
	subgroundTile,
	subwaterImg1,
	waterImg1,
	womangif,
} from "./resources";
import { loadContent } from "./motor/utils";
import {
	Characterphysics,
	SetBackgroundRepeating,
	SetDoubleGround,
	SetGround,
	physics,
	setupApp,
} from "./motor/app";
import {
	CreateSprite,
	characterMovement,
	createLifesContainer,
	enemyMovement,
} from "./motor/characters";
import {
	SepiaOldFilter,
	animateNoise,
	animateSmoothsprite,
	deleteAnimation,
	setJumpingAnimations,
	setMovingAnimations,
	setQuietAnimations,
} from "./motor/animations";
import { Constants } from "../constants";
import { closeModal } from "../utils";
import { Application, Container } from "pixi.js";
import { createButtonAt, showDialog } from "./motor/dialog";
import { wallRight } from "./motor/variables";
import { platformCollector } from "./motor/spriteCollectors";

const esceneBg = new Container();
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
		...mangif,
		...womangif,
		...enemygif,
		dialogImg,
		subwaterImg1,
		waterImg1,
		filledHeart,
		emptyHeart,
		finalSceneImg1,
		platformImg,
	]);

	const app = await setupApp(60, window.innerWidth, window.innerHeight);

	app.stage.addChild(esceneBg);
	await SetBackgroundRepeating(esceneBg, backgroundImg);
	await SetDoubleGround(
		esceneBg,
		[subgroundTile, groundTile],
		2,
		10,
		0,
		wallRight - 600,
		true
	);
	await SetDoubleGround(
		esceneBg,
		[subwaterImg1, waterImg1],
		2,
		15,
		wallRight - 600
	);

	esceneBg.filters = [filmSepiaFilter, noiseFilter];
	app.ticker.add(SepiaOldFilter);
	app.ticker.add(animateNoise);

	closeModal();

	const character = await CreateSprite(
		mangif,
		0,
		(window.innerHeight * 3) / 4,
		400,
		400
	);

	app.stage.addChild(character);

	await animateSmoothsprite(character, 200, (window.innerHeight * 3) / 4);

	const dialog1 = await showDialog(
		dialogImg,
		"Todo lo que amo y mi corazón están en enigma world.",
		window.innerWidth / 2,
		window.innerHeight / 2 + 250
	);

	createButtonAt(
		window.innerWidth / 2,
		window.innerHeight / 2 + 350,
		"Continuar",
		async () => {
			app.stage.removeChild(dialog1);
			app.stage.removeChild(character);
			deleteAnimation(character);
			await scene2(app);
		}
	);

	app.stage.addChild(dialog1);
}

async function scene2(app: Application) {
	const woman = await CreateSprite(
		womangif,
		0,
		(window.innerHeight * 3) / 4,
		400,
		400
	);

	app.stage.addChild(woman);
	await animateSmoothsprite(woman, 200, (window.innerHeight * 3) / 4);

	const enemy = await CreateSprite(
		enemygif,
		window.innerWidth,
		(window.innerHeight * 3) / 4,
		400,
		400
	);

	app.stage.addChild(enemy);
	await animateSmoothsprite(
		enemy,
		window.innerWidth - 200,
		window.innerHeight / 2 - 250
	);

	const dialog1 = await showDialog(
		dialogImg,
		"Cuando el malvado conde enigma secuestro a bella esposa Angela.",
		window.innerWidth / 2,
		window.innerHeight / 2 + 250
	);

	createButtonAt(
		window.innerWidth / 2,
		window.innerHeight / 2 + 350,
		"Continuar",
		async () => {
			app.stage.removeChild(dialog1);
			app.stage.removeChild(woman);
			app.stage.removeChild(enemy);
			deleteAnimation(woman);
			deleteAnimation(enemy);
			await scene3(app);
		}
	);

	app.stage.addChild(dialog1);
}

async function scene3(app: Application) {
	const character = await CreateSprite(
		mangif,
		0,
		(window.innerHeight * 3) / 4,
		400,
		400
	);

	app.stage.addChild(character);

	await animateSmoothsprite(character, 200, (window.innerHeight * 3) / 4);
	const dialog1 = await showDialog(
		dialogImg,
		"Ahora tengo que ir en busca de ella.. para recuperar a mi hermosa amada.",
		window.innerWidth / 2,
		window.innerHeight / 2 + 250
	);
	createButtonAt(
		window.innerWidth / 2,
		window.innerHeight / 2 + 350,
		"Continuar",
		async () => {
			app.stage.removeChild(dialog1);
			app.stage.removeChild(character);
			esceneBg.filters = [];
			app.ticker.remove(SepiaOldFilter);
			app.ticker.remove(animateNoise);
			deleteAnimation(character);
			await createPlayable(app);
		}
	);

	app.stage.addChild(dialog1);
}

async function createPlayable(app: Application) {
	const character = await CreateSprite(
		spriteImages,
		Constants.CH_INITIAL_X,
		Constants.CH_INITIAL_Y,
		undefined,
		undefined,
		true,
		app
	);

	setJumpingAnimations(character, app, JspriteImages);
	setQuietAnimations(character, app, spriteImages, 200);
	setMovingAnimations(character, app, WspriteImages);
	characterMovement(character, app, 1, Constants.GROUND);
	Characterphysics(character, app, Constants.GROUND);
	app.stage.addChild(character);
	const heartsUI = await createLifesContainer(Constants.INITIAL_LIFES, app);

	app.stage.addChild(heartsUI);

	const slime = await CreateSprite(
		slimeenemySprites,
		200,
		Constants.GROUND + 15,
		undefined,
		undefined,
		false,
		app,
		true
	);
	setJumpingAnimations(slime, app, slimeenemyJSprites);
	setQuietAnimations(slime, app, slimeenemySprites);
	setMovingAnimations(slime, app, slimeenemySprites);
	enemyMovement(
		slime,
		character,
		app,
		-1,
		{ value: true, probability: 0.5 },
		false,
		Constants.GROUND + 15,
		400,
		wallRight - 600
	);
	physics(slime, app, Constants.GROUND + 15);
	app.stage.addChild(slime);

	await SetGround(
		esceneBg,
		platformImg,
		platformCollector,
		900,
		2,
		400,
		600,
		true
	);
}
