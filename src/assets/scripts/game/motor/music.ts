import PIXISound from 'pixi-sound';
import backgroundSound from "../../../sound/background-music.mp3"

PIXISound.add('background', backgroundSound);

export function playMusic() {
    PIXISound.play('background', { loop: true });
    setVolume(50);
}

export function stopMusic() {
    PIXISound.stop('background');
}

export function setVolume(volume: number) {
    const initialVolume = volume / 100;
    PIXISound.volume('background', initialVolume);
    localStorage.setItem("volume", volume.toString());
}
