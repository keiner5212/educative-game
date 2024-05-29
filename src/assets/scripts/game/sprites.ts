//sprites
import backgroundImg1 from "../../img/world/bg/bg-3.png";
import groundTile1 from "../../img/world/Tiles/tile_0002.png";
import subgroundTile1 from "../../img/world/Tiles/tile_0004.png";
import dialogIMG from "../../img/dialog.png";

// enemySprites
import slimeenemyImg1 from "../../img/personajes/mounstros/slime/slime1.png";
import slimeenemyImg2 from "../../img/personajes/mounstros/slime/slime7.png";
import slimeenemyJumpImg1 from "../../img/personajes/mounstros/slime/slime4.png";
import slimeenemyJumpImg2 from "../../img/personajes/mounstros/slime/slime3.png";

//quiet
import characterImg1 from "../../img/personajes/main-character/estatico/esposo estatico1.png";
import characterImg2 from "../../img/personajes/main-character/estatico/esposo estatico2.png";
import characterImg3 from "../../img/personajes/main-character/estatico/esposo estatico3.png";
import characterImg4 from "../../img/personajes/main-character/estatico/esposo estatico4.png";

//walk
import WcharacterImg1 from "../../img/personajes/main-character/caminando/esposo caminando1.png";
import WcharacterImg2 from "../../img/personajes/main-character/caminando/esposo caminando2.png";
import WcharacterImg3 from "../../img/personajes/main-character/caminando/esposo caminando3.png";
import WcharacterImg4 from "../../img/personajes/main-character/caminando/esposo caminando4.png";

//jump
import mainCHjumpImg1 from "../../img/personajes/main-character/saltando/esposo saltando3.png";
import mainCHjumpImg3 from "../../img/personajes/main-character/saltando/esposo saltando4.png";

// scene sprites
import womanScene1 from "../../scenes/woman/frame_0_delay-0.13s.png";
import womanScene2 from "../../scenes/woman/frame_1_delay-0.18s_1.png";
import womanScene3 from "../../scenes/woman/frame_2_delay-0.14s_1.png";
import womanScene4 from "../../scenes/woman/frame_3_delay-0.18s_1.png";

import manScene1 from "../../scenes/main-character/frame_0_delay-0.16s.png";
import manScene2 from "../../scenes/main-character/frame_1_delay-0.14s.png";
import manScene3 from "../../scenes/main-character/frame_2_delay-0.16s.png";
import manScene4 from "../../scenes/main-character/frame_3_delay-0.14s.png";
import manScene5 from "../../scenes/main-character/frame_4_delay-0.16s.png";

import enemyScene1 from "../../scenes/enamy/frame_0_delay-0.2s.png";
import enemyScene2 from "../../scenes/enamy/frame_1_delay-0.2s.png";
import enemyScene3 from "../../scenes/enamy/frame_2_delay-0.2s.png";
import enemyScene4 from "../../scenes/enamy/frame_3_delay-0.19s.png";

//filters
import { OldFilmFilter } from "pixi-filters";
import { NoiseFilter } from "pixi.js";

// sprites

export const backgroundImg = backgroundImg1;
export const groundTile = groundTile1;
export const subgroundTile = subgroundTile1;
export const dialogImg = dialogIMG;

// character sprites
export const spriteImages = [
	characterImg1,
	characterImg2,
	characterImg3,
	characterImg4,
];
export const WspriteImages = [
	WcharacterImg1,
	WcharacterImg2,
	WcharacterImg3,
	WcharacterImg4,
];
export const JspriteImages = [mainCHjumpImg1, mainCHjumpImg3];
export const slimeenemySprites = [slimeenemyImg1, slimeenemyImg2];
export const slimeenemyJSprites = [slimeenemyJumpImg1, slimeenemyJumpImg2];

export const mangif = [manScene1, manScene2, manScene3, manScene4, manScene5];
export const womangif = [womanScene1, womanScene2, womanScene3, womanScene4];
export const enemygif = [enemyScene1, enemyScene2, enemyScene3, enemyScene4];

//filters

export const filmSepiaFilter = new OldFilmFilter({
	sepia: 0.4,
	scratch: 0,
});

export const noiseFilter = new NoiseFilter();
