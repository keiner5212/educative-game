import { ShowMenu } from "../game/menu"
import { setVolume } from "../game/music"
import { accept, closeModal, closeModalXButton, decline } from "../utils"

export function createModal(title: string, message: string, okMessage: string, decMessage: string, acceptF: any, declineF: any) {
    document.body.innerHTML += `
        <div class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">${title}</p>
                    <button id="close-modal" class="delete" aria-label="close"><i class="fa-regular fa-circle-xmark"></i></button>
                </header>
                <section class="modal-card-body">
                    <p>${message}</p>
                </section>
                <footer class="modal-card-foot">
                    <button id="modal-accept-button" class="button is-success">${okMessage}</button>
                    <button id="modal-decline-button" class="button">${decMessage}</button>
                </footer>
            </div>
        </div>
    `

    document.getElementById('close-modal')?.addEventListener('click', () => {
        closeModalXButton()
    })

    document.getElementById('modal-accept-button')?.addEventListener('click', () => {
        accept(acceptF)
    })

    document.getElementById('modal-decline-button')?.addEventListener('click', () => {
        decline(declineF)
    })
}


export function settings() {
    document.body.innerHTML += `
        <div class="modal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Settings</p>
                    <button id="close-modal" class="delete" aria-label="close"><i class="fa-regular fa-circle-xmark"></i></button>
                </header>
                <section class="modal-card-body">
                    <div class="PB-range-slider-div">
                        <label for="volume-range">Volume: </label>
                        <input type="range" min="0" max="100" value=${localStorage.getItem("volume")} class="PB-range-slider" id="volume-range">
                        <p class="PB-range-slidervalue">${localStorage.getItem("volume")}%</p>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button id="modal-accept-button" class="button is-success">Apply</button>
                    <button id="modal-decline-button" class="button">Cancel</button>
                </footer>
            </div>
        </div>
    `

    const slider = document.getElementById('volume-range') as HTMLInputElement

    slider?.addEventListener('input', () => {
        const volume = document.querySelector('.PB-range-slidervalue')
        if (slider && volume) {
            volume.innerHTML = `${slider ? slider.value : 0}%`
        }
    })

    document.getElementById('close-modal')?.addEventListener('click', () => {
        closeModal()
        ShowMenu()
    })

    document.getElementById('modal-accept-button')?.addEventListener('click', () => {
        const slider = document.getElementById('volume-range') as HTMLInputElement
        if (slider) {
            setVolume(parseInt(slider.value))
        }

        closeModal()
        ShowMenu()
    })

    document.getElementById('modal-decline-button')?.addEventListener('click', () => {
        closeModal()
        ShowMenu()
    })


}