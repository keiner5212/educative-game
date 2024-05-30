import { CreateGame } from ".";
import "../../styles/menu.css";
import { credits, loader, settings } from "../components/modal";
import { openModal, removeBackground } from "../utils";
import menuImg from "../../img/personajes/villano animacion/UntitledArtwork2 - 1.png";

export function removeMenu() {
	document.querySelector(".menu-wrapper")?.remove();
}

export function setMenuActions() {
	setTimeout(() => {
		document
			.getElementById("play-button")
			?.addEventListener("click", () => {
				removeMenu();
				removeListeners()
				removeBackground();
				loader();
				openModal();
				CreateGame();
			});

		document
			.getElementById("settings-button")
			?.addEventListener("click", () => {
				settings();
				removeListeners()
				openModal();
			});

		document
			.getElementById("credits-button")
			?.addEventListener("click", () => {
				credits();
				removeListeners()
				openModal();
			});
	}, 500);
}

function removeListeners() {
	document.getElementById("play-button")?.removeEventListener("click", () => {
		removeMenu();
		removeBackground();
		loader();
		openModal();
		CreateGame();
	});

	document
		.getElementById("settings-button")
		?.removeEventListener("click", () => {
			settings();
			openModal();
		});

	document
		.getElementById("credits-button")
		?.removeEventListener("click", () => {
			credits();
			openModal();
		});
}

export function ShowMenu() {
	const wraper = document.getElementById("root-wraper");
	if (!wraper) return;
	wraper.innerHTML += `
        <div class="menu-wrapper">
            <div class="menu">
                <h1 class="menu-title">Educative <span class="neonText">Game</span></h1>
                <img class="menu-img" src="${menuImg}" alt="menu" />
                <button id="play-button" class="button is-success">Play</button>
                <button id="settings-button" class="button is-info">Settings</button>
                <button id="credits-button" class="button is-warning">Credits</button>
            </div>
        </div>
    `;

	setMenuActions();
}
