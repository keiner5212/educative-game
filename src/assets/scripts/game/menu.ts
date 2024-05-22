import { CreateGame } from ".";
import "../../styles/menu.css"
import { settings } from "../components/modal"
import { openModal, removeBackground } from "../utils"
import menuImg from "../../img/UntitledArtwork1 - 3.png"

export function removeMenu() {
    document.querySelector('.menu-wrapper')?.remove();
}

export function ShowMenu() {
    document.body.innerHTML += `
        <div class="menu-wrapper">
            <div class="menu">
                <h1 class="menu-title">Educative <span class="neonText">Game</span></h1>
                <img class="menu-img" src="${menuImg}" alt="menu" />
                <button id="play-button" class="button is-success">Play</button>
                <button id="settings-button" class="button is-info">Settings</button>
                <button id="credits-button" class="button is-warning">Credits</button>
            </div>
        </div>
    `

    document.getElementById('play-button')?.addEventListener('click', () => {
        removeMenu()
        removeBackground()
        CreateGame()
    })

    document.getElementById('settings-button')?.addEventListener('click', () => {
        settings()
        openModal()
        removeMenu()
    })

    document.getElementById('credits-button')?.addEventListener('click', () => {
        // credits()
        console.log("credits");
    })

}