//sprites
import backgroundImg1 from "../../img/world/bg/bg-3.png";
import groundTile1 from "../../img/world/Tiles/tile_0002.png";
import subgroundTile1 from "../../img/world/Tiles/tile_0004.png";
import dialogIMG from "../../img/dialog.png";
import subwaterImg from "../../img/world/Tiles/tile_0073.png";
import waterImg from "../../img/world/Tiles/tile_0053.png";
import filledHeart1 from "../../img/world/Tiles/tile_0044.png";
import emptyHeart1 from "../../img/world/Tiles/tile_0046.png";
import finalSceneImg from "../../img/fondo para escena final.jpg";
import platformImg1 from "../../img/world/Tiles/tile_0029.png";


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
import { ColorMatrixFilter, NoiseFilter } from "pixi.js";

// sprites

export const backgroundImg = backgroundImg1;
export const groundTile = groundTile1;
export const subgroundTile = subgroundTile1;
export const dialogImg = dialogIMG;
export const subwaterImg1 = subwaterImg;
export const waterImg1 = waterImg;
export const filledHeart = filledHeart1;
export const emptyHeart = emptyHeart1;
export const finalSceneImg1 = finalSceneImg;
export const platformImg = platformImg1;

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
	noise: 0.4,
	scratch: 0,
});

export const redFilter = new ColorMatrixFilter();
	redFilter.greyscale(0.5, false);
	redFilter.brightness(1.5, false);
	redFilter.tint(0xff0000, false);

export const noiseFilter = new NoiseFilter();


// riddles
export const riddles = [
	{
		question:
			"Redondo soy y es cosa anunciada. Si estoy a la derecha algo valgo, pero a la izquierda soy nada. ¿Cuál número soy?",
		answer: "0",
	},
	{
		question:
			"Si quieres contar, por qué tienes que empezar. ¿Cuál número soy?",
		answer: "1",
	},
	{
		question:
			"Corren más que los minutos, pero nunca son los primeros. ¿Quiénes son?",
		answer: "Los segundos",
	},
	{
		question:
			"¿Qué número tiene el mismo número de letras que el valor que expresa?",
		answer: "5",
	},
	{
		question:
			"Vuelo de noche, duermo en el día y nunca veras plumas en ala mía.",
		answer: "Murciélago",
	},
	{
		question:
			"Canto en la orilla, vivo en el agua, no soy pescado ni cigarra. ¿Quién soy?",
		answer: "Rana",
	},
	{
		question:
			"Soy un insecto que vuela entre las flores, tengo dos alitas de muchos colores.",
		answer: "mariposa",
	},
	{
		question:
			"Dos pinzas tengo y hacia atrás camino, de mar o de río en el agua vivo. ¿Quién soy?",
		answer: "el cangrejo",
	},
	{
		question:
			"Preparo ricos manjares, mi lugar es la casa de restaurantes y hoteles. ¿Veamos quién lo adivina?",
		answer: "chef",
	},
	{
		question:
			"Con madera de pino, haya o de nogal construyo los muebles para tu hogar.",
		answer: "carpintero",
	},
	{
		question:
			"Es el héroe de la comunidad y la cuida noche y día para conservar la seguridad.",
		answer: "policía",
	},
	{
		question:
			"Con una manguera, casco y escalera, apago el fuego de la hoguera. ¿Quién soy?",
		answer: "bombero",
	},
	{
		question: "Dificil",
		answer: "El agujero",
	},
	{
		question: "Van siempre en la sopa, pero nunca has de comerlos.",
		answer: "plato y cuchara",
	},
	{
		question:
			"No muerde ni ladra, pero tiene dientes y la casa guarda. ¿Qué es?",
		answer: "llave",
	},
	{
		question: "¿cuál es el ave que tiene la panza llana?",
		answer: "avellana",
	},
	{
		question:
			"Muchas lamparitas muy bien colgaditas, siempre encandiladas, y nadie las atiza.",
		answer: "las estrellas",
	},
	{
		question:
			"Es más grande, muy grande, mayor que la Tierra. Arde y no se quema, quema y no es candela.",
		answer: "el sol",
	},
	{
		question:
			"¿Cuál es aquel pobrecito, siempre andando, siempre andando, y no sale de su sitio?",
		answer: "el reloj",
	},
];
