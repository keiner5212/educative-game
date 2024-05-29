// page size
document.body.style.height = `${visualViewport?.height}px`

// styles
import "./style.css"
import "./assets/scripts/components/modal.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./assets/styles/background.css"

// imports
import { createModal } from './assets/scripts/components/modal';
import { IsMobile, openModal } from './assets/scripts/utils';
import { ShowMenu } from "./assets/scripts/game/menu";
import { playMusic } from "./assets/scripts/game/motor/music";

const acepted = localStorage.getItem("accepted")
if (acepted == "true") {
    if (localStorage.getItem("music") == "true" || !localStorage.getItem("music")) {
        playMusic()
    }
    ShowMenu()
} else {
    createModal("Informacion", "El siguiente juego es educativo y solo esta disponible en el navegador web para computadores", "Ok", "Salir",
        () => {
            if (IsMobile()) {
                document.location.href = "https://google.com";
            } else {
                localStorage.setItem("accepted", "true")
                playMusic()
                ShowMenu()
            }
        },
        () => {
            document.location.href = "https://google.com";
        }
    )
    openModal()
}

