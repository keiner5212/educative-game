// page size
document.body.style.height = `${visualViewport?.height}px`
document.body.style.width = `${visualViewport?.width}px`

// styles
import "./style.css"
import "./assets/scripts/components/modal.css"
import '@fortawesome/fontawesome-free/css/all.min.css';
import "./assets/styles/background.css"

// imports
import { createModal } from './assets/scripts/components/modal';
import { IsMobile, openModal } from './assets/scripts/utils';
import { CreateGame } from "./assets/scripts/game";

createModal("Informacion", "El siguiente juego es educativo y solo esta disponible en el navegador web para computadores", "Ok", "Salir",
    () => {
        if (IsMobile()) {
            document.location.href = "https://google.com";
        } else {
            CreateGame()
        }
    },
    () => {
        document.location.href = "https://google.com";
    }
)
openModal()
