import { accept, closeModalXButton, decline } from "../utils"

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
