import { sound as PIXISound } from "@pixi/sound";
import backgroundSound from "../../../sound/background-music.mp3";
import playerDeathSound from "../../../sound/male-death-sound-128357.mp3";
import playerJumpSound from "../../../sound/cartoon-jump-6462.mp3";
import monsterDeathSound from "../../../sound/monster-death-grunt-131480.mp3";

PIXISound.add("background", backgroundSound);
PIXISound.add("player-death", playerDeathSound);
PIXISound.add("player-jump", playerJumpSound);
PIXISound.add("monster-death", monsterDeathSound);


export function playMusic() {
	PIXISound.play("background", { loop: true });
	setVolume(50);
}

export function stopMusic() {
	PIXISound.stop("background");
}

export function setVolume(volume: number) {
	const initialVolume = volume / 100;
	PIXISound.volume("background", initialVolume);
	localStorage.setItem("volume", volume.toString());
}

export function playSound(sound: string) {
	PIXISound.play(sound);
}