/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	JspriteImages,
	WspriteImages,
	alien1Sprites,
	alien2Sprites,
	alien3Sprites,
	alien4Sprites,
	backgroundImg,
	dialogImg,
	diamondImg1,
	emptyHeart,
	enemygif,
	filledHeart,
	filmSepiaFilter,
	finalSceneImg1,
	groundTile,
	mangif,
	noiseFilter,
	ojoMalvadoSprites,
	platformImg,
	slimeenemyJSprites,
	slimeenemySprites,
	spriteImages,
	subgroundTile,
	subwaterImg1,
	villain,
	waterImg1,
	woman,
	womangif,
} from "./resources";
import { DetectColision, loadContent } from "./motor/utils";
import {
	Characterphysics,
	SetBackground,
	SetBackgroundRepeating,
	SetDoubleGround,
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
	animateDiamondSprite,
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
import { final, wallLeft, wallRight } from "./motor/variables";
import { enemyCollector, groundCollector } from "./motor/spriteCollectors";

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
		diamondImg1,
		...ojoMalvadoSprites,
		...alien1Sprites,
		...alien2Sprites,
		...alien3Sprites,
		...alien4Sprites,
		...woman,
		...villain,
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
		5,
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
		5,
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
		5,
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


	const diamond = await CreateSprite(
		[diamondImg1],
		500,
		Constants.GROUND,
		30,
		30,
		false,
		app,
		false
	);
	let ejecutado = false;

	app.ticker.add(async () => {
		const colision = DetectColision(character, diamond);
		animateDiamondSprite(diamond);

		if (colision) {
			if (!ejecutado) {
				ejecutado = true;
				app.stage.removeChild(diamond);
				diamond.x = -100;
				slime.x = -100;
				app.stage.removeChild(slime);
				while (groundCollector.length > 0) {
					groundCollector.pop();
				}
				await level2(app, character);
			} else {
				return;
			}
		}
	});

	app.stage.addChild(diamond);
}

async function level2(app: Application, character: any) {
	character.x = Constants.CH_INITIAL_X;
	character.y = Constants.CH_INITIAL_Y;

	await SetDoubleGround(
		esceneBg,
		[subgroundTile, groundTile],
		2,
		5,
		0,
		wallRight,
		true
	);

	const ojoMalvdo = await CreateSprite(
		ojoMalvadoSprites,
		700,
		Constants.GROUND + 20,
		undefined,
		undefined,
		false,
		app,
		true
	);
	enemyMovement(
		ojoMalvdo,
		character,
		app,
		-1,
		{ value: false, probability: 0 },
		false,
		Constants.GROUND + 20,
		300,
		wallRight
	);
	physics(ojoMalvdo, app, Constants.GROUND + 20);
	enemyCollector.push(ojoMalvdo);
	app.stage.addChild(ojoMalvdo);

	const aliensprites = [
		alien1Sprites,
		alien2Sprites,
		alien3Sprites,
		alien4Sprites,
	];
	const randomChoice = Math.floor(Math.random() * 4);
	const alien = await CreateSprite(
		aliensprites[randomChoice],
		600,
		Constants.GROUND + 20,
		30,
		40,
		false,
		app,
		false
	);
	enemyMovement(
		alien,
		character,
		app,
		-1,
		{ value: false, probability: 0 },
		true,
		Constants.GROUND,
		wallLeft,
		wallRight - 600
	);
	physics(alien, app, Constants.GROUND);

	enemyCollector.push(alien);
	app.stage.addChild(alien);

	const diamond = await CreateSprite(
		[diamondImg1],
		900,
		Constants.GROUND,
		30,
		40,
		false,
		app,
		false
	);

	let ejecutado = false;
	app.ticker.add(async () => {
		const colision = DetectColision(character, diamond);
		animateDiamondSprite(diamond);

		if (colision) {
			if (!ejecutado) {
				ejecutado = true;
				app.stage.removeChild(character);
				app.stage.removeChild(diamond);
				app.stage.removeChild(alien);
				app.stage.removeChild(ojoMalvdo);
				final[0] = true;
				while (groundCollector.length > 0) {
					groundCollector.pop();
				}
				diamond.x = -100;
				await scinematicEnd(app);
			}
		}
	});

	app.stage.addChild(diamond);
}

async function scinematicEnd(app: Application) {
	SetBackground(app, finalSceneImg1);

	const character = await CreateSprite(
		spriteImages,
		(window.innerWidth * 3) / 4,
		(window.innerHeight * 3) / 4,
		300,
		300
	);

	character.scale.x = -1;
	character.width = 300;

	app.stage.addChild(character);
	const character2 = await CreateSprite(
		woman,
		200,
		(window.innerHeight * 3) / 4 - 80,
		300,
		300
	);

	app.stage.addChild(character);
	const character3 = await CreateSprite(
		villain,
		200,
		window.innerHeight / 2 - 150,
		300,
		300
	);

	app.stage.addChild(character);
	app.stage.addChild(character2);
	app.stage.addChild(character3);

	const dialog1 = await showDialog(
		dialogImg,
		"CONDE: ¿Con usted  ha logrado superar todos los obstáculos y ayudantes malvados que he puesto exclusivamente para usted con tal de recuperar a su amada?",
		window.innerWidth / 2,
		window.innerHeight / 2 + 250
	);

	app.stage.addChild(dialog1);
	createButtonAt(
		window.innerWidth / 2,
		5,
		"Continuar",
		async () => {
			app.stage.removeChild(dialog1);

			const dialog2 = await showDialog(
				dialogImg,
				"DAVID: Si, todo lo superé por amor..(no hizo mucho igual) ",
				window.innerWidth / 2,
				window.innerHeight / 2 + 250
			);

			app.stage.addChild(dialog2);
			createButtonAt(
				window.innerWidth / 2,
				5,
				"Continuar",
				async () => {
					app.stage.removeChild(dialog2);

					const dialog3 = await showDialog(
						dialogImg,
						"DAVID: Ahora devuélveme a mi chica!",
						window.innerWidth / 2,
						window.innerHeight / 2 + 250
					);

					app.stage.addChild(dialog3);
					createButtonAt(
						window.innerWidth / 2,
						5,
						"Continuar",
						async () => {
							app.stage.removeChild(dialog3);
							const dialog4 = await showDialog(
								dialogImg,
								"CONDE: Sabes chico? eres valiente y de verdad que alguien fuerte, admiro tu fortaleza.. al final del dia.. yo buscaba algo que no podría tener de esta manera…",
								window.innerWidth / 2,
								window.innerHeight / 2 + 250
							);

							app.stage.addChild(dialog4);
							createButtonAt(
								window.innerWidth / 2,
								5,
								"Continuar",
								async () => {
									app.stage.removeChild(dialog4);
									setTimeout(() => {
										location.reload();
									}, 3000);
								}
							);
						}
					);
				}
			);
		}
	);
}
